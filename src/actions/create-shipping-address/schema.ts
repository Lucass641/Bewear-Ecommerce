import z from "zod";

export const createShippingAddressSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      "Telefone deve estar no formato (00) 00000-0000",
    ),
  zipCode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
  address: z.string().min(1, "Endereço é obrigatório."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(1, "Estado é obrigatório."),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
