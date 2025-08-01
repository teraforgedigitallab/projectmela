import React, { useState } from 'react';
import { skillOptions } from '../../data/data';
import { toast } from "react-toastify";

const SkillsDropdown = ({ selectedSkills, setSelectedSkills, options }) => {

    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSkillChange = (skill) => {
        if (selectedSkills.length > 20) {
            toast.error("You cannot select more than 20 skills.");
            return;
        }
        setSelectedSkills(prevSkills =>
            prevSkills.includes(skill)
                ? prevSkills.filter(s => s !== skill)
                : [...prevSkills, skill]
        );
    };

    const handleRemoveSkill = (skill, e) => {
        e.preventDefault(); // Prevent default behavior
        setSelectedSkills(prevSkills => prevSkills.filter(s => s !== skill));
    };

    const handleSaveSkills = (e) => {
        e.preventDefault();
        if (selectedSkills.length === 0) {
            toast.warning("Please select at least one skill.");
            return;
        }
        setShowSkillsDropdown(false);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <button className={`cm4vd clo09 cn582 cqwhl cwkz1 cp9oo ${showSkillsDropdown ? 'cfxpd ciekg c0k6h' : 'czhnl'}`}
                onClick={(e) => { e.preventDefault(); setShowSkillsDropdown(!showSkillsDropdown); }}>
                <div className="chu3i cduop c8og8">
                    <div className="czhnl c1g5q ctzpc cqwhl c75a8">
                        {!showSkillsDropdown ? (
                            <svg className="cdzk3" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15h-4v-4a1 1 0 0 0-2 0v4h-4a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2Z"></path>
                            </svg>
                        ) : (
                            <svg className="c96oa" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                                <path d="m20.28 12.28-6.292 6.294-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0-1.414-1.414Z"></path>
                            </svg>
                        )}
                    </div>
                </div>
            </button>
            {showSkillsDropdown && (
                <div className="tech-stack-dropdown" style={{ maxHeight: '300px', overflowY: 'auto', position: 'relative' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: -17, zIndex: 1, backgroundColor: 'white' }}>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="Search skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                            />
                        </div>

                        <button className="cf37z c4vrg cw2fq c4von" onClick={(e) => handleSaveSkills(e)}>Save</button>
                    </div>

                    {filteredOptions.map(option => (
                        <div key={option}>
                            <input
                                type="checkbox"
                                id={option}
                                className="cicja"
                                checked={selectedSkills.includes(option)}
                                onChange={() => handleSkillChange(option)}
                            />
                            <label htmlFor={option} className="cvhuf cf37z cm87k">{option}</label>
                        </div>
                    ))}
                </div>
            )}
            <div className="selected-tech-stack">
                {selectedSkills.map((skill, index) => (
                    <span key={index} className="tech-stack-tag">
                        {skill}
                        <button onClick={(e) => handleRemoveSkill(skill, e)} className="remove-skill-btn">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillsDropdown;