import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const useCookieConsent = () => {
    const [isCookiesAccepted, setIsCookiesAccepted] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkCookiesAcceptance = async () => {
            try {
                // Check if user is authenticated
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    setIsLoading(false);
                    return;
                }

                const currentUserEmail = currentUser.email;
                if (!currentUserEmail) {
                    setIsLoading(false);
                    return;
                }

                const userDoc = await getDoc(doc(db, "Users", currentUserEmail));
                if (userDoc.exists()) {
                    setIsCookiesAccepted(userDoc.data().isCookiesAccepted || false);
                }
            } catch (error) {
                console.error("Error checking cookie consent:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Only run if auth is initialized
        const unsubscribe = auth.onAuthStateChanged(() => {
            checkCookiesAcceptance();
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const handleAcceptCookies = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) return;

            const currentUserEmail = currentUser.email;
            await updateDoc(doc(db, "Users", currentUserEmail), {
                isCookiesAccepted: true
            });
            setIsCookiesAccepted(true);
        } catch (error) {
            console.error("Error accepting cookies:", error);
        }
    };

    return {
        isCookiesAccepted,
        handleAcceptCookies,
        isLoading
    };
};

export default useCookieConsent;