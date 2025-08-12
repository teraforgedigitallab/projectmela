import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Modal } from '../ui';
import { auth } from '../firebaseConfig/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { handleGoogleSignIn } from '../Auth/googleSignIn';
import { createUserDocument } from '../Auth/createUserDocument';

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalHeading, setModalHeading] = useState('');

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
            .catch((error) => {
                console.error("Error setting persistence:", error);
            });
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('signup') === 'true') {
            setIsSignUp(true);
        } else {
            setIsSignUp(false);
        }
    }, [location.search]);

    const handleSignInClick = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (password !== confirmPassword) {
                setPasswordsMatch(false);
                return;
            }
            if (!isPasswordValid(password)) {
                setModalHeading("Invalid Password");
                setModalMessage("Password must be at least 6 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
                setShowModal(true);
                return;
            }
            if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
                setModalHeading("Invalid Name");
                setModalMessage("First Name and Last Name cannot have spaces or special characters.");
                setShowModal(true);
                return false;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                await createUserDocument(userCredential.user, { firstName, lastName });
                setModalHeading("Verification Email Sent ✅");
                setModalMessage('Please check your inbox and verify your email to sign in.');
                setShowModal(true);
                setIsSignUp(false);
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setModalHeading("Email Already in Use");
                    setModalMessage("Sign in through this email or create a new account with a different email.");
                } else {
                    setModalHeading("Sign Up Failed");
                    setModalMessage(`${error.message}`);
                }
                setShowModal(true);
            }
        } else {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user.emailVerified) {
                    navigate('/'); // <-- Go to home page after sign in
                } else {
                    setModalHeading("Email Not Verified");
                    setModalMessage('Please verify your email before signing in.');
                    setShowModal(true);
                }
            } catch (error) {
                if (error.code === 'auth/invalid-credential') {
                    setModalHeading("Sign In Failed");
                    setModalMessage('Invalid Email and Password Combination');
                } else {
                    setModalHeading("Sign In Failed");
                    setModalMessage(`${error.message}`);
                }
                setShowModal(true);
            }
        }
    };

    const toggleSignUpMode = () => {
        setIsSignUp(!isSignUp);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPasswordsMatch(true);
        setFirstName('');
        setLastName('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (isSignUp) {
            setPasswordsMatch(e.target.value === confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordsMatch(password === e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    const handleGoogleSignInWrapper = async () => {
        try {
            const user = await handleGoogleSignIn();
            if (user) {
                await createUserDocument(user);
                navigate('/');
            }
        } catch (error) {
            console.error("Error during Google Sign In:", error);
            setModalHeading("Sign In Failed");
            setModalMessage("An error occurred during Google Sign In. Please try again.");
            setShowModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-xl bg-white rounded-sm shadow-2xl p-8">
                    <h1 className="text-2xl font-semibold text-black mb-2">{isSignUp ? 'Sign up on Project Mela' : 'Sign in to Project Mela!'}</h1>
                    <p className="text-gray-600 mb-6">Join the ultimate project platform to boost your skills, earn money, and work on exciting tech projects with fellow programmers.</p>
                    <form onSubmit={handleSignInClick} className="space-y-4">
                        {isSignUp && (
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50" />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50" />
                                </div>
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-2 text-gray-500 hover:text-primary"
                                    onClick={togglePasswordVisibility}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {isSignUp && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 6 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
                                </p>
                            )}
                        </div>
                        {isSignUp && (
                            <div>
                                <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        id="confirmpassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-2 text-gray-500 hover:text-primary"
                                        onClick={toggleConfirmPasswordVisibility}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        )}
                        {!passwordsMatch && password !== '' && confirmPassword !== '' && (
                            <div className="text-sm text-red-600">
                                Passwords do not match
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                            {!isSignUp && (
                                <button type="button" onClick={() => navigate('/forgot-password')} className="text-primary text-sm hover:underline">
                                    Forgot Password
                                </button>
                            )}
                            <button type="button" onClick={toggleSignUpMode} className="text-primary text-sm hover:underline">
                                {isSignUp ? 'Signin' : 'Signup'}
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-primary flex items-center justify-center gap-2 text-white py-2 rounded-sm font-bold hover:bg-primary-hover transition mt-2">
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                            <FaArrowRight className="ml-1" />
                        </button>
                    </form>
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="mx-3 text-gray-500">Or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <button
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-sm py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        onClick={handleGoogleSignInWrapper}
                    >
                        <FcGoogle className="text-xl text-[#EA4335]" />
                        Continue With Google
                    </button>
                    <div className="mt-6 text-center text-gray-500 text-sm">
                        By signing into the platform you agree to our{' '}
                        <button type="button" className="text-primary underline" onClick={() => navigate('/terms')}>Terms & Conditions</button> and{' '}
                        <button type="button" className="text-primary underline" onClick={() => navigate('/privacy')}>Privacy Policy</button>.
                    </div>
                </div>
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                heading={modalHeading}
                body={modalMessage}
                primaryButtonText="OK"
                secondaryButtonText="Cancel"
                showButtons={false}
                onPrimaryClick={() => setShowModal(false)}
                onSecondaryClick={() => setShowModal(false)}
            />
        </div>
    );
};

export default SignIn;