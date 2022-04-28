import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PrivateRoute() {
  const user = useSelector((state) => state.current);
  return user ? <Outlet></Outlet> : <Navigate to='/login'></Navigate>;
}
