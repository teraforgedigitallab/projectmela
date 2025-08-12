import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ScrollableModal = ({
    show,
    heading,
    body,
    onClose,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryButtonClicked,
    onSecondaryButtonClicked,
    showButtons,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl mx-4 my-8 md:mx-auto">
                <div className="bg-white rounded-sm shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            {heading}
                        </h3>
                        <button 
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={onClose}
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    </div>
                    
                    {/* Body */}
                    <div className="px-6 py-4 overflow-y-auto flex-grow">
                        <div className="prose max-w-none">
                            {body}
                        </div>
                    </div>
                    
                    {/* Footer */}
                    {showButtons && (
                        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                onClick={onSecondaryButtonClicked}
                            >
                                {secondaryButtonText}
                            </button>
                            <button 
                                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-sm shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                onClick={onPrimaryButtonClicked}
                            >
                                {primaryButtonText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScrollableModal;