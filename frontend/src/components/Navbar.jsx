import { Link, useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { removeAuth } from "../utils/authSlice";
import { BASE_URL } from "../utils/constants"; 
import toast from "react-hot-toast"; 

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth);

  const handleLogout = async () => {
    try {
      
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST", 
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      const data = await response.json();

      if (data.success) {
       
        dispatch(removeAuth());
        
        
        toast.success("Logged out successfully");
        
       
        navigate("/auth/login"); 
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during logout");
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Blogify</Link>
        <span>Hello! {user?.username || "Champ"}</span>
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
              />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><Link to="/blogs">Blogs</Link></li>
            
          
            {user ? (
              <li><button onClick={handleLogout}>Logout</button></li>
            ) : (
              <li>
                <Link to="/auth/login">Signup</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}