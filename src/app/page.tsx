import { desc } from "drizzle-orm";
import Image from "next/image";

import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProduct = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return (
    <div className="md:mx-10 mx-auto max-w-full space-y-6 md:space-y-12">
      {/* Hero Banner Section */}
      <div className="px-5">
        <div>
          {/* Mobile Banner */}
          <div className="md:hidden">
            <div className="flex items-center justify-center">
              <Image
                src="/banner-01.png"
                alt="Leve uma vida com estilo"
                height={0}
                width={0}
                sizes="100vw"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Desktop Banner */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center">
              <Image
                src="/banner-03.png"
                alt="Leve uma vida com estilo"
                height={100}
                width={100}
                sizes="100vw"
                className=" h-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <ProductList products={products} title="Mais vendidos" />
      </div>

      {/* Additional banners section */}
      <div className="px-5">
        <div>
          {/* Mobile: Single banner */}
          <div className="md:hidden">
            <div className="flex items-center justify-center">
              <Image
                src="/banner-02.png"
                alt="Seja autêntico"
                height={0}
                width={0}
                sizes="100vw"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>
    
          <div className="hidden md:flex md:items-center md:justify-center md:gap-6 w-full">
            <div className="flex flex-col items-center justify-center space-y-12 flex-3">
              <Image
                src="/banner-05.png"
                alt="Nike Therma FIT Headed"
                height={0}
                width={0}
                sizes="100vw"
                className="h-auto w-full rounded-lg object-contain"
              />

              <Image
                src="/banner-06.png"
                alt="Nike Therma FIT Headed"
                height={0}
                width={0}
                sizes="100vw"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>

            <div className="flex items-center justify-center flex-5">
              <Image
                src="/banner-04.png"
                alt="Nike Therma FIT Headed"
                height={0}
                width={0}
                sizes="100vw"
                className="h-auto max-h-full w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <ProductList products={newlyCreatedProduct} title="Novos produtos" />
      </div>
    </div>
  );
};

export default Home;
