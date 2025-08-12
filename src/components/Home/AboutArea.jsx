import React from "react";
import { FaThLarge, FaSearch, FaChartLine } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";

const aboutImages = [
    "/assets/images/about/small1.jpg",
    "/assets/images/about/small2.jpg",
    "/assets/images/about/small3.jpg",
];

const AboutArea = () => {
    return (
        <section className="about-us section bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-start justify-center gap-5">
                    {/* Left Images & Card */}
                    <div className="w-full lg:w-[45%]">
                        <div className="relative">
                            <div className="flex gap-6 mb-6">
                                <img
                                    src={aboutImages[0]}
                                    alt="about-1"
                                    className="rounded-sm object-cover w-40 h-50 md:w-70 md:h-80 shadow-md"
                                />
                                <img
                                    src={aboutImages[1]}
                                    alt="about-2"
                                    className="rounded-sm object-cover w-40 h-50 md:w-70 md:h-80 shadow-md translate-y-12"
                                />
                            </div>
                            <div className="flex gap-6">
                                <img
                                    src={aboutImages[2]}
                                    alt="about-3"
                                    className="rounded-sm object-cover w-40 h-50 md:w-70 md:h-80 shadow-md"
                                />
                                <div className="bg-primary rounded-sm text-white flex flex-col justify-center px-8 py-10 w-40 h-50 md:w-70 md:h-70 shadow-lg translate-y-12">
                                    <div className="bg-white/10 rounded p-3 w-fit mb-4">
                                        <IoCheckmark className="text-sm md:text-xl" />
                                    </div>
                                    <h6 className="text-md md:text-xl font-semibold mb-3">Project alert!</h6>
                                    <p className="text-xs md:text-base">
                                        104 new jobs are available in this week!
                                    </p>
                                    {/* Pattern background */}
                                    <div className="absolute -right-12 -bottom-20 hidden md:block md:w-[200px] md:h-[200px] bg-no-repeat bg-contain z-0 pointer-events-none"
                                        style={{ backgroundImage: "url('/assets/images/hero/pattern.png')" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-[45%] flex flex-col justify-center pt-8">
                        <h2 className="text-heading font-bold text-2xl mt-4 md:text-3xl mb-12 leading-tight">
                            Help You To Get The <br /> Best Project That Fits You
                        </h2>
                        <div className="flex flex-col gap-10">
                            <div className="flex items-start gap-5">
                                <div className="bg-gray-100 rounded-sm w-14 h-14 flex items-center justify-center">
                                    <FaThLarge className="text-primary text-2xl" />
                                </div>
                                <div>
                                    <h5 className="text-heading font-semibold text-lg mb-2">
                                        #1 Projects site in UK
                                    </h5>
                                    <p className="text-body text-base">
                                        Leverage agile frameworks to provide a robust synopsis for high
                                        level overviews. Iterative
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="bg-gray-100 rounded-sm w-14 h-14 flex items-center justify-center">
                                    <FaSearch className="text-primary text-2xl" />
                                </div>
                                <div>
                                    <h5 className="text-heading font-semibold text-lg mb-2">
                                        Seamless searching
                                    </h5>
                                    <p className="text-body text-base">
                                        Capitalize on low hanging fruit to identify a ballpark value
                                        added activity to beta test.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="bg-gray-100 rounded-sm w-14 h-14 flex items-center justify-center">
                                    <FaChartLine className="text-primary text-2xl" />
                                </div>
                                <div>
                                    <h5 className="text-heading font-semibold text-lg mb-2">
                                        Hired in top companies
                                    </h5>
                                    <p className="text-body text-base">
                                        Podcasting operational change management inside of workflows to
                                        establish.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutArea;