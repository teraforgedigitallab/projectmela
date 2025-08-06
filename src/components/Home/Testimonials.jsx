import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PiQuotesThin } from "react-icons/pi";

const testimonials = [
  {
    quote:
      "I just brought it and I love it. Lorem Ipsum is simply dummy text of the and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    clientImage: "/assets/images/testimonial/testi1.jpg",
    clientName: "Musharof Chowdhury",
    clientTitle: "CEO - Graygrids",
  },
  {
    quote:
      "I just brought it and I love it. Lorem Ipsum is simply dummy text of the and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    clientImage: "/assets/images/testimonial/testi2.jpg",
    clientName: "Naimur Rahman",
    clientTitle: "CEO - Wpthemes Grid",
  },
  {
    quote:
      "I just brought it and I love it. Lorem Ipsum is simply dummy text of the and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    clientImage: "/assets/images/testimonial/testi3.jpg",
    clientName: "Karmo Kerin",
    clientTitle: "CEO - Tredex",
  },
  {
    quote:
      "I just brought it and I love it. Lorem Ipsum is simply dummy text of the and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    clientImage: "/assets/images/testimonial/testi4.jpg",
    clientName: "Goro Chala",
    clientTitle: "CEO - Dream App",
  },
];

const testimonialRight = "/assets/images/testimonial/testimonial-right.png";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => handleNext(), 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [current]);

  const handlePrev = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setAnimating(false);
    }, 350);
  };

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
      setAnimating(false);
    }, 350);
  };

  return (
    <section className="relative bg-[#0d233e] py-14 md:py-18 overflow-hidden">
      {/* Patterns */}
      <div
        className="absolute top-0 left-0 w-[150px] h-[200px] bg-no-repeat bg-contain z-0 pointer-events-none"
        style={{ backgroundImage: "url('/assets/images/testimonial/pattern.png')" }}
      ></div>
      <div
        className="absolute bottom-0 right-20 w-[150px] h-[150px] bg-no-repeat bg-contain z-0 pointer-events-none"
        style={{ backgroundImage: "url('/assets/images/testimonial/pattern.png')" }}
      ></div>

      <div className="container px-4 relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Left: Testimonial Content */}
          <div className="w-full md:w-1/2 max-w-xl flex flex-col justify-center mx-auto">
            <span className="bg-primary text-white rounded px-5 py-2 text-sm font-semibold mb-6 shadow inline-block w-fit">
              WHAT OUR CLIENTS SAY
            </span>
            <h2 className="text-white font-bold text-3xl md:text-4xl mb-2">
              Our Testimonials
            </h2>
            <div className="w-16 h-1 bg-primary rounded mb-8"></div>
            <div className="relative min-h-[200px] md:min-h-[180px]">
              <div
                className={`transition-all duration-350 ease-in-out absolute inset-0 ${
                  animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
                }`}
                key={current}
              >
                <div className="flex flex-col">
                  <PiQuotesThin className="w-6 h-6 text-white mb-2" />
                  <p className="text-white text-base md:text-sm leading-relaxed mb-6 max-w-xl">
                    {testimonials[current].quote}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={testimonials[current].clientImage}
                      alt={testimonials[current].clientName}
                      className="w-14 h-14 rounded-full object-cover border-4 border-white"
                    />
                    <div>
                      <h4 className="text-white font-semibold text-base md:text-lg">
                        {testimonials[current].clientName}
                      </h4>
                      <p className="text-white/70 text-sm">{testimonials[current].clientTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Navigation */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                aria-label="Previous"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                aria-label="Next"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full hidden md:w-1/2 lg:flex justify-center relative">
            <div className="absolute -top-40 right-50 w-[300px] md:w-[350px]">
              <img
                src={testimonialRight}
                alt="Testimonial"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;