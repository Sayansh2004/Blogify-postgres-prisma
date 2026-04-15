import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../utils/authSlice";
import { BASE_URL } from "../utils/constants";

export default function Auth() {
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);

 
  const [formData, setFormData] = useState({
    username: "", 
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // 2. Change 'name' to 'username' here as well
    setFormData({ username: "", email: "", password: "" }); 
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin 
            ? { email: formData.email, password: formData.password }
            : formData // Now sends { username, email, password }
        ),
        credentials: "include",
      });

      const data = await response.json();

      
      if (!response.ok) {
        toast.error(data.message || `Failed to ${isLogin ? "validate" : "register"} user`);
        return; 
      }
      
      if (data.success) {
        toast.success(isLogin ? "Validated user successfully" : "Account created successfully");
       
        if (data.data) {
          dispatch(addAuth(data.data));
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Network error or server is down");
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Please enter your details to sign in." : "Fill in your details to get started."}
          </p>
        </div>

        <form onSubmit={handleFormSubmission} className="space-y-6">
          
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              {/* 3. Change name="name" to name="username" and value={formData.username} */}
              <input
                type="text"
                name="username"
                id="username"
                placeholder="JohnDoe123"
                value={formData.username}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="your@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "New user? " : "Already a user? "}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all"
          >
            {isLogin ? "Create account" : "Sign in instead!"}
          </button>
        </div>

      </div>
    </div>
  );
}