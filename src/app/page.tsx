"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import dummyPosts from "@/app/_mocks/dummyPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  // 投稿データを「状態」として管理 (初期値はnull)
  const [allPosts, setAllPosts] = useState<Post[] | null>(null); // 全ての投稿データ
  const [filteredPosts, setFilteredPosts] = useState<Post[] | null>(null); // フィルタリングされた投稿データ
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 選択されたカテゴリの状態を追加

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    // 本来はウェブAPIを叩いてデータを取得するが、まずはモックデータを使用
    // (ネットからのデータ取得をシミュレートして１秒後にデータをセットする)
    const timer = setTimeout(() => {
      console.log("ウェブAPIからデータを取得しました (虚言)");
      setAllPosts(dummyPosts);
      setFilteredPosts(dummyPosts);
    }, 1000); // 1000ミリ秒 = 1秒

    // データ取得の途中でページ遷移したときにタイマーを解除する処理
    return () => clearTimeout(timer);
  }, []);

  const sortPosts = (order) => {
    if (!filteredPosts) return;
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      if (order === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setFilteredPosts(sortedPosts);
  };

  useEffect(() => {
    sortPosts(sortOrder);
  }, [sortOrder, filteredPosts]);

  const filterPostsByCategory = (category) => {
    if (!allPosts) return;
    if (category === null) {
      setFilteredPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter((post) =>
        post.categories.some((cat) => cat.name === category)
      );
      setFilteredPosts(filteredPosts);
    }
  };

  useEffect(() => {
    filterPostsByCategory(selectedCategory);
  }, [selectedCategory]);

  // 投稿データが取得できるまでは「Loading...」を表示
  if (!filteredPosts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // カテゴリを動的に取得
  const categories = Array.from(
    new Set(allPosts.flatMap((post) => post.categories.map((cat) => cat.name)))
  );

  // 投稿データが取得できたら「投稿記事の一覧」を出力
  return (
    <main>
      <div className="mb-2 text-2xl font-bold">Main</div>
      <div className="mb-4">
        <button
          className={`mr-2 rounded px-4 py-2 ${sortOrder === "newest" ? "bg-gray-500" : "bg-blue-500 text-white"}`}
          onClick={() => setSortOrder("newest")}
          disabled={sortOrder === "newest"}
        >
          新しい順
        </button>
        <button
          className={`rounded px-4 py-2 ${sortOrder === "oldest" ? "bg-gray-500" : "bg-blue-500 text-white"}`}
          onClick={() => setSortOrder("oldest")}
          disabled={sortOrder === "oldest"}
        >
          古い順
        </button>
      </div>
      <div className="mb-4">
        <button
          className={`mr-2 rounded px-4 py-2 ${selectedCategory === null ? "bg-gray-500" : "bg-green-500 text-white"}`}
          onClick={() => setSelectedCategory(null)}
          disabled={selectedCategory === null}
        >
          全て
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`mr-2 rounded px-4 py-2 ${selectedCategory === category ? "bg-gray-500" : "bg-green-500 text-white"}`}
            onClick={() => setSelectedCategory(category)}
            disabled={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;
