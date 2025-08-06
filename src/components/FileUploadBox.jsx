import React, { useRef } from "react";

const FileUploadBox = ({ onClose, onFileSelect }) => {
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      <button
        className="absolute -top-4 -right-2 text-4xl text-gray-500 hover:text-gray-800 transition"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >
        ×
      </button>
      <form className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="file_input"
          className="cursor-pointer bg-[var(--color-gray-100)] hover:bg-[var(--color-gray-200)] border-2 border-dashed border-[var(--color-gray-500)] rounded-3xl px-8 py-8 flex flex-col items-center justify-center shadow-md transition w-full"
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              viewBox="0 0 640 512"
              className="h-12 w-12 mb-2"
              fill="var(--color-primary)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
            </svg>
            <p className="text-[var(--color-text-heading)] font-semibold text-lg text-center">
              Please upload your resume
            </p>
            <input
              type="file"
              id="file_input"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={inputRef}
              className="hidden"
            />
            <span
              className="mt-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-sm font-medium transition text-center"
              tabIndex={0}
              role="button"
            >
              Browse file
            </span>
          </div>
        </label>
      </form>
    </div>
  );
};

export default FileUploadBox;