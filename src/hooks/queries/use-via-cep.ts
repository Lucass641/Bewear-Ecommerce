import { useQuery } from "@tanstack/react-query";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const viaCepQueryKey = (zipCode: string) => ["via-cep", zipCode];

export const useViaCep = (zipCode: string) => {
  const cleanZipCode = zipCode.replace(/\D/g, "");

  return useQuery({
    queryKey: viaCepQueryKey(cleanZipCode),
    queryFn: async (): Promise<ViaCepResponse> => {
      if (cleanZipCode.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos");
      }

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanZipCode}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      return data;
    },
    enabled: cleanZipCode.length === 8,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    retry: 1,
  });
};
