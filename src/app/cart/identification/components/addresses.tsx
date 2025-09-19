"use client";

import { IdCard, Loader2, Plus, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useDeleteShippingAddress } from "@/hooks/mutations/use-delete-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-addresses";

import { formatAddress } from "../../helpers/address";
import AddressFormDialog from "./address-form-dialog";

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteShippingAddressMutation = useDeleteShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses, isPending } = useUserAddresses({
    initialData: shippingAddresses,
  });

  const handleAddressCreated = async (addressId: string) => {
    setSelectedAddress(addressId);

    // Verificar se estamos no fluxo "Buy Now"
    const buyNowFlag = localStorage.getItem("buyNow");
    const tempCartId = localStorage.getItem("temporaryCartId");

    const updateData: UpdateCartShippingAddressSchema = {
      shippingAddressId: addressId,
    };

    // Se estamos no fluxo "Buy Now", passar o cartId do carrinho temporário
    if (buyNowFlag === "true" && tempCartId) {
      updateData.cartId = tempCartId;
    }
    await updateCartShippingAddressMutation.mutateAsync(updateData);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteShippingAddressMutation.mutateAsync(addressId);
      toast.success("Endereço removido com sucesso!");

      if (selectedAddress === addressId) {
        setSelectedAddress(null);
      }
    } catch (error) {
      toast.error("Erro ao remover endereço. Tente novamente.");
      console.error(error);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) return;

    try {
      const buyNowFlag = localStorage.getItem("buyNow");
      const tempCartId = localStorage.getItem("temporaryCartId");

      const updateData: UpdateCartShippingAddressSchema = {
        shippingAddressId: selectedAddress,
      };

      if (buyNowFlag === "true" && tempCartId) {
        updateData.cartId = tempCartId;
      }
      await updateCartShippingAddressMutation.mutateAsync(updateData);
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.error(error);
    }
  };

  const isConfirmOrderLoading = updateCartShippingAddressMutation.isPending;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-semibold md:text-xl">
            <IdCard />
            Identificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="py-4 text-center">
              <p>Carregando endereços...</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedAddress}
              onValueChange={setSelectedAddress}
            >
              {addresses?.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">
                    Você ainda não possui endereços cadastrados.
                  </p>
                </div>
              )}

              {addresses?.map((address) => (
                <Card
                  key={address.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between space-x-3">
                      <div className="flex flex-1 items-center space-x-3">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor={address.id}
                            className="block cursor-pointer"
                          >
                            <p className="text-sm leading-relaxed break-words whitespace-pre-line">
                              {formatAddress(address)}
                            </p>
                          </Label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={deleteShippingAddressMutation.isPending}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-muted-foreground/25 hover:border-muted-foreground/50 border-2 border-dashed transition-colors">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    type="button"
                    className="w-full hover:bg-transparent"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <div className="flex flex-col items-center space-y-2 py-4">
                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                        <Plus className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">
                        Adicionar novo endereço
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Preencha os dados de entrega
                      </span>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </RadioGroup>
          )}

          {selectedAddress && (
            <div className="mt-6">
              <Button
                onClick={handleConfirmOrder}
                className="w-full rounded-full"
                disabled={isConfirmOrderLoading}
                size="lg"
              >
                {isConfirmOrderLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isConfirmOrderLoading ? "Processando..." : "Confirmar pedido"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddressFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleAddressCreated}
      />
    </>
  );
};

export default Addresses;
