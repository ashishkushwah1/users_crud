import axios from 'axios';
import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Home = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, []);

    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://reqres.in/api/users?page=${page}`);
            setUsers(res.data.data);
            setFilteredUsers(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://reqres.in/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleSearch = (value) => {
        setSearch(value);
        const filtered = users.filter((user) =>
            user.first_name.toLowerCase().includes(value.toLowerCase()) || user.last_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
        if (value === '') {
            setFilteredUsers(users);
        }
    }
    return (
        <div className='flex flex-col px-10 py-8'>
            <input
                type="text"
                className="border-2 border-gray-500 p-2 rounded-md mx-auto md:w-1/2 w-full"
                placeholder='Enter name...'
                onChange={(e) => handleSearch(e.target.value)}
            />
            {loading ? <p className='mx-auto'>Loading Users...</p> : <div className='flex md:flex-wrap md:flex-row flex-col justify-center my-8'>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                    <div key={user.id} className='m-2 p-2 border-2 border-gray-500 rounded-md flex flex-col gap-2.5 md:w-1/5'>
                        <img src={user.avatar} alt={user.first_name} className='rounded-full mx-auto w-40 h-40' />
                        <p className='text-center'>{user.first_name} {user.last_name}</p>
                        <button
                            className='flex-1 border rounded-sm cursor-pointer hover:bg-yellow-300 hover:text-white'
                            onClick={() => navigate(`/edit/${user.id}`)}
                        >
                            Edit
                        </button>
                        <button
                            className='flex-1 border rounded-sm cursor-pointer hover:bg-red-600 hover:text-white'
                            onClick={() => handleDelete(user.id)}
                        >
                            Delete
                        </button>
                    </div>
                )) : <p>No data found</p>}
            </div>}
            {search.trim()==="" &&
                <div className='flex justify-center gap-4'>
                    <button
                        className={`border rounded-sm p-2 w-24 ${page == 1 ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black hover:text-white'}`}
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1}>
                        Previous
                    </button>
                    <button
                        className={`border rounded-sm p-2  w-24 ${filteredUsers.length === 0 ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black hover:text-white'}`}
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={filteredUsers.length === 0}>
                        Next
                    </button>
                </div>
            }
        </div>
    )
}

export default Home
