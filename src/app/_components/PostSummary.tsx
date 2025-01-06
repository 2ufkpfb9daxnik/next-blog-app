"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import Link from "next/link";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const formattedDate = dayjs(post.createdAt).format("YYYY-MM-DD");
  const categoryNames = post.categories
    .map((category) => category.name)
    .join(", ");
  return (
    <div className="border border-slate-400 p-3">
      <div className="flex justify-between">
        <div className="text-sm">{formattedDate}</div>
        <div className="flex space-x-2">
          {post.categories.map((category) => (
            <div
              key={category.id}
              className="rounded-md border-2 px-2 text-sm font-bold text-gray-500"
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <Link href={`/posts/${post.id}`}>
        <div className="font-bold">{post.title}</div>
        {/* <div>{post.content}</div> */}
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Link>
    </div>
  );
};

export default PostSummary;
