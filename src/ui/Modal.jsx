import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const Modal = ({
    show,
    onClose,
    heading,
    body,
    primaryButtonText = "OK",
    secondaryButtonText = "Cancel",
    showButtons = false,
    onPrimaryClick = () => { },
    onSecondaryClick = () => { },
    showInputField = false,
    showIDInputField = false,
    inputPlaceholder = "Enter your text",
    IDinputPlaceholder = "Enter Super Admin ID",
    inputType = "text",
    IDinputType = "text",
    onInputChange = () => { },
    superAdminKey = "",
}) => {
    const [superAdminID, setSuperAdminID] = useState('');
    if (!show) return null;

    const handlePrimaryClick = () => {
        if (showIDInputField && superAdminID !== superAdminKey) {
            alert("Invalid Super Admin ID");
            return;
        }
        onPrimaryClick();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-primary transition"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <IoMdClose size={22} />
                </button>
                <div className="mb-4">
                    <p className="text-xl font-bold text-primary mb-2">{heading}</p>
                    <p className="text-gray-700">{body}</p>
                </div>
                {showIDInputField && (
                    <div className="mb-4">
                        <input
                            type={IDinputType}
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={IDinputPlaceholder}
                            onChange={(e) => setSuperAdminID(e.target.value)}
                        />
                    </div>
                )}
                {showInputField && (
                    <div className="mb-4">
                        <input
                            type={inputType}
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={inputPlaceholder}
                            onChange={onInputChange}
                        />
                    </div>
                )}
                {showButtons && (
                    <div className="flex justify-end gap-2 mt-4">
                        <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onSecondaryClick}>
                            {secondaryButtonText}
                        </button>
                        <button className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover" onClick={handlePrimaryClick}>
                            {primaryButtonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;