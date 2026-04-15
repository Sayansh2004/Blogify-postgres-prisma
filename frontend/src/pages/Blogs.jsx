import { useState, useEffect } from "react"; 
import UserBlog from "../components/UserBlog"; 
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton"; 
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Blogs() {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((store) => store.auth);

  const fetchBlogs = async () => {
    try {
      
      const response = await fetch(`${BASE_URL}/posts/all`, {
       
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      
      if (data.success) {
        setBlogData(data.data);
      }
    } catch (err) {
      toast.error(err.message || "Could not load blogs.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

 
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (deletedId) => {
    setBlogData((prev) => prev.filter((blog) => blog.id !== deletedId));
  };

 
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 mt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Articles</h1>
        {user && (
          <Link to="/blog/new" className="btn btn-primary">
            New Blog
          </Link>
        )}
      </div>
      
      
      {blogData.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No blogs found.</p>
         <p className="mt-2 text-gray-600">
  Check back later or be the first to{" "}
  <button className="ml-1 px-3 py-1 rounded-md bg-blue-600 text-white text-sm font-medium transition hover:bg-blue-700 hover:shadow-sm hover:cursor-pointer">
    write
  </button>{" "}
  one!
</p>
        </div>
      ) : (
      
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogData.map((blog) => (
            
            <UserBlog
              key={blog._id || blog.id}
              blog={blog}
              onDelete={handleDelete}
            /> 
          ))}
        </div>
      )}
    </div>
  );
}