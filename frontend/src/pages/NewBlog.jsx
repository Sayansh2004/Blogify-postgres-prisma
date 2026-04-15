import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/posts/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create blog");
      }

      toast.success("Blog created");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.message || "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea textarea-bordered w-full min-h-40"
          placeholder="Write your blog content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? "Saving..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
