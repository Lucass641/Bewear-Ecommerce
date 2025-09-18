"use client";
import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingCartIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <header className="mb-6 md:mb-10">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-5 md:hidden">
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
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        {/* Top bar with logo centered and user info */}
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            {session?.user ? (
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="relative"
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:bg-background flex items-center gap-2 text-lg font-semibold shadow-none hover:border-none"
                    >
                      <Avatar className="size-10">
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      Olá, {session?.user?.name?.split(" ")?.[0]}
                    </Button>
                  </DropdownMenuTrigger>

                  <div className="absolute right-0 -bottom-6 left-0 h-8 bg-transparent" />

                  <DropdownMenuContent
                    align="start"
                    sideOffset={16}
                    className="relative w-64 overflow-visible rounded-xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-md"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {/* Gota */}
                    <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-t border-l border-gray-200 bg-white/80 backdrop-blur-md" />

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                      >
                        <HomeIcon className="size-6" />
                        Início
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href="/my-orders"
                        className="flex items-center gap-2 text-lg font-semibold"
                      >
                        <PackageIcon className="size-6" />
                        Meus Pedidos
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => authClient.signOut()}
                      className="flex cursor-pointer items-center gap-2 font-semibold text-red-600 hover:bg-red-50/60 hover:text-red-700 focus:bg-red-50/60 focus:text-red-700"
                    >
                      <LogOutIcon className="size-6" />
                      Sair da conta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <User className="size-6" />
                <span className="text-lg font-semibold text-gray-700">
                  Olá!
                </span>
                <Button asChild className="rounded-full">
                  <Link
                    href="/authentication"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    Login
                    <LogInIcon className="size-6" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transform"
          >
            <Image src="/logo.svg" alt="BEWEAR" width={120} height={31.37} />
          </Link>

          <div className="flex items-center gap-4">
            <Cart />
          </div>
        </div>

        {/* Navigation bar with categories */}

        <div className="mx-auto max-w-7xl px-8">
          <nav className="flex items-center justify-between py-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-muted-foreground text-lg font-semibold transition-colors hover:text-gray-900"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
