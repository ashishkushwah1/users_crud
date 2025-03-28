import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./button";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
const EditPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axios.put(`https://reqres.in/api/users/${id}`,
                { email: data.email, first_name: data.firstName, last_name: data.lastName });
            sessionStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (error) {
            toast.error("User doens't exists");
        } finally {
            setLoading(false);
        }
    }
    const { id } = useParams();
    const fetchUser = async () => {
        try {
            const res = await axios.get(`https://reqres.in/api/users/${id}`);
            const user = res.data.data;
            setValue("firstName", user.first_name);
            setValue("lastName", user.last_name);
            setValue("email", user.email);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUser();
    }, [id]);
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="md:bg-white md:p-6 p-2 rounded-lg md:shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Edit User</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2 h-20">
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            {...register("firstName", {
                                required: "First name is required",
                            })}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>
                    <div className="mb-2 h-20">
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            {...register("lastName", {
                                required: "Last name is required",
                            })}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>


                    <div className="mb-2 h-20">
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

                    <Button
                        className="w-full bg-black text-lg text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer mt-4"
                        loading={loading}
                        type="submit"
                    >
                        Save
                    </Button>
                    <Button
                        className="w-full bg-black text-lg text-white p-2 rounded-md hover:bg-gray-800 cursor-pointer mt-4"
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default EditPage;
