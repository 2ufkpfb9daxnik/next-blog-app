"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post, Category } from "@prisma/client";

const AdminPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("投稿記事の取得に失敗しました");
        }
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      const newSelectedCategories = new Set(prevSelectedCategories);
      if (newSelectedCategories.has(categoryId)) {
        newSelectedCategories.delete(categoryId);
      } else {
        newSelectedCategories.add(categoryId);
      }
      return newSelectedCategories;
    });
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      setPosts(posts.filter((post) => post.id !== id));
      alert("削除が成功しました");
    } catch (e) {
      alert(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.size === 0 || selectedCategories.has(post.categoryId))
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getPaginationNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= totalPages; i *= 2) {
      numbers.push(i);
    }
    return numbers;
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  return (
    <div>
      <h1>投稿記事一覧</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="投稿記事を検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <h1>カテゴリで絞り込み</h1>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`mb-2 mr-2 rounded-md px-4 py-2 ${
              selectedCategories.has(category.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h1>ページ</h1>
        {getPaginationNumbers().map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mr-2 rounded-md px-4 py-2 ${
              currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {currentPosts.map((post: Post) => (
          <li
            key={post.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ margin: 0 }}>
              <span dangerouslySetInnerHTML={{ __html: post.title }}></span>
            </h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link href={`/admin/posts/${post.id}`} legacyBehavior>
                <a
                  style={{
                    backgroundColor: "#0070f3",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                  }}
                >
                  編集
                </a>
              </Link>
              <button
                style={{
                  backgroundColor: "#e00",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => deletePost(post.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {getPaginationNumbers().map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mr-2 rounded-md px-4 py-2 ${
              currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPostsPage;
