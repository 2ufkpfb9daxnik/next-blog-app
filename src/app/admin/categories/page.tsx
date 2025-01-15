"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@prisma/client";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
    } catch (e) {
      alert(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">カテゴリ管理</h1>
      <Link
        href="/admin/categories/new"
        className="mb-10
       rounded-md bg-green-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600"
      >
        新規カテゴリの作成
      </Link>
      <div className="mb-6 mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 rounded-md border px-4 py-2 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <input
        type="text"
        placeholder="検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
      />
      <ul>
        {currentCategories.map((category) => (
          <li
            key={category.id}
            className="mb-2 flex items-center justify-between rounded-md border p-2"
          >
            <span>{category.name}</span>
            <div>
              <Link
                href={`/admin/categories/edit/${category.id}`}
                className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(category.id)}
                className="rounded-md bg-red-500 px-4 py-2 text-white shadow-sm hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 rounded-md border px-4 py-2 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
