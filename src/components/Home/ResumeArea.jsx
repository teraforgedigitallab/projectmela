
const ResumeArea = () => {
  return (
    <section
      className="relative bg-primary py-30 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/resume/resume-area.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center">
          <div className="w-full md:w-3/4 xl:w-1/2 text-center">
            <span className="bg-white text-primary text-sm font-semibold py-2 px-5 rounded-md shadow inline-block mb-6">
              GETTING STARTED TO WORK
            </span>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Don't just find. Be found. Put your CV in front of great employers
            </h2>
            <p className="text-white/90 text-base mb-10 max-w-2xl mx-auto">
              It helps you to increase your chances of finding a suitable job and let recruiters contact you about jobs that are not needed to pay for advertising.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="bg-white text-primary hover:bg-gray-100 transition-colors duration-300 py-3 px-8 rounded-md font-medium flex items-center justify-center gap-2 mx-auto w-fit shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Your Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeArea;