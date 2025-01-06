"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import dayjs from "dayjs";
import DOMPurify from "isomorphic-dompurify";
import type { Post } from "@/app/_types/Post";
import dummyPosts from "@/app/_mocks/dummyPosts";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = (date: string) => dayjs(date).format("YYYY-MM-DD");

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    // 本来はウェブAPIを叩いてデータを取得するが、まずはモックデータを使用
    // (ネットからのデータ取得をシミュレートして１秒後にデータをセットする)
    setIsLoading(true);
    const timer = setTimeout(() => {
      console.log("ウェブAPIからデータを取得しました (虚言)");
      // dummyPosts から id に一致する投稿を取得してセット
      const foundPost = dummyPosts.find((p) => p.id === id);
      setPost(foundPost || null);
      setIsLoading(false);
    }, 1000); // 1000ミリ秒 = 1秒

    // データ取得の途中でページ遷移したときにタイマーを解除する処理
    return () => clearTimeout(timer);
  }, [id]);

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

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
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
        <div>
          <Image
            src={post.coverImage.url}
            alt="Example Image"
            width={post.coverImage.width}
            height={post.coverImage.height}
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </div>
    </main>
  );
};

export default Page;
