"use client";
import { useState, ChangeEvent, useRef } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
import { supabase } from "@/utils/supabase";
import CryptoJS from "crypto-js"; // ◀ 追加
import Image from "next/image";

// ファイルのMD5ハッシュ値を計算する関数
const calculateMD5Hash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  return CryptoJS.MD5(wordArray).toString();
};

const Page: React.FC = () => {
  const bucketName = "cover_image";
  const [imageStorageKey, setImageStorageKey] = useState<string | undefined>();
  const [imagePublicUrl, setImagePublicUrl] = useState<string | undefined>();

  const { session } = useAuth();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null); // ◀ 追加

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageStorageKey(undefined);
    setImagePublicUrl(undefined);

    // 画像が選択されていない場合は戻る
    if (!e.target.files || e.target.files.length === 0) return;

    // 複数ファイルが選択されている場合は最初のファイルを使用する
    const file = e.target.files?.[0];
    // ファイルのハッシュ値を計算
    const fileHash = await calculateMD5Hash(file); // ◀ 追加
    // バケット内のパスを指定
    const path = `private/${fileHash}`; // ◀ 変更
    // ファイルが存在する場合は上書きするための設定 → upsert: true
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, { upsert: true });

    if (error || !data) {
      window.alert(`アップロードに失敗 ${error.message}`);
      return;
    }
    // 画像のキー (実質的にバケット内のパス) を取得
    setImageStorageKey(data.path);
    const publicUrlResult = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    setImagePublicUrl(publicUrlResult.data.publicUrl);
  };

  // ログインしていないとき (＝supabase.storageが使えない状態のとき)
  if (!session) return <div>ログインしていません。</div>;

  return (
    <div>
      <input
        id="imgSelector"
        type="file" // ファイルを選択するinput要素に設定
        accept="image/*" // 画像ファイルのみを選択可能に設定
        onChange={handleImageChange}
        hidden={true} // ◀ 追加
        ref={hiddenFileInputRef} // ◀ 追加
        className="rounded-md bg-indigo-500 px-3 py-1 text-white" // ◀ 追加
      />
      <button
        // 参照を経由してプログラム的にクリックイベントを発生させる
        onClick={() => hiddenFileInputRef.current?.click()}
        type="button"
        className="rounded-md bg-indigo-500 px-3 py-1 text-white"
      >
        ファイルを選択
      </button>
      <div className="break-all text-sm">Storage Key: {imageStorageKey}</div>
      <div className="break-all text-sm">Public URL: {imagePublicUrl}</div>
      {imagePublicUrl && (
        <div className="mt-2">
          <Image
            className="w-1/2 border-2 border-gray-300"
            src={imagePublicUrl}
            alt="プレビュー画像"
            width={1024}
            height={1024}
            priority
          />
        </div>
      )}
    </div>
  );
};

export default Page;
