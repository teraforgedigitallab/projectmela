import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import { BiLockAlt } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebaseConfig/firebase";
import { Modal } from "../ui";

const Header = ({ isHomePage = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "Projects",
      path: "/projects"
    },
    {
      name: "People",
      path: "/browse-profiles"
    },
    {
      name: "About",
      path: "/about"
    },
    // {
    //   name: "Blog",
    //   path: "/blog",
    //   dropdown: "blog",
    //   subItems: [
    //     { name: "Blog Grid Sidebar", path: "/blog-grid" },
    //     { name: "Blog Single", path: "/blog-single" },
    //     { name: "Blog Single Sidebar", path: "/blog-single-sidebar" },
    //   ],
    // },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const initiateLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate("/signin");
  };

  return (
    <header className={`w-full bg-gray-50 border-b-1 border-gray-400 ${isSticky ? "fixed top-0 left-0 z-40 shadow-md bg-white" : ""}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logo/logo.png"
                alt="Project Mela Logo"
                className="h-8 w-8"
              />
              <span className="logo-font font-medium text-primary ml-2 text-xl">
                Project Mela
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-end">
            <ul className="flex">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.dropdown)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-7 inline-block text-sm font-medium transition-colors relative
        ${location.pathname === item.path
                        ? "text-primary"
                        : "text-gray-800 hover:text-primary"
                      }`}
                  >
                    {item.name}
                    {/* Bottom border for active state */}
                    <span className={`absolute bottom-0 left-1/5 w-[60%] h-[3px] bg-primary transform origin-left transition-transform duration-300 
        ${location.pathname === item.path
                        ? "scale-x-100"
                        : "group-hover:scale-x-100 scale-x-0"}`}
                    />
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {hoveredItem === item.dropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full bg-white shadow-lg rounded-sm min-w-[220px] z-50"
                        >
                          {item.subItems?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`block px-6 py-3 text-sm hover:bg-gray-50 ${location.pathname === subItem.path
                                ? "bg-primary text-white"
                                : "text-gray-700"
                                }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth/Profile Buttons */}
          <div className="hidden lg:flex items-center space-x-3 gap-2 ml-8">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="flex items-center text-sm text-primary hover:text-primary-hover font-medium"
                  data-toggle="modal"
                  data-target="#login"
                >
                  <BiLockAlt className="mr-1 " />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signin?signup=true"
                  className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                  data-toggle="modal"
                  data-target="#signup"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="flex items-center text-sm text-primary hover:text-primary-hover font-medium px-4 py-2 rounded transition"
                >
                  <FaUserCircle className="mr-2 text-xl" />
                  Profile
                </Link>
                <button
                  onClick={initiateLogout}
                  className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded text-sm transition-all duration-300 ease-in-out shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Sign Out
                  <PiSignOut size={18} />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden relative w-6 h-5 focus:outline-none ${mobileOpen ? 'z-50' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`block absolute h-0.5 w-6 bg-gray-800 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block absolute h-0.5 w-6 bg-gray-800 mt-2 transition-opacity duration-300 ease-in-out ${mobileOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block absolute h-0.5 w-6 bg-gray-800 mt-4 transform transition-transform duration-300 ease-in-out ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-gray-100 absolute top-16 left-0 right-0 z-40 shadow-md"
          >
            <div className="container mx-auto px-4 py-3">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name} className="border-b border-gray-100 pb-1">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          to={item.path}
                          className={`py-3 text-sm font-medium ${location.pathname === item.path ? "text-primary" : "text-gray-800"
                            }`}
                        >
                          {item.name}
                        </Link>
                        {item.dropdown && (
                          <button
                            onClick={() => setHoveredItem(hoveredItem === item.dropdown ? null : item.dropdown)}
                            className="p-2 focus:outline-none"
                            aria-label="Toggle dropdown"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              fill="currentColor"
                              className={`transition-transform duration-300 ${hoveredItem === item.dropdown ? 'rotate-180' : ''}`}
                              viewBox="0 0 16 16"
                            >
                              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Mobile dropdown */}
                      {item.dropdown && (
                        <AnimatePresence>
                          {hoveredItem === item.dropdown && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-1 mt-1 mb-2"
                            >
                              {item.subItems?.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.path}
                                    className={`block py-2 text-sm ${location.pathname === subItem.path
                                      ? "text-primary"
                                      : "text-gray-600 hover:text-primary-hover"
                                      }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Mobile Auth/Profile Buttons */}
              <div className="flex flex-col space-y-3 mt-4 pt-2 border-t border-gray-100">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/signin"
                      className="flex items-center justify-center text-sm font-medium text-gray-700 hover:text-primary py-2 border border-gray-200 rounded-sm"
                      data-toggle="modal"
                      data-target="#login"
                    >
                      <BiLockAlt className="mr-2" />
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-primary text-white py-2.5 rounded-sm font-medium hover:bg-primary-hover text-center text-sm shadow-sm transition-all duration-300"
                      data-toggle="modal"
                      data-target="#signup"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center justify-center text-sm font-medium text-primary hover:text-primary-hover py-2 border border-gray-200 rounded-sm"
                    >
                      <FaUserCircle className="mr-2 text-xl" />
                      Profile
                    </Link>
                    <button
                      onClick={initiateLogout}
                      className="bg-primary text-white py-2.5 rounded-sm font-medium hover:bg-primary-hover text-center text-sm shadow-sm transition-all duration-300 ease-in-out w-full flex items-center justify-center gap-2"
                    >
                      Sign Out
                      <IoLogOutOutline size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        heading="Sign Out"
        body="Are you sure you want to sign out?"
        showButtons={true}
        primaryButtonText="Sign Out"
        secondaryButtonText="Cancel"
        onPrimaryClick={handleLogout}
        onSecondaryClick={() => setShowLogoutModal(false)}
      />
    </header>
  );
};

export default Header;