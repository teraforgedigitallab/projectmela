import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebaseConfig/firebase";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const lastScroll = useRef(window.scrollY);
  const hideTimeout = useRef(null);
  const location = useLocation();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Hide header on scroll down, show on scroll up, auto-hide after inactivity
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          // Only hide if not at the very top
          if (currentScroll > 80 && currentScroll > lastScroll.current) {
            setShowHeader(false);
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
          } else {
            setShowHeader(true);
            // Hide after 2s of inactivity, but only if not at the very top
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
            if (currentScroll > 80) {
              hideTimeout.current = setTimeout(() => {
                setShowHeader(false);
              }, 2000);
            }
          }
          lastScroll.current = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // Close mobile menu on route change (fixes bug)
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // After navigation, keep header visible for at least 1s
    setShowHeader(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    // Only auto-hide if not at the very top
    if (window.scrollY > 80) {
      hideTimeout.current = setTimeout(() => {
        setShowHeader(false);
      }, 2000);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm fixed top-0 left-0 z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img
                    src="/assets/logo/logo.png"
                    alt="Project Mela"
                    className="h-9 w-9 mr-2"
                  />
                  <span className="logo-font text-xl">
                    Project Mela
                  </span>
                </Link>
              </div>

              {/* Desktop Right Side */}
              <div className="hidden md:flex items-center gap-3">
                {!isLoggedIn ? (
                  <Link
                    to="/signin"
                    className="flex items-center font-bold text-primary hover:text-primary/80 mr-2 transition"
                  >
                    <FiLogIn className="w-5 h-5 mr-1" />
                    Sign In
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="flex items-center text-primary hover:text-primary/80 font-medium mr-2"
                    aria-label="Profile"
                  >
                    <FaUserCircle className="w-8 h-8" />
                  </Link>
                )}
                <Link
                  to="/post-project"
                  className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary/90 transition ml-1 shadow"
                >
                  Post a Project
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <motion.button
                whileTap={{ scale: 0.85, rotate: 10 }}
                className="md:hidden ml-2 text-gray-700"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Open Menu"
              >
                {mobileOpen ? (
                  <HiOutlineX className="w-7 h-7" />
                ) : (
                  <HiOutlineMenu className="w-7 h-7" />
                )}
              </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-full bg-white/95 z-50 border-b border-gray-100 shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center">
                  <img
                    src="/assets/logo/logo.png"
                    alt="Project Mela"
                    className="h-9 w-9 mr-2"
                  />
                  <span className="text-primary text-xl md:text-2xl font-semibold italic" style={{ fontFamily: "inherit" }}>
                    Project Mela
                  </span>
                </Link>
                <button
                  className="text-gray-700"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close Menu"
                >
                  <HiOutlineX className="w-7 h-7" />
                </button>
              </div>
              <nav className="flex flex-col items-start gap-2">
                {!isLoggedIn ? (
                  <Link
                    to="/signin"
                    className="flex items-center font-bold text-primary hover:text-primary/80 py-2 text-lg w-full"
                  >
                    <FiLogIn className="w-5 h-5 mr-1" />
                    Sign In
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="flex items-center text-primary hover:text-primary/80 font-medium py-2 text-lg w-full"
                    aria-label="Profile"
                  >
                    <FaUserCircle className="w-8 h-8 mr-2" />
                    Profile
                  </Link>
                )}
                <Link
                  to="/post-project"
                  className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition mt-2 w-full text-center shadow"
                >
                  Post a Project
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;