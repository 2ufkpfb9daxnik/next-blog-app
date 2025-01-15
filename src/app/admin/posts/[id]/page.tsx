"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "../../../_types/Post"; // Post 型をインポート

const AdminPostEditPage = ({ params: { id } }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setCoverImageUrl(data.coverImageUrl);
        setCategoryIds(data.categoryIds);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, coverImageUrl, categoryIds }),
      });
      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }
      const updatedPost = await response.json();
      setPost(updatedPost);
      alert("更新が成功しました");
    } catch (e) {
      alert(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      alert("削除が成功しました");
      router.push("/admin/posts");
    } catch (e) {
      alert(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">投稿記事の編集</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          カバー画像URL
        </label>
        <input
          type="text"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          カテゴリID
        </label>
        <input
          type="text"
          value={categoryIds?.join(", ") || ""}
          onChange={(e) =>
            setCategoryIds(e.target.value.split(",").map((id) => id.trim()))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleUpdate}
        className="mr-2 rounded-md bg-green-500 px-4 py-2 text-white"
      >
        更新
      </button>
      <button
        onClick={handleDelete}
        className="rounded-md bg-red-500 px-4 py-2 text-white"
      >
        削除
      </button>
    </div>
  );
};

export default AdminPostEditPage;
