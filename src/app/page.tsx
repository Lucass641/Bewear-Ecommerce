import Image from "next/image";

import CategoryGrid from "@/components/common/category-grid";
import ProductList from "@/components/common/product-list";
import { getAllCategories } from "@/data/categories/get";
import { getNewlyCreatedProducts, getProducts } from "@/data/products/get";

const Home = async () => {
  const [products, newlyCreatedProduct, categories] = await Promise.all([
    getProducts(),
    getNewlyCreatedProducts(),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-[1920px] space-y-6 px-5 md:space-y-12 md:px-10 xl:px-16 2xl:px-20">
      {/* Hero Banner Section */}
      <div>
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
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <ProductList products={products} title="Mais vendidos" />
      </div>
      <div className="md:hidden">
        <CategoryGrid categories={categories} />
      </div>

      {/* Additional banners section */}
      <div>
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

          <div className="hidden w-full md:flex md:justify-between md:gap-7">
            <div className="flex flex-3 flex-col items-center justify-between py-10">
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

            <div className="flex flex-5 items-center justify-center">
              <Image
                src="/banner-04.png"
                alt="Nike Therma FIT Headed"
                height={0}
                width={0}
                sizes="100vw"
                className="my-10 h-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <ProductList products={newlyCreatedProduct} title="Novos produtos" />
      </div>
    </div>
  );
};

export default Home;
