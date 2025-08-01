import React from "react";
import PropTypes from "prop-types";

const parseRichText = (text) => {
    // Regular expression to match tags
    const richTextRegex = /\[(\w+)(?:\s+([^\]]+))?\](.*?)\[\/\1\]/g;

    const elements = [];
    let lastIndex = 0;

    text.replace(richTextRegex, (match, tag, attrs, content, offset) => {
        // Add any text before the tag
        if (offset > lastIndex) {
            elements.push(text.slice(lastIndex, offset));
        }

        // Parse different tag types
        switch (tag) {
            case 'b':
                elements.push(<b key={offset}>{content}</b>);
                break;
            case 'i':
                elements.push(<i key={offset}>{content}</i>);
                break;
            case 'u':
                elements.push(<u key={offset}>{content}</u>);
                break;
            case 'a':
                const href = attrs ? attrs.replace('href=', '').replace(/['"]/g, '') : '#';
                elements.push(
                    <a key={offset} href={href} target="_blank" rel="noopener noreferrer">
                        {content}
                    </a>
                );
                break;
            default:
                elements.push(match);
        }

        lastIndex = offset + match.length;
        return match;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
        elements.push(text.slice(lastIndex));
    }

    return elements.length > 0 ? elements : text;
};

const TermsInfoContainer = ({ heading, details, isListType = true }) => (
    <div className="terms-and-conditions-infoContainer">
        <h6 className="terms-and-conditions-infoHeading">{heading}</h6>
        <p className="terms-and-conditions-infoDetails">
            {isListType ? (
                <ul style={{ paddingLeft: 0 }}>
                    {details.map((item, index) => {
                        // Calculate total left padding based on tab level
                        const tabLevel = item.tabLevel || 0;
                        const leftPadding = tabLevel * 2; // 2rem per tab level

                        return (
                            <li
                                key={index}
                                className={item.isListItem ? '' : 'invisible-bullet'}
                                style={{
                                    marginLeft: `${leftPadding}rem`,
                                    listStylePosition: 'inside'
                                }}
                            >
                                {parseRichText(item.text)}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                details.map((item, index) => (
                    <span key={index}>{parseRichText(item.text)}</span>
                ))
            )}
        </p>
    </div>
);

// Update PropTypes
TermsInfoContainer.propTypes = {
    heading: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            isListItem: PropTypes.bool,
            tabLevel: PropTypes.number
        })
    ).isRequired,
    isListType: PropTypes.bool
};

export default TermsInfoContainer;