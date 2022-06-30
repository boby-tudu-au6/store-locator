import React from "react";
import { Navigate, useRoutes } from 'react-router-dom'
import Layout from "layout";
import Home from 'views/Home'
import Login from 'views/auth/Login/Login'
import Register from 'views/auth/Register/Register'
import NotFound from 'views/NotFound'
import Bookmark from "views/Bookmark/Bookmark";

export function UserRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { element: <Home />, index: true },
        { path: 'bookmarks', element: <Bookmark /> },
        { path: '*', element: <Navigate to="/" /> },
      ]
    },
  ])
}
export function AuthRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '*', element: <Navigate to="/login" /> },
      ]
    },
  ])
}