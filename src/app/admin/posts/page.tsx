"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { Post } from "@/app/_types/Post";
import styles from "./AdminPostsPage.module.css"; // CSS モジュールをインポート

const AdminPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      setPosts(sanitizedPosts);
    } catch (e) {
      setFetchError(
        e instanceof Error ? e.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      // 削除後の投稿一覧を更新
      setPosts(posts.filter((post: Post) => post.id !== id));
    } catch (e) {
      setFetchError(
        e instanceof Error ? e.message : "予期せぬエラーが発生しました"
      );
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  return (
    <div>
      <h1>投稿記事一覧</h1>
      <ul className={styles.postList}>
        {posts.map((post: Post) => (
          <li key={post.id} className={styles.postItem}>
            <h2 className={styles.postTitle}>
              タイトル名:{" "}
              <span dangerouslySetInnerHTML={{ __html: post.title }}></span>
            </h2>
            <div className={styles.buttonGroup}>
              <Link href={`/admin/posts/${post.id}`} legacyBehavior>
                <a className={styles.editButton}>編集</a>
              </Link>
              <button
                className={styles.deleteButton}
                onClick={() => deletePost(post.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AdminPostsPage;
