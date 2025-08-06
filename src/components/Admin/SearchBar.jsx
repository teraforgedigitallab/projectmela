import React from 'react';

const SearchBar = ({
    showFilterOptions = false,
    onClickFilterOptions = () => { },
    onClickSortOptions = () => { },
    placeholder = "Search by....",
    value = "",
    onChange = () => { },
    showFilterDot = false,
    showSortDot = false,
}) => {
    return (
        <div className="flex items-center mb-5 relative">
            <div className="flex items-center w-full max-w-xs bg-gray-100 rounded-sm p-1.5 sm:max-w-none">
                {/* Search Icon and Search input box group */}
                <div className="flex items-center flex-grow min-w-0">
                    <label htmlFor="input" className="flex items-center px-1.5 flex-shrink-0">
                        <svg viewBox="0 0 512 512" className="w-5 h-5 fill-gray-500">
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                        </svg>
                    </label>

                    <input
                        type="text"
                        name="text"
                        className="border-none bg-transparent px-2 py-2 text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-gray-400/40 sm:text-xs sm:py-1.5"
                        id="input"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                </div>

                {/* Filter and Sort Button Group */}
                <div className="flex items-center flex-shrink-0">
                    {showFilterOptions && (
                        <>
                            <div className="h-5 w-px bg-gray-300 mx-1.5 sm:mx-0.5"></div>

                            <button 
                                className="bg-transparent border-none cursor-pointer p-1.5 flex items-center justify-center relative sm:p-1" 
                                onClick={onClickFilterOptions}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="#727272" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="sm:w-5 sm:h-5"
                                >
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                                {showFilterDot && <span className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1 right-1"></span>}
                            </button>
                        </>
                    )}

                    <div className="h-5 w-px bg-gray-300 mx-1.5 sm:mx-0.5"></div>

                    <button 
                        className="bg-transparent border-none cursor-pointer p-1.5 flex items-center justify-center relative sm:p-1" 
                        onClick={onClickSortOptions}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#727272" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="sm:w-5 sm:h-5"
                        >
                            <path d="M17 9.5H3M21 4.5H3M21 14.5H3M17 19.5H3" />
                        </svg>
                        {showSortDot && <span className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1 right-1"></span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;