import { Routes, Route, Outlet } from 'react-router-dom'

import { Header, Footer } from './components'
import { Home, Profile, JobDetail, AddJob, Admin, Terms, PrivacyPolicy, Signin, NotFound } from './pages'
import { ForgotPassword } from './components'
import { ToastContainer } from 'react-toastify'

const Layout = () => {
  return (
    <>
      <Header />
      <div className="h-[64px]"></div>
      <main>
        <ToastContainer />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile/*" element={<Profile />} />
        <Route path="project-detail/:id" element={<JobDetail />} />
        <Route path="post-project" element={<AddJob />} />
        <Route path="admin" element={<Admin />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="signin" element={<Signin />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App