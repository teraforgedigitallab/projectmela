import React, { useState } from "react";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TfiLocationPin, TfiEmail } from "react-icons/tfi";
import { IoCallOutline } from "react-icons/io5";
// import { db } from '../firebaseConfig/firebase';
// import { collection, doc, setDoc } from 'firebase/firestore';
// import { toast } from 'react-toastify';

const Footer = () => {

  // const [email, setEmail] = useState('');
  // const [isSubscribed, setIsSubscribed] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     // Save email to Firestore
  //     const docRef = doc(collection(db, "NotifyEmailList"), email);
  //     await setDoc(docRef, {
  //       userEmail: email,
  //       subscribedOn: new Date().getTime(),
  //       lastNotified: new Date().getTime(),
  //       doNotShowNotification: false,
  //     });

  //     // Show success message
  //     toast.success("Successfully subscribed to newsletter!");
  //     setIsSubscribed(true);
  //     setEmail('');

  //     // Reset after 5 seconds
  //     setTimeout(() => {
  //       setIsSubscribed(false);
  //     }, 5000);

  //   } catch (error) {
  //     console.error("Error subscribing to newsletter:", error);
  //     toast.error("Failed to subscribe. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Logo & Info */}
        <div className="flex flex-col items-center md:items-start col-span-1">
          <div className="flex items-center mb-4">
            <img
              src="/assets/logo/logo.png"
              alt="Project Mela"
              className="h-12 w-12 mr-2"
            />
            <span className="logo-font text-xl font-bold text-gray-900">
              Project Mela
            </span>
          </div>
          <p className="text-gray-700 text-sm mb-4 text-center md:text-left">
            Start building your creative website with our awesome template Massive.
          </p>

          <div className="flex space-x-3 mt-2">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-400 rounded-sm p-2 transition-colors duration-200 group hover:bg-primary"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4 text-primary-hover transition-colors duration-200 group-hover:text-white" />
            </a>

            <a
              href="https://www.x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-400 rounded-sm p-2 transition-colors duration-200 group hover:bg-primary"
              aria-label="X Twitter"
            >
              <FaXTwitter className="w-4 h-4 text-primary-hover transition-colors duration-200 group-hover:text-white" />
            </a>
            <a
              href="https://www.linkedin.com/company"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-400 rounded-sm p-2 transition-colors duration-200 group hover:bg-primary"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-4 h-4 text-primary-hover transition-colors duration-200 group-hover:text-white" />
            </a>
          </div>
        </div>

        <div className="flex flex-col w-full items-center md:items-start font-normal text-xs text-gray-700 text-left space-y-4">
          <div className="flex flex-col w-full items-center md:items-start font-normal text-xs text-gray-700 text-left md:col-span-2 space-y-2">
            <div className="flex items-start gap-2">
              <TfiLocationPin size={14} className="mt-0.5" />
              <span>
                <p>
                  S109, 2nd Floor, Nano Wing,
                </p>
                <p>
                  Haware Fantasia Business Park,
                </p>
                <p>
                  Vashi, Navi Mumbai,
                </p>
                <p>
                  Maharashtra, India - 400703
                </p>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TfiEmail size={14} />
              <a href="mailto:contact@projectmela.com" className="hover:underline">
                contact@projectmela.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <IoCallOutline size={14} />
              <span>+91 77188 37352</span>
            </div>
          </div>
        </div>

        {/* For Candidates */}
        <div className="flex flex-col items-center md:items-start col-span-1">
          <h3 className="font-semibold text-md mb-3 text-gray-900">For Candidates</h3>
          <ul className="space-y-4 font-normal text-xs text-gray-700 text-left">
            <li><a href="#" className="hover:text-primary transition">User Dashboard</a></li>
            <li><a href="#" className="hover:text-primary transition">CV Packages</a></li>
            <li><a href="#" className="hover:text-primary transition">Projects Featured</a></li>
            <li><a href="#" className="hover:text-primary transition">Projects Urgent</a></li>
            <li><a href="#" className="hover:text-primary transition">Candidate List</a></li>
            <li><a href="#" className="hover:text-primary transition">Candidates Grid</a></li>
          </ul>
        </div>

        {/* For Employers */}
        <div className="flex flex-col items-center md:items-start col-span-1">
          <h3 className="font-semibold text-md mb-3 text-gray-900">For Employers</h3>
          <ul className="space-y-4 font-normal text-xs text-gray-700 text-left">
            <li><a href="#" className="hover:text-primary transition ">Post New</a></li>
            <li><a href="#" className="hover:text-primary transition">Employer List</a></li>
            <li><a href="#" className="hover:text-primary transition">Employers Grid</a></li>
            <li><a href="#" className="hover:text-primary transition">Project Packages</a></li>
            <li><a href="#" className="hover:text-primary transition">Projects Listing</a></li>
            <li><a href="#" className="hover:text-primary transition">Projects Featured</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* <div className="flex flex-col items-center md:items-start col-span-1">
          <h3 className="font-semibold text-md mb-3 text-gray-900">Join Our Newsletter</h3>
          <p className="text-gray-800 text-xs mb-3 text-center md:text-left">
            Subscribe to get the latest jobs posted, candidates...
          </p>
          {isSubscribed ? (<div className="rounded-sm p-3 text-center">
            <p className="font-medium">Thank you for subscribing!</p>
          </div>) : (
            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full border border-gray-400 rounded-sm px-4 py-2 mb-3 focus:outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-primary text-white text-xs hover:bg-primary-hover py-3 rounded-sm font-normal cursor-pointer transition-colors duration-200 ease-in w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-gray-400 text-gray-700 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center w-full">
          <div className="mb-2 md:mb-0 text-center text-xs md:text-left">
            Designed and Developed by <a href="https://teraforgedigitallab.com/" className="font-semibold text-gray-700 hover:text-primary transitions">Teraforge Digital Lab LLP</a>
          </div>
          <div className="flex flex-wrap justify-center text-xs md:justify-end gap-x-4 gap-y-1">
            <a href="/terms" className="hover:text-primary transition">Terms of use</a>
            <a href="/privacy" className="hover:text-primary transition">Privacy Policy</a>
            <a href="/faq" className="hover:text-primary transition">Faq</a>
            <a href="/contact" className="hover:text-primary transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;