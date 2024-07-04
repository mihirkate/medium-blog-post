// Example with React
import React from 'react';

import { useNavigate } from 'react-router-dom';
export const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove JWT from local storage or cookies
        localStorage.removeItem('token'); // Adjust based on your storage mechanism

        // Redirect to sign-in page
        navigate('/signin');
    };

    return (

        <button onClick={handleLogout} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
            Logout
        </button>
    );
};


