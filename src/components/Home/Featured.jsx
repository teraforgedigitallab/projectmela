import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaBookmark } from 'react-icons/fa';

import featuredimg1 from '/assets/images/featured/img1.jpg';
import featuredimg2 from '/assets/images/featured/img2.jpg';
import featuredimg3 from '/assets/images/featured/img3.jpg';
import featuredimg4 from '/assets/images/featured/img4.jpg';
import featuredimg5 from '/assets/images/featured/img5.jpg';
import featuredimg6 from '/assets/images/featured/img6.jpg';

const FeaturedJobCard = ({
    image,
    title,
    location,
    type,
    salary,
    description,
}) => (
    <div className="relative bg-white rounded-md shadow-sm overflow-hidden mb-8">
        {/* Featured Tag */}
        <div className="absolute top-0 right-0 overflow-hidden h-24 w-24 z-100">
            <div className="bg-primary text-white text-xs font-bold py-2 px-8 transform rotate-45 translate-x-6 -translate-y-1 shadow-md">
                FEATURED
            </div>
        </div>

        {/* Image */}
        <div className="w-full h-64 overflow-hidden">
            <img src={image} alt={title} className="object-cover w-full h-full" />
        </div>

        {/* Content */}
        <div className="p-7">
            {/* Title */}
            <h4 className="text-xl font-bold mb-5 text-gray-900">
                {title}
            </h4>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-sm">
                    <FaMapMarkerAlt className="text-primary" />
                    {location}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-sm">
                    <FaBriefcase className="text-primary" />
                    {type}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-sm">
                    <FaDollarSign className="text-primary" />
                    {salary}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-7 text-sm">
                {description}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
                <a
                    href="#"
                    className="bg-primary text-white px-6 py-3 rounded font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                    Apply Now
                </a>
                <button
                    className="border border-gray-300 text-gray-600 px-6 py-3 rounded font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                    <FaBookmark className="text-gray-400" />
                    Save It
                </button>
            </div>
        </div>
    </div>
);

const featuredJobs = [
    {
        image: featuredimg1,
        title: 'Graphics Design',
        location: 'New York',
        type: 'Full-time',
        salary: '80K-90K',
        description: 'We are looking for Enrollment Advisors who are looking to take 30-35 appointments per week. All leads are pre-scheduled.',
    },
    {
        image: featuredimg2,
        title: 'Restaurant Services',
        location: 'New York',
        type: 'Full-time',
        salary: '80K-90K',
        description: 'We are looking for Enrollment Advisors who are looking to take 30-35 appointments per week. All leads are pre-scheduled.',
    },
    {
        image: featuredimg3,
        title: 'Share Market Analysis',
        location: 'New York',
        type: 'Full-time',
        salary: '80K-90K',
        description: 'We are looking for Enrollment Advisors who are looking to take 30-35 appointments per week. All leads are pre-scheduled.',
    },
    {
        image: featuredimg4,
        title: 'Medical Services',
        location: 'New York',
        type: 'Full-time',
        salary: '80K-90K',
        description: 'We are looking for Enrollment Advisors who are looking to take 30-35 appointments per week. All leads are pre-scheduled.',
    },
    {
        image: featuredimg5,
        title: 'Auto Mobile Services',
        location: 'New York',
        type: 'Full-time',
        salary: '80K-90K',
        description: 'We are looking for Enrollment Advisors who are looking to take 30-35 appointments per week. All leads are pre-scheduled.',
    },
    {
        image: featuredimg6,
        title: 'IT & Networking Services',
        location: 'New York',
        type: 'Full-time',
        salary: '80K-90K',
        description: 'We are looking for Enrollment Advisors who are looking to take 30-35 appointments per week. All leads are pre-scheduled.',
    }
];

const Featured = () => {
    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-primary text-white px-5 py-1.5 rounded-full font-semibold text-xs mb-3 uppercase">
                        FEATURED JOBS
                    </span>
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">Browse Featured Jobs</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
                    </p>
                </div>
                {/* Featured Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredJobs.map((job, idx) => (
                        <FeaturedJobCard key={idx} {...job} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Featured;