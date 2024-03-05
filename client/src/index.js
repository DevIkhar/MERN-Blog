import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider , createBrowserRouter} from 'react-router-dom';

import './index.css';
import Layout from '../src/components/Layout';
import Author from '../src/pages/Author';
import CategoryPost from './pages/CategoryPost';
import CreatePost from '../src/pages/CreatePost';
import Dashbord from '../src/pages/Dashbord';
import EditPost from '../src/pages/EditPost';
import DeletePost from '../src/pages/DeletePost';
import AuthorPost from '../src/pages/AuthorPost';
import ErrorPage from '../src/pages/ErrorPage';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Logout from '../src/pages/Logout';
import PostDetails from '../src/pages/PostDetails';
import Register from '../src/pages/Register';
import UserProfile from '../src/pages/UserProfile';
import UserProvider from './context/userContext';


const router = createBrowserRouter([
  {
    path:"/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement:<ErrorPage/>,
    children:[
      {index:true, element: <Home/>}, 
      {path:'posts/:id', element: <PostDetails/>}, 
      {path:'login', element: <Login/>}, 
      {path:'register', element: <Register/>}, 
      {path:'profile/:id', element: <UserProfile/>}, 
      {path:'author', element: <Author/>}, 
      {path:'create', element: <CreatePost/>}, 
      {path:'posts/categories/:category', element: <CategoryPost/>}, 
      {path:'posts/users/:id', element: <AuthorPost/>}, 
      {path:'myposts/:id', element: <Dashbord/>}, 
      {path:'posts/:id/edit', element: <EditPost/>}, 
      {path:'posts/:id/delete', element: <DeletePost/>}, 
      {path:'logout', element: <Logout/>}, 
     
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


