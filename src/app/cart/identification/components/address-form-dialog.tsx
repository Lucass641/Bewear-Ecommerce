"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useViaCep } from "@/hooks/queries/use-via-cep";

const formSchema = z.object({
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
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(1, "Estado é obrigatório."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (addressId: string) => void;
}

const AddressFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddressFormDialogProps) => {
  const createShippingAddressMutation = useCreateShippingAddress();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const zipCode = form.watch("zipCode");
  const {
    data: viaCepData,
    isLoading: isLoadingViaCep,
    error: viaCepError,
  } = useViaCep(zipCode);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && viaCepData && !viaCepError) {
      e.preventDefault();
      handleSelectCep();
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const newAddress =
        await createShippingAddressMutation.mutateAsync(values);

      form.reset();
      onSuccess(newAddress.id);
      onOpenChange(false);
      toast.success("Endereço criado com sucesso!");
    } catch (error) {
      console.error("Error creating address:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar endereço. Tente novamente.");
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleFieldChange = (
    field: { onChange: (value: string) => void; name: keyof FormValues },
    value: string,
  ) => {
    field.onChange(value);
    if (value) {
      form.clearErrors(field.name);
    }
  };

  const handleSelectCep = () => {
    if (viaCepData && !viaCepError) {
      form.setValue("address", viaCepData.logradouro);
      form.setValue("neighborhood", viaCepData.bairro);
      form.setValue("city", viaCepData.localidade);
      form.setValue("state", viaCepData.uf);

      // Limpar erros dos campos preenchidos automaticamente
      form.clearErrors(["address", "neighborhood", "city", "state"]);

      toast.success("Endereço preenchido automaticamente!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Novo endereço de entrega</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          fieldState.error?.message ||
                          "Digite seu nome completo"
                        }
                        {...field}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="(##) #####-####"
                        placeholder={
                          fieldState.error?.message || "(11) 99999-9999"
                        }
                        customInput={Input}
                        {...field}
                        onValueChange={(values) =>
                          handleFieldChange(field, values.value)
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <div className="relative flex-1">
                        <PatternFormat
                          format="#####-###"
                          placeholder={fieldState.error?.message || "00000-000"}
                          customInput={Input}
                          {...field}
                          onValueChange={(values) =>
                            handleFieldChange(field, values.value)
                          }
                          onKeyDown={handleKeyDown}
                          className={
                            fieldState.error ? "border-destructive" : ""
                          }
                        />
                        {isLoadingViaCep && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleSelectCep}
                      className="shrink-0"
                      disabled={!viaCepData || !!viaCepError || isLoadingViaCep}
                    >
                      <Search />
                    </Button>
                  </div>

                  {viaCepError && (
                    <p className="text-destructive text-sm">
                      CEP não encontrado. Verifique e tente novamente.
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          fieldState.error?.message || "Digite seu endereço"
                        }
                        {...field}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={fieldState.error?.message || "Nº"}
                        {...field}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apto, bloco, etc."
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          fieldState.error?.message || "Digite o bairro"
                        }
                        {...field}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          fieldState.error?.message || "Digite a cidade"
                        }
                        {...field}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={fieldState.error?.message || "UF"}
                        maxLength={2}
                        {...field}
                        value={field.value?.toUpperCase() || ""}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value.toUpperCase())
                        }
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={handleClose}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="flex-1 rounded-full"
                disabled={createShippingAddressMutation.isPending}
              >
                {createShippingAddressMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar endereço"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;
