import { FaTwitter, FaFacebook, FaTelegramPlane, FaLinkedinIn } from 'react-icons/fa';
import { handleShareToSocials } from '../utils/function';

const SocialShare = ({ shareLink }) => {
    return (
        <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Share this Project</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleShareToSocials('twitter', shareLink)}
                        className="w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition-colors duration-300 ease-in-out"
                        aria-label="Share on Twitter"
                    >
                        <FaTwitter />
                    </button>
                    <button
                        onClick={() => handleShareToSocials('facebook', shareLink)}
                        className="w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition-colors duration-300 ease-in-out"
                        aria-label="Share on Facebook"
                    >
                        <FaFacebook />
                    </button>
                    <button
                        onClick={() => handleShareToSocials('linkedin', shareLink)}
                        className="w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition-colors duration-300 ease-in-out"
                        aria-label="Share on LinkedIn"
                    >
                        <FaLinkedinIn />
                    </button>
                    <button
                        onClick={() => handleShareToSocials('telegram', shareLink)}
                        className="w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition-colors duration-300 ease-in-out"
                        aria-label="Share on Telegram"
                    >
                        <FaTelegramPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialShare;