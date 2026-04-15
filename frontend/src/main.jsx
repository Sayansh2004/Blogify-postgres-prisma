import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Login from './components/Login.jsx';
import {Provider} from "react-redux";
import appStore from './utils/appStore.js';
import {Toaster} from "react-hot-toast";


const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/auth/login",
        element:<Login/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
       <RouterProvider router={router}/>
       <Toaster/>
    </Provider>
   
  </StrictMode>,
)
