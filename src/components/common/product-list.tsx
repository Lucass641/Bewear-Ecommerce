"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import ProductVariantItem from "./product-variant-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
      },
    })),
  );

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => checkScrollButtons();
    const handleResize = () => checkScrollButtons();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      checkScrollButtons();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [allVariants]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold md:text-2xl">{title}</h3>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {allVariants.map((variant) => (
            <div
              key={variant.id}
              className="w-[150px] flex-shrink-0 md:w-[200px] xl:w-[300px] 2xl:w-[300px]"
            >
              <ProductVariantItem variant={variant} />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 left-0 z-10 hidden -translate-x-4 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-md backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-white hover:shadow-lg md:block"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 right-0 z-10 hidden translate-x-4 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-md backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-white hover:shadow-lg md:block"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductList;
