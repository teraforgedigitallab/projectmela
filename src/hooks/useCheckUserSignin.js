import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig/firebase';

const useCheckUserSignin = (navigate) => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/signin');
            }
        });
        return () => unsubscribe();
    }, [navigate]);
};

export default useCheckUserSignin;