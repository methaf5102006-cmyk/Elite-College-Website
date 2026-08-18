export const COMPUTER_COURSES = [
  {
    slug: "cyber-security",
    title: "Cyber Security",
    icon: "FiShield",
    duration: "3 Months",
    description:
      "Learn the fundamentals of network security, ethical hacking, and threat prevention. Covers security tools, vulnerability assessment, and safe practices for protecting systems and data.",
    topics: [
      "Networking & Security Basics",
      "Ethical Hacking Fundamentals",
      "Malware & Threat Analysis",
      "Security Tools & Firewalls",
      "Practical Labs & Case Studies",
    ],
  },
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    icon: "FiPenTool",
    duration: "3 Months",
    description:
      "Master visual design using industry-standard tools. Learn branding, layout design, typography, and create professional graphics for print and digital media.",
    topics: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Canva & Digital Design",
      "Branding & Logo Design",
      "Portfolio Project",
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    icon: "FiCode",
    duration: "4 Months",
    description:
      "Build modern, responsive websites from scratch. Covers front-end fundamentals and an introduction to interactive web application development.",
    topics: [
      "HTML5 & CSS3",
      "JavaScript Fundamentals",
      "Responsive Web Design",
      "Introduction to React",
      "Live Project Deployment",
    ],
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    icon: "FiLayout",
    duration: "2 Months",
    description:
      "Learn to design and manage professional websites using WordPress — from installation and themes to plugins and page builders like Elementor.",
    topics: [
      "WordPress Setup & Hosting",
      "Themes & Customization",
      "Elementor Page Builder",
      "Plugins & SEO Basics",
      "E-commerce with WooCommerce",
    ],
  },
  {
    slug: "microsoft-office",
    title: "Microsoft Office",
    icon: "FiFileText",
    duration: "6 Weeks",
    description:
      "Gain practical skills in the most widely used office productivity tools — essential for academic, administrative, and corporate work.",
    topics: [
      "MS Word (Documents & Formatting)",
      "MS Excel (Formulas & Spreadsheets)",
      "MS PowerPoint (Presentations)",
      "Basic Data Entry Skills",
    ],
  },
  {
    slug: "spoken-english",
    title: "Spoken English",
    icon: "FiMessageCircle",
    duration: "3 Months",
    description:
      "Build fluency and confidence in spoken English through grammar practice, conversation exercises, and real-life communication scenarios.",
    topics: [
      "Grammar Foundations",
      "Vocabulary Building",
      "Conversation Practice",
      "Public Speaking & Confidence",
      "Interview Preparation",
    ],
  },
];

export const getCourseBySlug = (slug) =>
  COMPUTER_COURSES.find((course) => course.slug === slug);