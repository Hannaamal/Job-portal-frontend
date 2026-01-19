"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { loginUser, fetchMe } from "@/redux/authSlice";
import api from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [isSignUp, setIsSignUp] = useState(false);

  /* ---------- LOGIN STATE ---------- */
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  /* ---------- REGISTER STATE ---------- */
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  /* ---------- HANDLERS ---------- */
  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };
  /* ---------- LOGIN SUBMIT ---------- */

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/login", loginForm);

      // 🔥 FORCE HARD RELOAD
      window.location.href = "/";
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  /* ---------- REGISTER SUBMIT ---------- */
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Call backend register API
      await api.post("/api/auth/register", registerForm);

      // ✅ Force a full reload so cookie is available to middleware & /me
      window.location.href = "/";
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2f5]">
      <div className="relative w-[900px] h-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ---------------- LOGIN FORM ---------------- */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out
             ${
               isSignUp
                 ? "translate-x-full opacity-0 pointer-events-none z-0"
                 : "opacity-100 z-10"
             }`}
        >
          <form
            onSubmit={handleLoginSubmit}
            className="h-full flex flex-col items-center justify-center px-12"
          >
            <Typography variant="h5" className="font-bold mb-6">
              Find Your Job
            </Typography>

            <TextField
              fullWidth
              name="email"
              placeholder="Email"
              onChange={handleLoginChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleLoginChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <Button type="submit" sx={primaryBtn}>
              Login
            </Button>
          </form>
        </div>

        {/* ---------------- REGISTER FORM ---------------- */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out
  ${
    isSignUp
      ? "translate-x-full opacity-100 z-10"
      : "opacity-0 pointer-events-none z-0"
  }`}
        >
          <form
            onSubmit={handleRegisterSubmit}
            className="h-full flex flex-col items-center justify-center px-12"
          >
            <Typography variant="h5" className="font-bold mb-6">
              Create Account
            </Typography>

            <TextField
              name="name"
              placeholder="Full Name"
              onChange={handleRegisterChange}
              sx={inputStyle}
            />
            <TextField
              name="email"
              placeholder="Email"
              onChange={handleRegisterChange}
              sx={inputStyle}
            />
            <TextField
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleRegisterChange}
              sx={inputStyle}
            />
            <TextField
              name="phone"
              placeholder="Phone"
              onChange={handleRegisterChange}
              sx={inputStyle}
            />

            <Button type="submit" sx={primaryBtn}>
              Register
            </Button>
          </form>
        </div>

        {/* ---------------- OVERLAY PANEL ---------------- */}
        <div
          className={`absolute top-0 left-1/2 h-full w-1/2 bg-[#4db6d0] text-white
          transition-transform duration-700
          ${isSignUp ? "-translate-x-full" : ""}`}
        >
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            {isSignUp ? (
              <>
                <Typography variant="h4" className="font-bold mb-3">
                  Welcome Back!
                </Typography>
                <Typography className="mb-6">
                  Already have an account?
                </Typography>
                <Button sx={outlineBtn} onClick={() => setIsSignUp(false)}>
                  Login
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" className="font-bold mb-3">
                  Hello, Friend!
                </Typography>
                <Typography className="mb-6">
                  Create an account to get started
                </Typography>
                <Button sx={outlineBtn} onClick={() => setIsSignUp(true)}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const inputStyle = {
  mb: 2,
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: "999px",
  "& fieldset": { borderRadius: "999px" },
};

const primaryBtn = {
  mt: 2,
  px: 6,
  py: 1.3,
  borderRadius: "999px",
  backgroundColor: "#4db6d0",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": { backgroundColor: "#3aa3bd" },
};

const outlineBtn = {
  color: "#fff",
  borderColor: "#fff",
  borderRadius: "999px",
  px: 6,
  py: 1.2,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
};
