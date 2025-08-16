import { Routes, Route, Outlet } from "react-router-dom";

import { Header, Footer, ScrollToTopButton } from "./components";
import {
  Home,
  Contact,
  About,
  Profile,
  Projects,
  BrowseProfiles,
  ProjectDetail,
  AddJob,
  Admin,
  Terms,
  PrivacyPolicy,
  Signin,
  NotFound,
} from "./pages";
import { ForgotPassword } from "./components";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <ToastContainer />
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="profile/*" element={<Profile />} />
        <Route path="projects" element={<Projects />} />
        <Route path="browse-profiles" element={<BrowseProfiles />} />
        <Route path="project-detail/:id" element={<ProjectDetail />} />
        <Route path="post-project" element={<AddJob />} />
        <Route path="admin" element={<Admin />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="signin" element={<Signin />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
