import React, { useState } from 'react';

const AdminLogin = ({ onLoginSuccess }) => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const adminsCredential = JSON.parse(import.meta.env.VITE_ADMINS_CREDENTIAL);
        const matchedAdmin = adminsCredential.find(admin => admin.id === adminId && admin.password === password);
        if (matchedAdmin) {
            onLoginSuccess();
        } else {
            alert('Invalid admin ID or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-sm shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Sign in to Admin Dashboard</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">Admin ID</label>
                        <input 
                            type="text" 
                            id="adminId" 
                            value={adminId} 
                            onChange={(e) => setAdminId(e.target.value)} 
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <button 
                        className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={handleLogin}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;