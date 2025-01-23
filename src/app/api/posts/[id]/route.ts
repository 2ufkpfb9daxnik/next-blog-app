import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma クライアントのインポート

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     return NextResponse.json(post);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch post" },
//       { status: 500 }
//     );
//   }
// }

type RouteParams = {
  params: {
    id: string;
  };
};

export const GET = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    // パラメータプレースホルダから id を取得
    const id = routeParams.params.id;

    // findUnique は id に一致する「1件」のレコードを取得するメソッド
    // もし条件に一致するレコードが存在しないときは null が戻り値となる
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        coverImageURL: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // 投稿記事が存在しないときの ( post が null のときの) 処理
    if (!post) {
      return NextResponse.json(
        { error: `id='${id}'の投稿記事は見つかりませんでした` },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const post = await prisma.post.delete({ where: { id } });
    return NextResponse.json({ msg: `「${post.title}」を削除しました。` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // ここでidを取得

  // リクエストボディからデータを取得
  const { title, content, coverImageUrl, categoryIds } = await req.json();

  if (!title || !content || !coverImageUrl || !categoryIds) {
    return NextResponse.json(
      { error: "すべてのフィールドを入力してください" },
      { status: 400 }
    );
  }

  try {
    // トランザクションを使用してデータの整合性を保つ
    const updatedPost = await prisma.$transaction(async (prisma) => {
      // 中間テーブルから現在の紐づけ情報を削除
      await prisma.postCategory.deleteMany({
        where: { postId: id },
      });

      // 投稿記事の内容を更新
      const post = await prisma.post.update({
        where: { id },
        data: { title, content, coverImageURL: coverImageUrl },
      });

      // 中間テーブルに新しい紐づけ情報を追加
      await prisma.postCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          postId: id,
          categoryId,
        })),
      });

      return post;
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の更新に失敗しました" },
      { status: 500 }
    );
  }
}
