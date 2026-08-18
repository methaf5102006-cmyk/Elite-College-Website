import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import AnimatedBackground from "./components/common/AnimatedBackground";

import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import Faculty from "./pages/Faculty";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import NewsEvents from "./pages/NewsEvents";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DepartmentDetail from "./pages/DepartmentDetail";
import CheckStatus from "./pages/CheckStatus";
import Scholarships from "./pages/Scholarships";

import ForgotPassword from "./admin/pages/ForgotPassword";
import AdminSetup from "./admin/pages/AdminSetup";
import AdminChangeAccount from "./admin/pages/AdminChangeAccount";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";

// 👇 Yahin define kar diya — koi alag file nahi chahiye
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
        <Route path="/academics" element={<AnimatedPage><Academics /></AnimatedPage>} />
        <Route path="/admissions" element={<AnimatedPage><Admissions /></AnimatedPage>} />
        <Route path="/faculty" element={<AnimatedPage><Faculty /></AnimatedPage>} />
        <Route path="/facilities" element={<AnimatedPage><Facilities /></AnimatedPage>} />
        <Route path="/gallery" element={<AnimatedPage><Gallery /></AnimatedPage>} />
        <Route path="/news" element={<AnimatedPage><NewsEvents /></AnimatedPage>} />
        <Route path="/news/:slug" element={<AnimatedPage><NewsDetail /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
        <Route path="/departments/:slug" element={<AnimatedPage><DepartmentDetail /></AnimatedPage>} />
        <Route path="/check-status" element={<AnimatedPage><CheckStatus /></AnimatedPage>} />
        <Route path="/scholarships" element={<AnimatedPage><Scholarships /></AnimatedPage>} />

        {/* Admin routes — bina page-transition animation ke, lekin background sab jagah hai */}
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin", "manager"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/change-account"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
              <AdminChangeAccount />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-center" />
          <AnimatedBackground />
          <div className="flex flex-col min-h-screen font-body transition-colors duration-300">
            <Navbar />
            <main className="grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;