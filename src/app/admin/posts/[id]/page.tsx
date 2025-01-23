"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "../../../_types/Category";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({
    title: "",
    content: "",
    coverImageUrl: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("カテゴリの取得に失敗しました");
        }
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          coverImageUrl: post.coverImageUrl,
          categories: selectedCategories,
        }),
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

  const handleCategoryChange = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((name) => name !== category)
        : [...prev, category]
    );
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">投稿記事の編集</h1>
      <form className="space-y-4">
        <div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600"
            >
              更新
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-white shadow-sm hover:bg-red-600"
            >
              削除
            </button>
          </div>
          <label className="block text-sm font-medium text-gray-700">
            タイトル
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            コンテンツ
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            カバー画像URL
          </label>
          <input
            type="text"
            value={post.coverImageUrl}
            onChange={(e) =>
              setPost({ ...post, coverImageUrl: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-700">カテゴリ</h2>
          {categories.map((category: Category) => (
            <div key={category.id} className="mt-2 flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="size-4 rounded border-gray-300 text-indigo-600"
              />
              <label className="ml-2 text-sm text-gray-700">
                {category.name}
              </label>
            </div>
          ))}
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleUpdate}
            className="rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600"
          >
            更新
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md bg-red-500 px-4 py-2 text-white shadow-sm hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
