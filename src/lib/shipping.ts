"use server";

import { z } from "zod";

const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
const MELHOR_ENVIO_BASE_URL =
  process.env.MELHOR_ENVIO_BASE_URL ||
  "https://www.melhorenvio.com.br/api/v2/me";
const COMPANY_ZIP_CODE = "01310-100";

const DEFAULT_PRODUCT_DIMENSIONS = {
  width: 20,
  height: 10,
  length: 30,
};

export interface ShippingOption {
  id: "pac" | "sedex";
  name: string;
  company: string;
  price: number;
  deliveryTime: number;
  logo: string;
}

export interface CalculateShippingData {
  zipCode: string;
  totalValue: number;
  totalWeight: number;
}

const calculateShippingSchema = z.object({
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  totalValue: z.number().min(0.01),
  totalWeight: z.number().min(0.1),
});

interface MelhorEnvioRequest {
  from: { postal_code: string };
  to: { postal_code: string };
  products: Array<{
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }>;
}

interface MelhorEnvioService {
  id: number;
  name: string;
  price: number;
  delivery_time: number;
  company: {
    id: number;
    name: string;
    picture: string;
  };
  error?: string;
}

const SHIPPING_SERVICES = {
  1: { id: "pac" as const, name: "PAC" },
  2: { id: "sedex" as const, name: "SEDEX" },
};

export const calculateShipping = async (
  data: CalculateShippingData,
): Promise<ShippingOption[]> => {
  calculateShippingSchema.parse(data);

  if (!MELHOR_ENVIO_TOKEN) {
    throw new Error("Token do Melhor Envio não configurado");
  }

  const normalizedZipCode = data.zipCode.replace("-", "");

  const melhorEnvioRequest: MelhorEnvioRequest = {
    from: {
      postal_code: COMPANY_ZIP_CODE,
    },
    to: {
      postal_code: normalizedZipCode,
    },
    products: [
      {
        id: "1",
        width: DEFAULT_PRODUCT_DIMENSIONS.width,
        height: DEFAULT_PRODUCT_DIMENSIONS.height,
        length: DEFAULT_PRODUCT_DIMENSIONS.length,
        weight: data.totalWeight,
        insurance_value: data.totalValue,
        quantity: 1,
      },
    ],
  };

  try {
    const response = await fetch(
      `${MELHOR_ENVIO_BASE_URL}/shipment/calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${MELHOR_ENVIO_TOKEN}`,
          "User-Agent": "Aplicação loja@bewear.com",
        },
        body: JSON.stringify(melhorEnvioRequest),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API do Melhor Envio:", errorText);
      throw new Error(`Erro ao calcular frete: ${response.status}`);
    }

    const result: Record<string, MelhorEnvioService> = await response.json();

    const shippingOptions: ShippingOption[] = Object.values(result)
      .filter(
        (service) =>
          !service.error &&
          SHIPPING_SERVICES[service.id as keyof typeof SHIPPING_SERVICES],
      )
      .map((service) => {
        const serviceInfo =
          SHIPPING_SERVICES[service.id as keyof typeof SHIPPING_SERVICES];
        return {
          id: serviceInfo.id,
          name: serviceInfo.name,
          company: service.company.name,
          price: service.price,
          deliveryTime: service.delivery_time,
          logo: service.company.picture,
        };
      })
      .sort((a, b) => a.price - b.price);

    return shippingOptions;
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    throw new Error("Erro interno ao calcular frete");
  }
};
