"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "isomorphic-dompurify";
import prisma from "@/lib/prisma";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 環境変数から「APIキー」と「エンドポイント」を取得
  const apiBaseEp = process.env.NEXT_PUBLIC_MICROCMS_BASE_EP!;
  const apiKey = process.env.NEXT_PUBLIC_MICROCMS_API_KEY!;

  useEffect(() => {
    // microCMS から記事データを取得
    //const requestUrl = `${apiBaseEp}/posts`;
    // const response = await fetch(requestUrl, {
    //   method: "GET",
    //   cache: "no-store",
    //   headers: {
    //     "X-MICROCMS-API-KEY": apiKey,
    //   },
    // }
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = await response.json();

        // デバッグ: response の内容を確認
        console.log("Fetched data:", data);

        // タイトルをサニタイズ
        const sanitizedPosts = data.map((post: Post) => ({
          ...post,
          title: DOMPurify.sanitize(post.title, {
            ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
          }),
        }));

        // タイトルをサニタイズ
        // const sanitizedPosts = data.contents.map((post: Post) => ({
        //   ...post,
        //   title: DOMPurify.sanitize(post.title, {
        //     ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
        //   }),
        // }));

        setPosts(sanitizedPosts);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      }
    };
    fetchPosts();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="mb-2 text-2xl font-bold">Main</div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;
