import React from "react";
import Typography from "../../ui/Typography";

const ProfileBanner = ({
  title = "My Profile",
  subtitle = "Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business.",
  breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "My Profile", href: "/profile" }
  ]
}) => (
  <section
    className="relative w-full py-16 md:py-20 px-4 md:px-12 mb-8"
    style={{
      backgroundImage: "url('/assets/images/hero-background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-primary opacity-80"></div>
    {/* Content */}
    <div className="relative container mx-auto text-white px-0 md:px-8 lg:px-36 flex flex-col items-start">
      <Typography
        variant="h3"
        className="mb-2 text-white"
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        {title}
      </Typography>
      <div className="w-16 h-0.5 bg-white rounded mb-4"></div>
      <Typography
        variant="small"
        className="mb-6 text-white max-w-2xl"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
      >
        {subtitle}
      </Typography>
      <nav className="flex items-center gap-2 text-xs font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.name}>
            <Typography
              variant="span"
              className="hover:underline text-white text-xs md:text-sm"
            >
              <a href={crumb.href}>{crumb.name}</a>
            </Typography>
            {idx < breadcrumbs.length - 1 && (
              <span className="mx-2 text-white">|</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  </section>
);

export default ProfileBanner;