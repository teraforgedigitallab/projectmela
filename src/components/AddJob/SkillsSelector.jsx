import { useState } from 'react';

const SkillsSelector = ({ selectedSkills, setSelectedSkills, options }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredOptions = options.filter(
        option => option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (skill) => {
        if (!selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        }
        setSearchTerm('');
    };

    const handleRemove = (skill) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
    };

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-md bg-white min-h-[42px]">
                {selectedSkills.map(skill => (
                    <div
                        key={skill}
                        className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-md"
                    >
                        <span>{skill}</span>
                        <button
                            type="button"
                            onClick={() => handleRemove(skill)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="flex-grow min-w-[120px] outline-none border-none"
                    placeholder={selectedSkills.length === 0 ? "Select skills" : ""}
                />
            </div>

            {showDropdown && filteredOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map(option => (
                        <div
                            key={option}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedSkills.includes(option) ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillsSelector;