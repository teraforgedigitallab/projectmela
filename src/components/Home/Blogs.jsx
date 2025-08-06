import { Link } from 'react-router-dom';
import { FaTag, FaCalendarAlt, FaEye } from 'react-icons/fa';

// Import blog images
import blog1 from '/assets/images/blog/blog1.jpg';
import blog2 from '/assets/images/blog/blog2.jpg';
import blog3 from '/assets/images/blog/blog3.jpg';

const BlogCard = ({ image, title, category, date, views, description, delay }) => {
    return (
        <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Blog Image */}
            <div className="relative overflow-hidden h-64">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Blog Content */}
            <div className="p-8">
                {/* Title */}
                <h4 className="text-xl font-bold mb-4 text-gray-900 hover:text-primary transition-colors">
                    <Link to="#">{title}</Link>
                </h4>

                {/* Meta Details */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <Link to="#" className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        <FaTag className="text-xs" />
                        <span>{category}</span>
                    </Link>
                    <Link to="#" className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        <FaCalendarAlt className="text-xs" />
                        <span>{date}</span>
                    </Link>
                    <Link to="#" className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        <FaEye className="text-xs" />
                        <span>{views}</span>
                    </Link>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 text-sm">{description}</p>

                {/* Read More Button */}
                <div className="mt-auto">
                    <Link
                        to="#"
                        className="inline-block bg-primary text-white px-6 py-2.5 rounded font-medium text-sm hover:bg-[#081828] transition-colors"
                    >
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Blogs = () => {
    const blogs = [
        {
            id: 1,
            image: blog1,
            title: 'The Internet Is A Job Seeker Most Crucial Success',
            category: 'Job Skills',
            date: '12-09-2023',
            views: '55',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard.',
            delay: '0.3s'
        },
        {
            id: 2,
            image: blog2,
            title: 'Today From Connecting With Potential Employers',
            category: 'Career Advice',
            date: '10-10-2023',
            views: '55',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard.',
            delay: '0.5s'
        },
        {
            id: 3,
            image: blog3,
            title: 'We\'ve Weeded Through Hundreds Of Job Hunting',
            category: 'Future Plan',
            date: '09-05-2023',
            views: '55',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard.',
            delay: '0.7s'
        }
    ];

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-primary text-white px-5 py-1.5 rounded-full font-semibold text-xs mb-3 uppercase">
                        LATEST NEWS
                    </span>
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">Latest News & Blog</h2>
                    <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
                    </p>
                </div>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            image={blog.image}
                            title={blog.title}
                            category={blog.category}
                            date={blog.date}
                            views={blog.views}
                            description={blog.description}
                            delay={blog.delay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blogs;