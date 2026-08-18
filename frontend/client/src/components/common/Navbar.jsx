import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiFacebook,
  FiInstagram,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import defaultLogo from "../../assets/images/logo.jpeg";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { getSiteSettings } from "../../services/siteSettingsService";

const DEFAULT_NAV_LINKS = [
  { label: "Home", path: "/" },
  {
    label: "About Us",
    path: "/about",
    dropdown: [{ label: "Contact Us", path: "/contact" }],
  },
  {
    label: "Academics",
    path: "/academics",
    dropdown: [
      { label: "Undergraduate Programs", path: "/academics?category=undergraduate" },
      { label: "Intermediate Programs", path: "/academics?category=intermediate" },
      { label: "Computer Courses", path: "/academics?category=computer-courses" },
      { label: "Faculty", path: "/faculty" },
    ],
  },
  {
    label: "Admission",
    path: "/admissions",
    dropdown: [{ label: "Scholarships", path: "/scholarships" }],
  },
  {
    label: "Explore EliteCollege",
    path: "/facilities",
    dropdown: [
      { label: "Facilities", path: "/facilities" },
      { label: "Gallery", path: "/gallery" },
      { label: "Events", path: "/news" },
    ],
  },
];

const DEFAULT_SETTINGS = {
  logo: "",
  collegeName: "Elite College of Management Sciences",
  tagline: "Gujranwala",
  address: "49-A, Satellite Town, Gujranwala, Punjab",
  phone: "(055) 3256655",
  email: "elite.colleges@gmail.com",
  facebookUrl: "https://www.facebook.com/share/18UbeGo3hw/",
  instagramUrl: "https://www.instagram.com/elitecolleges?igsh=MWtmajlqN3RyMnY4Zg==",
};

const LMS_URL = "https://lms.cybrixen.com/";

// Framer Motion variants — dropdown aur mobile menu ke liye
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } },
};

const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
};

const mobileSubmenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.25 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const { admin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const adminPath = admin ? "/admin/dashboard" : "/admin/login";

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [navLinks, setNavLinks] = useState(DEFAULT_NAV_LINKS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings({
          logo: data.logo || "",
          collegeName: data.collegeName || DEFAULT_SETTINGS.collegeName,
          tagline: data.tagline || DEFAULT_SETTINGS.tagline,
          address: data.address || DEFAULT_SETTINGS.address,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          email: data.email || DEFAULT_SETTINGS.email,
          facebookUrl: data.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
          instagramUrl: data.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
        });
        if (data.navLinks && data.navLinks.length > 0) {
          setNavLinks(data.navLinks);
        }
      } catch (err) {
        // Silently keep defaults if settings can't be fetched
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleDropdownEnter = (label) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const linkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold tracking-wide transition-colors duration-200 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold-dark/50 focus-visible:ring-offset-2 ${
      isActive ? "text-gold-dark" : "text-ink hover:text-gold-dark"
    }`;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white shadow-sm"
    >
      <div className="hidden md:block bg-parchment border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs text-slate">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <FiMapPin size={13} className="text-gold-dark" />
              {settings.address}
            </span>
            <span className="flex items-center gap-1.5">
              <FiPhone size={13} className="text-gold-dark" />
              {settings.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMail size={13} className="text-gold-dark" />
              {settings.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 flex items-center justify-center rounded-full border border-slate/30 text-slate hover:text-gold-dark hover:border-gold-dark transition-colors"
              >
                <FiFacebook size={13} />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 flex items-center justify-center rounded-full border border-slate/30 text-slate hover:text-gold-dark hover:border-gold-dark transition-colors"
              >
                <FiInstagram size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      <nav ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <NavLink to="/" className="flex items-center shrink-0 focus:outline-none">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              src={settings.logo || defaultLogo}
              alt={`${settings.collegeName} logo`}
              className="h-16 w-auto md:h-20 object-contain"
            />
          </NavLink>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.dropdown?.length > 0 && handleDropdownEnter(link.label)}
                onMouseLeave={() => link.dropdown?.length > 0 && handleDropdownLeave()}
              >
                <div className="flex items-center gap-1">
                  <NavLink to={link.path} end={link.path === "/"} className={linkClass}>
                    {link.label}
                  </NavLink>

                  {link.dropdown?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setOpenDropdown((prev) => (prev === link.label ? null : link.label))}
                      aria-label={`Toggle ${link.label} menu`}
                      aria-expanded={openDropdown === link.label}
                      className="text-ink hover:text-gold-dark transition-colors"
                    >
                      <motion.span
                        animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex"
                      >
                        <FiChevronDown size={15} />
                      </motion.span>
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {link.dropdown?.length > 0 && openDropdown === link.label && (
                    <motion.div
                      onMouseEnter={() => handleDropdownEnter(link.label)}
                      onMouseLeave={handleDropdownLeave}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute left-1/2 -translate-x-1/2 pt-3 w-56 origin-top"
                    >
                      <div className="bg-white rounded-xl shadow-lg border border-ink/5 py-2">
                        {link.dropdown.map((item) => (
                          <NavLink
                            key={item.label}
                            to={item.path}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2.5 text-sm text-slate hover:text-ink hover:bg-parchment rounded-lg mx-1 transition-colors duration-150"
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href={LMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-ink text-parchment text-sm font-semibold tracking-wide hover:bg-ink-light transition-colors duration-200"
            >
              EliteCollege LMS
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-parchment transition-colors duration-200"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <NavLink
                to={adminPath}
                className="inline-flex items-center justify-center gap-1.5 w-10 h-10 rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-parchment transition-colors duration-200"
                aria-label="Admin"
                title="Admin"
              >
                <FiUser size={16} />
              </NavLink>
            </motion.div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="lg:hidden p-2 text-ink"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="lg:hidden overflow-hidden border-t border-ink/10"
          >
            <div className="flex flex-col px-4 sm:px-6 py-4 gap-1 bg-white overflow-y-auto max-h-[32rem]">
              {navLinks.map((link) => (
                <div key={link.path} className="border-b border-ink/5">
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={link.path}
                      end={link.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex-1 px-3 py-3 text-base font-medium ${isActive ? "text-gold-dark" : "text-ink"}`
                      }
                    >
                      {link.label}
                    </NavLink>

                    {link.dropdown?.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileDropdown((prev) => (prev === link.label ? null : link.label))
                        }
                        aria-label={`Toggle ${link.label} submenu`}
                        aria-expanded={openMobileDropdown === link.label}
                        className="p-3 text-slate"
                      >
                        <motion.span
                          animate={{ rotate: openMobileDropdown === link.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex"
                        >
                          <FiChevronDown size={18} />
                        </motion.span>
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {link.dropdown?.length > 0 && openMobileDropdown === link.label && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={mobileSubmenuVariants}
                        className="overflow-hidden pb-2"
                      >
                        {link.dropdown.map((item) => (
                          <NavLink
                            key={item.label}
                            to={item.path}
                            onClick={() => {
                              setIsOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                            className="block pl-8 pr-3 py-2 text-sm text-slate hover:text-ink"
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <a
                href={LMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-flex items-center justify-center px-6 py-3 rounded-full bg-ink text-parchment text-sm font-semibold tracking-wide"
              >
                EliteCollege LMS
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-sm font-semibold tracking-wide"
              >
                {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>

              <NavLink
                to={adminPath}
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-sm font-semibold tracking-wide"
              >
                <FiUser size={15} />
                {admin ? "Admin Dashboard" : "Admin Login"}
              </NavLink>

              <div className="mt-4 pt-4 border-t border-ink/10 flex flex-col gap-2 text-xs text-slate">
                <span className="flex items-center gap-2">
                  <FiMapPin size={13} className="text-gold-dark shrink-0" />
                  {settings.address}
                </span>
                <span className="flex items-center gap-2">
                  <FiPhone size={13} className="text-gold-dark shrink-0" />
                  {settings.phone}
                </span>
                <span className="flex items-center gap-2">
                  <FiMail size={13} className="text-gold-dark shrink-0" />
                  {settings.email}
                </span>

                <div className="flex items-center gap-3 mt-2">
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-slate/30 text-slate"
                    >
                      <FiFacebook size={14} />
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-slate/30 text-slate"
                    >
                      <FiInstagram size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;