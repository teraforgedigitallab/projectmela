import React, { useRef } from "react";
import { Typography } from "../../ui";
import { IoPlayOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const keywords = ["Administrative", "Android", "app", "ASP.NET"];

const Hero = () => {

  const keywordRef = useRef();
  const locationRef = useRef();

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = keywordRef.current.value.trim();
    const location = locationRef.current.value.trim();
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <section className="bg-gray-50 max-w-6xl mx-auto py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text & Search */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <Typography
              variant="h2"
              className="font-bold text-gray-900 text-3xl md:text-5xl mb-6 leading-tight"
              as={motion.h1}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Find Your Career <br /> to Make a Better Life
            </Typography>
            <Typography
              variant="small"
              className="text-gray-700 text-base md:text-md mb-8"
              as={motion.p}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              Creating a beautiful job website is not easy <br /> always. To make your life easier, we are introducing <br /> Project Mela.
            </Typography>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <form className="flex flex-col md:flex-row items-stretch w-full bg-white border border-gray-400 rounded-sm p-2 md:p-0"
              onSubmit={handleSearch}>
                {/* What Field */}
                <div className="relative flex-1 max-w-full md:max-w-[37%] px-4 py-2 flex flex-col justify-center">
                  <label htmlFor="keyword" className="block text-sm text-black font-semibold capitalize mb-1">
                    What
                  </label>
                  <input
                    id="keyword"
                    name="keyword"
                    type="text"
                    placeholder="What jobs you want?"
                    className="w-full border-none text-gray-700 text-xs font-normal p-0 h-auto bg-transparent focus:outline-none"
                    ref={keywordRef}
                  />
                  {/* Vertical Divider for desktop */}
                  <span className="hidden md:block absolute top-1/2 right-0 h-[70%] w-px bg-gray-400 -translate-y-1/2"></span>
                </div>
                {/* Where Field */}
                <div className="flex-1 max-w-full md:max-w-[37%] px-4 py-2 flex flex-col justify-center">
                  <label htmlFor="keyword" className="block text-sm text-black font-semibold capitalize mb-1">
                    Where
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Location"
                    className="w-full border-none text-gray-700 text-xs font-normal p-0 h-auto bg-transparent focus:outline-none"
                    ref={locationRef}
                  />
                </div>
                {/* Search Button */}
                <div className="w-full md:w-auto flex items-center md:px-2">
                  <button
                    type="submit"
                    className="bg-primary text-white w-full py-3 px-10 md:w-auto rounded-sm font-normal text-xs transition duration-400 hover:bg-primary-hover hover:shadow-md cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

            </motion.div>

            <div className="mt-4 px-4">
              <span className="text-primary font-normal text-sm mr-2">Popular Keywords:</span>
              <div className="inline-flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <a
                    key={kw}
                    href="#"
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs border border-gray-400 hover:bg-primary hover:text-white transition"
                  >
                    {kw}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Image & Play Button */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <motion.div
              className="relative w-full max-w-md aspect-square flex items-center justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Pattern background */}
              <div className="absolute -right-12 -bottom-24 w-[300px] h-[300px] bg-no-repeat bg-contain z-0 pointer-events-none hidden md:block"
                style={{ backgroundImage: "url('/assets/images/hero/pattern.png')" }}
              ></div>

              {/* Hero Image */}
              <img
                src="/assets/images/hero/hero-image.png"
                alt="Hero"
                className="w-full h-full object-cover rounded-[10px_100px_10px_100px] shadow-lg relative z-10"
              />

              {/* Waves Animation */}
              <div className="absolute left-1/2 top-1/2 z-20 pointer-events-none">
                <span className="waves-animate absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white" style={{ animationDelay: "0s" }}></span>
                <span className="waves-animate absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white" style={{ animationDelay: "1s" }}></span>
                <span className="waves-animate absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white" style={{ animationDelay: "2s" }}></span>
              </div>

              {/* Play Button */}
              <motion.a
                href="#"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(32,66,227,0.7)] z-30 transition hover:bg-white hover:text-primary border-0"
                aria-label="Play Video"
              >
                <IoPlayOutline size={24} />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;