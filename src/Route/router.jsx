import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Products from "../Pages/Products";
import AddProduct from "../Pages/AddProduct";
import AddSale from "../Pages/AddSale";
import ProtectedRoute from "../Component/ProtectedRoute";
import SalesReport from "../Pages/SalesReport";
import Employee from "../Pages/Employee";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "/home",
        Component: Home
      },
      {
        path: "/products",
        Component: Products
      },
      {
        path: "/add-product",
        Component: AddProduct
      },
      {
        path: "/add-sale",
        Component: AddSale
      },
      {
        path: "/sales",
        Component: SalesReport
      },
      {
        path: "/employee",
        Component: Employee
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
