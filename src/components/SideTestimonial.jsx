import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonialImages = [
    "/assets/images/signin/auth-testi-1.jpg",
    "/assets/images/signin/auth-testi-2.jpg",
    "/assets/images/signin/auth-testi-3.jpg"
];

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.12, type: "spring", stiffness: 120 }
    })
};

const SideTestimonial = ({ testimonials }) => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-primary/80 to-blue-200 overflow-hidden px-2 py-8 md:px-6 md:py-10">
            <img
                src="/assets/images/signin/auth-illustration.svg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                style={{ zIndex: 1 }}
            />
            <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-4">
                <AnimatePresence>
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={cardVariants}
                            className="flex items-center gap-4 bg-white/80 border border-blue-200 rounded-xl shadow-lg px-4 py-4 md:px-6 md:py-5"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={testimonialImages[index % testimonialImages.length]}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow"
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <svg className="w-6 h-5 text-primary mb-1" viewBox="0 0 26 17" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 16.026h8.092l6.888-16h-4.592L0 16.026Zm11.02 0h8.092L26 .026h-4.65l-10.33 16Z" fill="currentColor"></path>
                                </svg>
                                <blockquote className="text-[15px] md:text-base font-medium text-primary mb-1 leading-snug">
                                    <p>{testimonial.quote}</p>
                                </blockquote>
                                <figcaption className="text-xs md:text-sm text-gray-700">
                                    <span className="font-semibold">{testimonial.name}</span>, {testimonial.designation} at{" "}
                                    <span className="text-primary">{testimonial.institution}</span>
                                </figcaption>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SideTestimonial;