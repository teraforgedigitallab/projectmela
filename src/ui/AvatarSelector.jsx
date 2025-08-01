import React, { useEffect, useState } from "react";
import { maleAvatars, femaleAvatars } from "../data/data";

const AvatarSelector = ({
    gender = "",
    value = "",
    onChange,
    disabled = false,
}) => {
    const [avatarIndex, setAvatarIndex] = useState(0);

    // Get avatar list based on gender
    const getAvatars = () => {
        if (gender === "Male") return maleAvatars;
        if (gender === "Female") return femaleAvatars;
        return [...maleAvatars, ...femaleAvatars];
    };

    const avatars = getAvatars();

    // Sync avatarIndex with value
    useEffect(() => {
        if (!value) {
            setAvatarIndex(0);
            return;
        }
        const idx = avatars.findIndex((a) => a === value);
        setAvatarIndex(idx >= 0 ? idx : 0);
    }, [value, gender]);

    // Handle left/right navigation
    const handleChange = (direction) => {
        if (disabled) return;
        let newIndex =
            direction === "left"
                ? (avatarIndex - 1 + avatars.length) % avatars.length
                : (avatarIndex + 1) % avatars.length;
        setAvatarIndex(newIndex);
        if (onChange) onChange(avatars[newIndex]);
    };

    return (
        <div className="avatar-selection flex align-center justify-center">
            <button
                type="button"
                className="avatar-control-btn"
                onClick={() => handleChange("left")}
                disabled={disabled}
                aria-label="Previous avatar"
            >
                &lt;
            </button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                    src={avatars[avatarIndex]}
                    alt="Selected Avatar"
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                        marginBottom: 8,
                        objectFit: "cover",
                        background: "#fff",
                    }}
                />
                <span className="avatar-selection-text">Choose your avatar</span>
            </div>
            <button
                type="button"
                className="avatar-control-btn"
                onClick={() => handleChange("right")}
                disabled={disabled}
                aria-label="Next avatar"
            >
                &gt;
            </button>
        </div>
    );
};

export default AvatarSelector;