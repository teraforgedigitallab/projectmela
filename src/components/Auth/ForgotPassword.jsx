import React, { useState } from 'react';
import { Card, Typography, Button, InputField } from '../../ui';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
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
      setError(err.message || "Failed to send password reset email.");
    }
  };

  return (
    <Card className='max-w-4xl mx-auto p-6 my-20'>
      <Typography variant="h5" className="font-bold text-xl mb-2">Forgot your password ? </Typography>
      <Typography variant="p" className="text-black mb-4">
        No worries! 
      </Typography>
        <Typography variant="p" className="text-gray-700 text-sm mb-4 italic">
            Just enter the email of your account, we will send you an email on your verified email account through which you can reset your password.
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
        <Button type="submit" className="mt-2">
          Reset Password
        </Button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </Card>
  );
};

export default ForgotPassword;