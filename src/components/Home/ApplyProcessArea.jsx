import React, { useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { PiUserBold, PiBriefcaseBold } from "react-icons/pi";

const steps = [
  {
    icon: <PiUserBold />,
    title: "Register Your Account",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    icon: <GrDocumentText />,
    title: "Upload Your Resume",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    icon: <PiBriefcaseBold />,
    title: "Apply for Dream Project",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];

const ApplyProcessArea = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-20">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center md:w-1/3 w-full max-w-[350px]"
            >
              <div
                className={`flex-shrink-0 flex items-center justify-center mr-6 w-[60px] h-[60px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer
                  ${hoveredIndex === idx
                    ? "bg-white shadow-[0_0_0_8px_var(--color-primary)] rotate-[360deg]"
                    : "border border-dashed border-white bg-transparent rotate-0"
                  }`}
                tabIndex={0}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className={`text-2xl transition-colors duration-500 ${
                    hoveredIndex === idx ? "text-primary" : "text-white"
                  }`}
                >
                  {step.icon}
                </span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">{step.title}</h4>
                <div className="w-[50px] h-[2px] bg-white mb-4" />
                <p className="text-white text-sm leading-relaxed opacity-90">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplyProcessArea;