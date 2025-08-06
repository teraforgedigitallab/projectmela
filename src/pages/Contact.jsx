import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from 'react-icons/fa';
import { ProfileBanner } from '../components';

const Contact = () => {
    return (
        <section id="contact-us" className="bg-gray-100 pb-20">

            <ProfileBanner
                title="Contact"
                subtitle="Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business."
                breadcrumbs={[
                    { name: "Home", href: "/" },
                    { name: "About", href: "/about" }
                ]}
            />

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-white rounded-xl shadow-md p-8 md:p-14">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Contact Form */}
                        <div className="w-full md:w-7/12">
                            <h3 className="text-2xl font-bold mb-8 text-gray-900">Send Us a Message</h3>
                            <form className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        className="w-full md:w-1/2 px-5 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-4 md:mb-0"
                                    />
                                    <input
                                        name="subject"
                                        type="text"
                                        placeholder="Your Subject"
                                        required
                                        className="w-full md:w-1/2 px-5 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                        className="w-full md:w-1/2 px-5 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-4 md:mb-0"
                                    />
                                    <input
                                        name="phone"
                                        type="text"
                                        placeholder="Your Phone"
                                        required
                                        className="w-full md:w-1/2 px-5 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows={5}
                                        className="w-full px-5 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-8 py-3 rounded font-semibold text-base hover:bg-[#081828] transition-colors w-full md:w-auto"
                                    >
                                        Submit Message
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Contact Info */}
                        <div className="w-full md:w-5/12">
                            <div className="mb-8">
                                <h4 className="text-xl font-bold mb-2 text-gray-900">Contact Information</h4>
                                <p className="text-gray-600">
                                    Business consulting excepteur sint occaecat cupidatat consulting non proident.
                                </p>
                            </div>
                            <div className="mb-6 flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <div className="text-gray-700 font-semibold mb-1">Phone</div>
                                    <ul>
                                        <li className="text-gray-600 text-sm">+522 672-452-1120</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mb-6 flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <div className="text-gray-700 font-semibold mb-1">Email</div>
                                    <ul>
                                        <li className="text-gray-600 text-sm">
                                            <a href="mailto:example@yourwebsite.com" className="hover:text-primary">example@yourwebsite.com</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mb-6 flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <div className="text-gray-700 font-semibold mb-1">Address</div>
                                    <ul>
                                        <li className="text-gray-600 text-sm">
                                            KA-62/1, Travel Agency, 45 Grand Central Terminal, New York.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-gray-900 font-semibold mb-2">Follow Us on</h5>
                                <div className="flex gap-3">
                                    <a href="#" className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full p-2 transition-colors">
                                        <FaFacebookF />
                                    </a>
                                    <a href="#" className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full p-2 transition-colors">
                                        <FaTwitter />
                                    </a>
                                    <a href="#" className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full p-2 transition-colors">
                                        <FaLinkedinIn />
                                    </a>
                                    <a href="#" className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full p-2 transition-colors">
                                        <FaPinterestP />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Google Map */}
                <div className="mt-16">
                    <div className="rounded-xl overflow-hidden shadow-md">
                        <iframe
                            width="100%"
                            height="400"
                            title="Google Map"
                            src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            className="w-full"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;