"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import dayjs from "dayjs";
import DOMPurify from "isomorphic-dompurify";
import type { Post } from "@/app/_types/Post";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const formattedDate = (date: string) => dayjs(date).format("YYYY-MM-DD");

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };
  // const apiBaseEp = process.env.NEXT_PUBLIC_MICROCMS_BASE_EP!;
  // const apiKey = process.env.NEXT_PUBLIC_MICROCMS_API_KEY!;

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(
    () => {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          // microCMS から記事データを取得
          // const requestUrl = `${apiBaseEp}/posts/${id}`;
          // const response = await fetch(requestUrl, {
          //   method: "GET",
          //   cache: "no-store",
          //   headers: {
          //     "X-MICROCMS-API-KEY": apiKey,
          //   },
          // });
          console.log("id:", id);
          const response = await fetch(`/api/posts/${id}`, {
            method: "GET",
            cache: "no-store",
          });
          console.log("API response:", response);
          if (!response.ok) {
            console.error("API request failed with status:", response.status);
            throw new Error("データの取得に失敗しました");
          }
          const data = await response.json();
          setPost(data as Post);
        } catch (e) {
          setFetchError(
            e instanceof Error ? e.message : "予期せぬエラーが発生しました"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    },
    [id]
    //  [apiBaseEp, apiKey, id]
  );

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  // タイトルのサニタイズ
  const safeTitle = DOMPurify.sanitize(post.title, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main>
      <div className="space-y-2">
        <div
          className="mb-2 text-2xl font-bold"
          dangerouslySetInnerHTML={{ __html: safeTitle }}
        ></div>
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            {formattedDate(post.createdAt)}
          </div>
          <div className="flex space-x-2">
            {post.categories.map((category) => (
              <div
                key={category.id}
                className="rounded-md border px-2 text-sm text-gray-500"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        {post.coverImage && (
          <div>
            <Image
              src={post.coverImage.url}
              alt="Example Image"
              width={post.coverImage.width}
              height={post.coverImage.height}
            />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
        {/* <div>{post.content}</div> */}
      </div>
    </main>
  );
};

export default Page;
