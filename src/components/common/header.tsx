"use client";
import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const Header = () => {
  const { data: session } = authClient.useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="mb-10 flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-2">
        <Cart />
        <div className="h-5 border-l border-gray-200"></div>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
              <div className="px-5">
                {session?.user ? (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={session?.user?.image as string | undefined}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ")?.[0]?.[0]}
                        {session?.user?.name?.split(" ")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">{session?.user?.name}</h3>
                      <p className="text-muted-foreground block text-xs">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Olá, Faça seu login!</h2>
                    <Button size="lg" asChild className="rounded-full">
                      <Link href="/authentication" onClick={handleLinkClick}>
                        Login
                        <LogInIcon />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="px-5">
                <Separator />
              </div>

              <div className="space-y-6">
                <div className="space-y-6 px-5">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <HomeIcon size={16} />
                    <p className="font-semibold">Início</p>
                  </Link>

                  {session?.user && (
                    <>
                      <Link
                        href="/my-orders"
                        className="flex items-center gap-3 rounded-lg"
                        onClick={handleLinkClick}
                      >
                        <PackageIcon size={16} />
                        <p className="font-semibold">Meus Pedidos</p>
                      </Link>

                      <Link
                        href="/cart/identification"
                        className="flex items-center gap-3 rounded-lg"
                        onClick={handleLinkClick}
                      >
                        <ShoppingCartIcon size={16} />
                        <p className="font-semibold">Carrinho</p>
                      </Link>
                    </>
                  )}
                </div>

                <div className="px-5">
                  <Separator />
                </div>

                <div className="space-y-6 px-5">
                  <h3 className="text-muted-foreground mb-5 font-semibold tracking-wider uppercase">
                    Categorias
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className="justify-start text-base font-semibold"
                        type="button"
                        asChild
                      >
                        <Link
                          href={`/category/${category.slug}`}
                          onClick={handleLinkClick}
                        >
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                {session?.user && (
                  <>
                    <div className="px-5">
                      <Separator />
                    </div>

                    <div className="px-5">
                      <button
                        className="text-muted-foreground flex w-full items-center gap-2 p-2 font-semibold"
                        onClick={() => {
                          authClient.signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOutIcon className="h-5 w-5" />
                        <p>Sair da conta</p>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
