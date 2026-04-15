import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

export default function UserBlog({ blog, onDelete }) {
  const user = useSelector((store) => store.auth);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/delete/${blog.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      toast.success("Blog deleted");
      if (onDelete) {
        onDelete(blog.id);
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{blog.title}</h2>
        <p className="line-clamp-3">{blog.content}</p>
        <div className="card-actions justify-end gap-2">
          <Link to={`/blog/${blog.id}`} className="btn btn-sm btn-outline">
            View
          </Link>
          {user && (
            <button onClick={handleDelete} className="btn btn-sm btn-error text-white">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
