import React, { useState } from 'react';
import { Card, Typography, Button, InputField } from '../../ui';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset link sent to ${email}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("Email is not registered.");
        toast.error("Email is not registered.");
      } else {
        setError(err.message || "Failed to send password reset email.");
        toast.error(err.message || "Failed to send password reset email.");
      }
    }
  };


  return (
    <Card>
      <Typography variant="h5" className="font-bold text-xl mb-2">Change Password</Typography>
      <Typography variant="p" className="text-black mb-4">
        Please enter the email associated with this account to change your password.
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <Button type="submit" className="mt-2 w-full">
          Change Password
        </Button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </Card>
  );
};

export default ChangePassword;