import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './components/Login.jsx'; // Note: Your component is named Auth based on our last step, make sure the import matches!
import { Provider } from "react-redux";
import appStore from './utils/appStore.js';
import { Toaster } from "react-hot-toast";
import ProtectedRoute from './components/ProtectedRoute.jsx';


import Blog from './components/Blog.jsx';
import Blogs from './components/Blogs.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/auth/login",
        element: <Login /> 
      },
      {
        // FIX: Use a colon (:) for URL parameters
        path: "/blog/:blogId", 
        element: (
          <ProtectedRoute>
            <Blog />
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