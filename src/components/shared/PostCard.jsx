"use client";
import { useRouter } from "next/navigation";

export default function PostCard({ post }) {
  const router = useRouter();

  return (
    <div
      className="group relative overflow-hidden bg-white shadow-lg transition-all hover:shadow-xl cursor-pointer"
      onClick={() => router.push(`/blog/${post.slug}`)}
    >
      <div
        className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${post.image || "/defaultPostImage.jpg"})` }}
      ></div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {post.title}
        </h3>
      </div>
    </div>
  );
}
