import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";
import { error } from "console";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

//単一記事の取得
export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
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

    if (!post) {
      return NextResponse.json(
        { error: `id='${id}'の投稿記事は見つかりませんでした` },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};

//単一記事の削除
export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  try {
    const post: Post = await prisma.post.delete({ where: { id } });
    if (!post) {
      return NextResponse.json(
        { error: "削除する投稿記事が見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json({ msg: `「${post.title}」を削除しました。` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};

//投稿記事の更新
type RequestBody = {
  title: string;
  content: string;
  coverImageKey: string;
  categoryIds: string[];
};

export const PUT = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  try {
    const { title, content, coverImageKey, categoryIds }: RequestBody =
      await req.json();

    //カテゴリIDの検証
    const validCategories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    if (validCategories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: " 無効なカテゴリIDが含まれています" },
        { status: 400 }
      );
    }

    //トランザクションを使用してデータの整合性を保つ
    const updatedPost = await prisma.$transaction(async (prisma) => {
      //中間テーブルから現在の紐づけ情報を削除
      await prisma.postCategory.deleteMany({
        where: { postId: id },
      });

      //投稿記事の内容を更新
      const post = await prisma.post.update({
        where: { id },
        data: { title, content, coverImageKey: coverImageKey },
      });

      //中間テーブルに新しい紐づけ情報を追加
      await prisma.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId: id,
          categoryId,
        })),
      });

      return post;
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの名前変更に失敗しました" },
      { status: 500 }
    );
  }
};
