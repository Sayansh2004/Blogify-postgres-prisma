import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './components/Login.jsx';
import { Provider } from "react-redux";
import appStore from './utils/appStore.js';
import { Toaster } from "react-hot-toast";
import ProtectedRoute from './components/ProtectedRoute.jsx';


import Blog from './pages/Blog.jsx';
import Blogs from './pages/Blogs.jsx';
import NewBlog from './pages/NewBlog.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index:true,
        element:<Blogs/>
      },
      {
        path: "/auth/login",
        element: <Login /> 
      },
      {
       
        path: "/blog/:blogId", 
        element: (
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        )
      },
      {
        path: "/blog/new",
        element: (
          <ProtectedRoute>
            <NewBlog />
          </ProtectedRoute>
        )
      },
      {
        path: "/blogs",
        element: <Blogs />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
       <RouterProvider router={router} />
       <Toaster />
    </Provider>
  </StrictMode>,
);