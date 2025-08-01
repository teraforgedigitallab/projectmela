import React from "react";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-0">
        {/* Left Side */}
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
          <div className="flex items-center mb-2">
            <img
              src="/assets/logo/logo.png"
              alt="Project Mela"
              className="h-12 w-12 mr-2"
            />
            <span className="logo-font text-2xl">
              Project Mela
            </span>
          </div>
          <div className="text-gray-600 text-base mt-2 text-center md:text-left">
            <div>© Teraforge Digital Lab LLP | All rights reserved</div>
            <div className="mt-1">7718837352</div>
            <div className="mt-1">
              <a href="mailto:contact@projectmela.com" className="hover:underline">
                contact@projectmela.com
              </a>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center md:items-end w-full md:w-auto">
          <div className="flex items-center mb-4">
            <span className="text-primary text-xl font-semibold mr-4" style={{ fontFamily: "inherit" }}>
              Follow us
            </span>
            <a
              href="https://www.linkedin.com/company"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-6 h-6 text-primary" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-6 h-6 text-primary" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6 text-primary" />
            </a>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end text-gray-600 text-base gap-x-2 gap-y-1">
            <a href="/terms" className="hover:underline">Terms &amp; Conditions</a>
            <span className="mx-1 hidden sm:inline">·</span>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <span className="mx-1 hidden sm:inline">·</span>
            <a href="/admin" className="hover:underline">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;