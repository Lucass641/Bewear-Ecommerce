import { NextResponse } from "next/server";

import { db } from "@/db";

export async function GET() {
  try {
    const categories = await db.query.categoryTable.findMany({});
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
