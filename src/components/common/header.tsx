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

export const Header = () => {
  const { data: session } = authClient.useSession();
  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-2">
        <Cart />
        <div className="h-5 border-l border-gray-200"></div>
        <Sheet>
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
                      <Link href="/authentication">
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

              {/* Menu Navigation */}
              <div className="space-y-4">
                <div className="space-y-2 px-5">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <HomeIcon className="h-5 w-5" />
                    <p className="font-semibold">Início</p>
                  </Link>

                  {session?.user && (
                    <>
                      <Link
                        href="/my-orders"
                        className="flex items-center gap-3 rounded-lg p-3"
                      >
                        <PackageIcon className="h-5 w-5" />
                        <p className="font-semibold">Meus Pedidos</p>
                      </Link>

                      <Link
                        href="/cart/identification"
                        className="flex items-center gap-3 rounded-lg p-3"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        <p className="font-semibold">Carrinho</p>
                      </Link>
                    </>
                  )}
                </div>

                <div className="px-5">
                  <Separator />
                </div>

                {/* Categories */}
                <div className="space-y-1 px-5">
                  <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase">
                    Categorias
                  </h3>

                  <Link
                    href="/category/camisetas"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <p className="font-semibold">Camisetas</p>
                  </Link>

                  <Link
                    href="/category/bermuda-shorts"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <p className="font-semibold">Bermuda & Shorts</p>
                  </Link>

                  <Link
                    href="/category/calcas"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <p className="font-semibold">Calças</p>
                  </Link>

                  <Link
                    href="/category/jaquetas-moletons"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <p className="font-semibold">Jaquetas & Moletons</p>
                  </Link>

                  <Link
                    href="/category/tenis"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <p className="font-semibold">Tênis</p>
                  </Link>

                  <Link
                    href="/category/acessorios"
                    className="flex items-center gap-3 rounded-lg p-3"
                  >
                    <p className="font-semibold">Acessórios</p>
                  </Link>
                </div>

                {/* Logout Button */}
                {session?.user && (
                  <>
                    <div className="px-5">
                      <Separator />
                    </div>

                    <div className="px-5">
                      <button
                        className="text-muted-foreground flex w-full items-center gap-3 p-3 font-semibold"
                        onClick={() => authClient.signOut()}
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
