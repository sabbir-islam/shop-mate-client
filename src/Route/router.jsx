import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import App from '../App';
import Home from '../Pages/Home';
import Login from '../Pages/Login';


const router = createBrowserRouter([
    {
        path: "/login",
        Component: Login
    },
    {
    path: "/",
    Component: App,
    children: [
        {
            index: true,
            path: "/",
            Component: Home
        }
    ]
  },
]);

export default router;