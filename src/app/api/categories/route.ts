import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Category } from "@prisma/client";

// [GET] /api/categories カテゴリ一覧の取得
export const GET = async (req: NextRequest) => {
  try {
    console.log("テスト");
    const categories = await prisma.category.findMany({
      // select: {
      //   id: true,
      //   name: true,
      //   _count: {
      //     select: {
      //       posts: true,
      //     },
      //   },
      // },
      orderBy: {
        createdAt: "desc",
      },
    });
    // throw new Error("テストエラー");
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの取得に失敗しました" },
      { status: 500 } // 500: Internal Server Error
    );
  }
};
