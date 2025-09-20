import "server-only";

import { desc } from "drizzle-orm";

import { db } from "@/db";
import { productTable } from "@/db/schema";

// interface ProductDto {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   category: string;
//   createdAt: Date;
// }

export const getProducts = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  return products;
};

export const getNewlyCreatedProducts = async () => {
  const products = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  return products;
};
