import { useState, useEffect } from "react"; 
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Skeleton from "./components/Skeleton.jsx";
import { BASE_URL } from "./utils/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "./utils/authSlice.js";

export default function App() {
  const [isLoading, setIsLoading] = useState(true); 
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/profile/view`, {
        credentials: "include",
      });

      
      if (!response.ok) {
        return; 
      }

      const data = await response.json();
      if (data.success) {
        dispatch(addAuth(data.data));
       
      }
    } catch (err) {
      console.error("Failed to fetch user profile on load:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
   
    if (!user) {
      fetchUser();
    } else {
      setIsLoading(false); 
    }
  }, [user]);

 
  if (isLoading) {
    return (
      <>
        <Navbar />
        <Skeleton />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}