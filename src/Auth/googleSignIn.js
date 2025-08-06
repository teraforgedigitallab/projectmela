import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig/firebase';
import { toast } from 'react-toastify';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // User signed in successfully
        console.log('User signed in ');
        toast.success('User signed in');
        return result.user;
    } catch (error) {
        toast.error('Error signing in with Google: ', error);
        console.error('Error signing in with Google: ', error);
        throw error;
    }
};