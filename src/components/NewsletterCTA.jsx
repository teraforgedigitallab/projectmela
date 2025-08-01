import React, { useState } from 'react';
import { db } from '../firebaseConfig/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save email to Firestore
      const docRef = doc(collection(db, "NotifyEmailList"), email);
      await setDoc(docRef, {
        userEmail: email,
        subscribedOn: new Date().getTime(),
        lastNotified: new Date().getTime(),
        doNotShowNotification: false,
      });
      
      // Show success message
      toast.success("Successfully subscribed to newsletter!");
      setIsSubscribed(true);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto bg-primary rounded-lg p-6 text-white my-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h3 className="text-xl font-bold mb-1">Stay Updated with New Projects</h3>
          <p className="text-gray-100">Get the latest tech projects delivered to your inbox</p>
        </div>
        
        {isSubscribed ? (
          <div className="rounded-md p-3 text-center">
            <p className="font-medium">Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="px-4 py-2 rounded w-full sm:w-64 border outline-white focus:outline-none text-white"
            />
            <button 
              type="submit" 
              className="bg-white text-primary hover:bg-gray-100 px-5 py-2 rounded font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterCTA;