"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import dayjs from "dayjs";
import DOMPurify from "isomorphic-dompurify";
import type { Post } from "@/app/_types/Post";
import { supabase } from "@/utils/supabase";

const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 投稿データの取得
        const response = await fetch(`/api/posts/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("投稿の取得に失敗しました");
        }

        const data = (await response.json()) as Post;
        setPost(data);

        // coverImageKey を使用するように修正
        // if (data.coverImageKey) {
        //   const { data: urlData } = supabase.storage
        //     .from("cover_image")
        //     .getPublicUrl(data.coverImageKey);
        //   setImageUrl(urlData.publicUrl);
        // }
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
        <span>読み込み中...</span>
      </div>
    );
  }

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  if (!post) {
    return <div>投稿が見つかりません。</div>;
  }

  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  const safeTitle = DOMPurify.sanitize(post.title, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main className="mx-auto max-w-4xl p-4">
      <article className="space-y-4">
        <header className="space-y-2">
          <h1
            className="text-3xl font-bold"
            dangerouslySetInnerHTML={{ __html: safeTitle }}
          />
          <div className="flex items-center justify-between">
            <time className="text-sm text-gray-500">
              {dayjs(post.createdAt).format("YYYY-MM-DD")}
            </time>
            <div className="flex gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-md border px-2 py-1 text-sm text-gray-500"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </header>

        {imageUrl && (
          <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={`${post.title}のカバー画像`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </article>
    </main>
  );
};

export default Page;
