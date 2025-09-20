"use client";

import { Package } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const EmptyOrdersState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-full bg-gray-100 p-6">
        <Package className="h-12 w-12 text-gray-400" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Nenhum pedido encontrado
      </h2>

      <p className="mb-8 max-w-md text-gray-600">
        Você ainda não fez nenhum pedido. Explore nossa coleção e encontre as
        melhores peças para o seu estilo.
      </p>

      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/">Começar a comprar</Link>
      </Button>
    </div>
  );
};

export default EmptyOrdersState;
