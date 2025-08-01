import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi2';

const Hero = () => {
    return (
        <section 
            className="relative py-16 md:py-20 overflow-hidden"
            style={{
                backgroundImage: 'url(/assets/images/hero-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Hero content */}
                        <motion.div 
                            className="text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.h1 
                                className="text-4xl md:text-5xl font-bold leading-tight mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                Freelancing made easy <br/>
                                <span className="text-blue-200">for Tech Projects</span>
                            </motion.h1>
                            
                            <motion.p 
                                className="text-lg text-white/90 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                            >
                                Just post a project and the platform with the power of AI will take care of everything else from finding the perfect candidates to seamless project management and timely delivery.
                            </motion.p>
                            
                            <motion.div 
                                className="space-y-2 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                <div className="flex items-center">
                                    <HiCheck className="w-5 h-5 mr-2 text-blue-300" />
                                    <span>Apply to Unlimited Tech Projects for <span className="font-bold">FREE</span></span>
                                </div>
                                <div className="flex items-center">
                                    <HiCheck className="w-5 h-5 mr-2 text-blue-300" />
                                    <span>Post Unlimited Tech Projects for <span className="font-bold">FREE</span></span>
                                </div>
                            </motion.div>
                            
                            <div className="flex items-center flex-wrap gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.5 }}
                                >
                                    <Link 
                                        to="/post-project" 
                                        className="bg-white text-primary hover:bg-gray-100 py-3 px-6 rounded-md font-semibold inline-block transition-all duration-300"
                                    >
                                        Post a Project
                                    </Link>
                                </motion.div>
                                
                                <motion.div 
                                    className="flex items-center"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 0.6 }}
                                >
                                    <div className="flex -space-x-3 mr-3">
                                        <img src="/assets/images/blog/comment1.png" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                                        <img src="/assets/images/blog/comment2.png" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                                        <img src="/assets/images/blog/comment3.png" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                                            50+
                                        </div>
                                    </div>
                                    <motion.span 
                                        className="text-sm text-blue-100"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                    >
                                        Projects worth ₹100,000+ Completed
                                    </motion.span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;