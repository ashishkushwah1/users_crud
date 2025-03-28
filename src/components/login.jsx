import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./button";
import axios from 'axios';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`https://reqres.in/api/login`, { email: data.email, password: data.password })
      sessionStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      toast.error("User doens't exists");
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    const token = sessionStorage.getItem('token');
    if(token){
        navigate('/');
    }
  },[]);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="md:bg-white md:p-6 p-2 rounded-lg md:shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Enter credentials</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 h-20">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-4 h-20">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded-md"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 cursor-pointer hover:text-black"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaRegEye className="w-6 h-6"/> : <FaRegEyeSlash className="w-6 h-6"/>}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button
            className="w-full bg-black text-lg text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer mt-4"
            loading={loading}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
