import PropTypes from "prop-types";

const SectionHeader = ({ number, title }) => (
    number && title && (
        <h4 className="flex items-center text-lg font-bold text-blue-700 mb-2">
            <span className="mr-2 text-blue-500">
                {number}
            </span>
            <span className="text-blue-700">
                {title}
            </span>
        </h4>
    )
);

SectionHeader.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default SectionHeader;