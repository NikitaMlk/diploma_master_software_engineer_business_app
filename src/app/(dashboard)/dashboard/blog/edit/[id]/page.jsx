"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "next/link";

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: "",
    content: "",
  });
  const [preview, setPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      setLoaded(false);
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title,
          slug: data.slug,
          image: data.image,
          content: data.content || "",
        });

        setTimeout(() => {
          if (editor) editor.commands.setContent(data.content || "");
          setLoaded(true);
        }, 100);
      } else {
        alert("Failed to load blog post");
        setLoaded(true);
      }
    };

    if (id && editor) fetchBlog();
  }, [id, editor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push("/dashboard/blog");
    } else {
      alert("Failed to update blog post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-white mb-6">Edit Blog Post</h2>

      {!loaded && <p className="text-white">Loading blog data...</p>}

      {loaded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug (e.g. why-your-business-needs-a-website)"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-white mb-2">Content</h3>
            <EditorContent editor={editor} className="text-black bg-white p-3 rounded min-h-[200px]" />
          </div>

          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="w-full p-2 bg-yellow-500 text-white rounded"
          >
            {preview ? "Hide Preview" : "Preview"}
          </button>

          {preview && (
            <div className="bg-gray-900 text-white p-4 rounded mt-4">
              <h2 className="text-2xl font-bold">{formData.title}</h2>
              <img src={formData.image} alt="Blog" className="w-full h-40 object-cover mt-2 rounded" />
              <div className="mt-4" dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          )}

          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Update Post
          </button>
        </form>
      )}
    </div>
  );
}
