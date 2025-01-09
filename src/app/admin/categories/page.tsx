"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@prisma/client";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      setCategories(categories.filter((category) => category.id !== id));
      alert("削除が成功しました");
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
      <h1 className="mb-4 text-2xl font-bold">カテゴリ一覧</h1>
      <ul className="list-disc pl-5">
        {categories.map((category) => (
          <li
            key={category.id}
            className="mb-2 flex items-center justify-between"
          >
            <span>{category.name}</span>
            <div className="flex space-x-2">
              <Link href={`/admin/categories/${category.id}`} legacyBehavior>
                <a className="rounded-md bg-blue-500 px-4 py-2 text-white">
                  編集
                </a>
              </Link>
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-white"
                onClick={() => handleDelete(category.id)}
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

export default AdminCategoriesPage;
