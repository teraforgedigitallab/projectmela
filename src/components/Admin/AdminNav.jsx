const AdminNav = ({ activeTab, handleTabChange }) => (
    <ul className="flex flex-wrap space-x-1 mt-4 border-b border-gray-200">
        {['Applications', 'Pending', 'Ongoing', 'Project Requests', 'Users'].map(tab => (
            <li className="mr-2" key={tab}>
                <button 
                    className={`inline-block py-3 px-4 rounded-t-lg cursor-pointer transition-colors ${
                        activeTab === tab 
                            ? 'text-primary border-b-2 border-primary font-medium' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTabChange(tab)}
                >
                    {tab}
                </button>
            </li>
        ))}
    </ul>
);

export default AdminNav;