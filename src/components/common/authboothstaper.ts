
// app/AuthBootstrapper.tsx
"use client";

import { fetchMe } from "@/redux/authSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function AuthBootstrapper() {
  
   const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return null;
}
