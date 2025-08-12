import { Hero, ApplyProcessArea, ResumeArea, JobCategory, AboutArea, Projects, Featured, Testimonials, Blogs, TrustedBy } from '../components';

const Home = () => {
  return (
    <div className='bg-gray-50'>
      <Hero />
      <ApplyProcessArea />
      <JobCategory />
      <AboutArea />
      <ResumeArea />
      <Projects />
      {/* <Featured /> */}
      <Testimonials />
      <Blogs />
      <TrustedBy />
    </div>
  )
}

export default Home;
