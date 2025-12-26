
"use client"

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { fetchMe } from "@/redux/authSlice";
import { useEffect } from "react";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchMe());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
