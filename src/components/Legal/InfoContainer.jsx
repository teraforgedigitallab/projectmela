import PropTypes from "prop-types";

const InfoContainer = ({ heading, details, isListType = true }) => (
    <div className="mb-4 p-4 bg-gray-50 rounded">
        <h6 className="text-base font-semibold text-blue-700 mb-2">
            {heading}
        </h6>
        <div className="text-gray-700">
            {isListType ? (
                <ul className="list-disc list-inside space-y-1">
                    {details.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <span>{details}</span>
            )}
        </div>
    </div>
);

InfoContainer.propTypes = {
    heading: PropTypes.string.isRequired,
    details: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
    isListType: PropTypes.bool
};

export default InfoContainer;