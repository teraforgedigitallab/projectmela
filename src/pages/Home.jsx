import { Hero, TrustedBy, Projects, Testimonials, NewsletterCTA } from '../components';

const Home = () => {
  return (
    <div className='bg-gray-50'>
      <Hero />
      <TrustedBy />
      <Projects />
      <Testimonials />
      <NewsletterCTA />
    </div>
  )
}

export default Home;
