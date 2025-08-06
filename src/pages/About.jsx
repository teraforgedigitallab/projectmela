import { ProfileBanner, AboutArea, ApplyProcessArea, TrustedBy} from '../components'

const About = () => {
    return (
        <div>
            <ProfileBanner
                title="About"
                subtitle="Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business."
                breadcrumbs={[
                    { name: "Home", href: "/" },
                    { name: "Cotact Us", href: "/contact" }
                ]}
            />

            <AboutArea />
            <ApplyProcessArea />
            <div className="bg-gray-50 py-10" />
            <TrustedBy />
        </div>
    )
}

export default About
