import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiInstagram,
} from "react-icons/fi";
import { getSiteSettings } from "../../services/siteSettingsService";

const DEFAULT_QUICK_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "Academics", path: "/academics" },
  { label: "Admissions", path: "/admissions" },
  { label: "Faculty", path: "/faculty" },
  { label: "Facilities", path: "/facilities" },
];

const DEFAULT_RESOURCES = [
  { label: "Gallery", path: "/gallery" },
  { label: "News & Events", path: "/news" },
  { label: "Contact Us", path: "/contact" },
];

const DEFAULT_SETTINGS = {
  collegeName: "Elite College of Management Sciences",
  address: "49-A, Satellite Town, Gujranwala, Punjab, Pakistan",
  phone: "(055) 3256655",
  email: "elite.colleges@gmail.com",
  facebookUrl: "https://www.facebook.com/share/18UbeGo3hw/",
  instagramUrl: "https://www.instagram.com/elitecolleges?igsh=MWtmajlqN3RyMnY4Zg==",
  footerBlurb: "A Group serving since 1988 in the field of education.",
  copyrightText: "EliteCollege. All rights reserved.",
};

const Footer = () => {
  const year = new Date().getFullYear();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [quickLinks, setQuickLinks] = useState(DEFAULT_QUICK_LINKS);
  const [resources, setResources] = useState(DEFAULT_RESOURCES);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings({
          collegeName: data.collegeName || DEFAULT_SETTINGS.collegeName,
          address: data.address || DEFAULT_SETTINGS.address,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          email: data.email || DEFAULT_SETTINGS.email,
          facebookUrl: data.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
          instagramUrl: data.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
          footerBlurb: data.footerBlurb || DEFAULT_SETTINGS.footerBlurb,
          copyrightText: data.copyrightText || DEFAULT_SETTINGS.copyrightText,
        });
        if (data.footerQuickLinks && data.footerQuickLinks.length > 0) {
          setQuickLinks(data.footerQuickLinks);
        }
        if (data.footerResources && data.footerResources.length > 0) {
          setResources(data.footerResources);
        }
      } catch (err) {
        // Silently keep defaults if settings can't be fetched
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-ink text-parchment/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand + blurb */}
          <div className="lg:col-span-1">
            <span className="font-display text-2xl font-semibold text-parchment">
              Elite<span className="text-gold">College</span>
            </span>

            <p className="mt-4 text-sm leading-relaxed text-parchment/60">
              {settings.footerBlurb}
            </p>

            <div className="flex items-center gap-4 mt-5">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-parchment/60 hover:text-gold transition-colors"
                >
                  <FiFacebook size={18} />
                </a>
              )}

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-parchment/60 hover:text-gold transition-colors"
                >
                  <FiInstagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base text-parchment mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-sm text-parchment/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-base text-parchment mb-4">
              Resources
            </h3>

            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-sm text-parchment/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-base text-parchment mb-4">
              Get in Touch
            </h3>

            <ul className="space-y-3 text-sm text-parchment/60">
              <li className="flex items-start gap-3">
                <FiMapPin
                  className="shrink-0 mt-0.5 text-gold"
                  size={16}
                />
                <span>{settings.address}</span>
              </li>

              <li className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-gold" size={16} />
                <span>{settings.phone}</span>
              </li>

              <li className="flex items-center gap-3">
                <FiMail className="shrink-0 text-gold" size={16} />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-gold transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-parchment/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-parchment/50">
          <p>© {year} {settings.copyrightText}</p>

          <div className="flex items-center gap-4">
            <p>
              Developed by{" "}
              <a
                href="https://www.linkedin.com/in/fiza-liaqat-6259563a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Fiza Liaqat
              </a>{" "}
              &middot;{" "}
              <a
                href="mailto:liaqatfiza9@gmail.com"
                className="hover:text-gold transition-colors"
              >
                liaqatfiza9@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;