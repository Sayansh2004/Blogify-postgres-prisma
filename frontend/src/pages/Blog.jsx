import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

export default function Blog() {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${blogId}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load blog");
      }

      setTitle(data.data.title || "");
      setContent(data.data.content || "");
    } catch (err) {
      toast.error(err.message || "Could not load blog");
      navigate("/blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${BASE_URL}/posts/edit/${blogId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update blog");
      }

      toast.success("Blog updated");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/delete/${blogId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      toast.success("Blog deleted");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-4 mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">View / Edit Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea textarea-bordered w-full min-h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-error text-white"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="btn btn-ghost"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
