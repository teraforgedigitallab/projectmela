const JobFormSection = ({ title, number, children }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-2">
                    {number}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="pl-10">
                {children}
            </div>
        </div>
    );
};

export default JobFormSection;