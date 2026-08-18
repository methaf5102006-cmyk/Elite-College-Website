// backend/seed.js
//
// IMPORTANT: Admin creation has been REMOVED from this file on purpose.
// The system now allows only ONE admin, created exclusively through the
// OTP-based /admin/setup flow. Do NOT add User.create() back here.
//
// Usage:  node seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const Department = require('./models/Department.model');
const Course = require('./models/Course.model');
const ShortCourse = require('./models/ShortCourse.model');

// ---------------------------------------------------------------------------
// NOTE: Adjust the env variable name below if your DB connection string is
// stored under a different key in your .env file (e.g. MONGODB_URI).
// ---------------------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// ---------------------------------------------------------------------------
// DEPARTMENTS DATA (from frontend/src/data/departments.js)
// ---------------------------------------------------------------------------
const DEPARTMENTS = [
  {
    slug: 'computer-science',
    name: 'BS Computer Science',
    shortName: 'Computer Science',
    icon: 'FiCpu',
    category: 'undergraduate',
    affiliation: 'Affiliated with Government College University Faisalabad (GCUF)',
    tagline:
      'The BS Computer Science (BSCS) is a 4-year undergraduate degree designed to equip students with strong foundations in programming, software development, data management, and emerging technologies. This program blends theoretical knowledge with practical skills, preparing graduates to solve real-world problems through computing and innovation.',
    objectives: [
      'To develop expertise in programming, algorithms, and software engineering.',
      'To prepare students for careers in IT, software development, and research.',
      'To introduce modern technologies such as Artificial Intelligence, Data Science, and Cybersecurity.',
      'To enhance problem-solving, analytical thinking, and project management skills.',
    ],
    coreAreas: [
      'Programming Fundamentals & Advanced Programming',
      'Data Structures & Algorithms',
      'Software Engineering',
      'Database Systems',
      'Operating Systems & Computer Networks',
      'Artificial Intelligence & Machine Learning',
      'Web & Mobile Application Development',
      'Cybersecurity & Information Assurance',
      'Cloud Computing & Big Data',
      'Final Year Project (FYP)',
    ],
    whyChoose: [
      'One of the most in-demand degrees in Pakistan and worldwide.',
      'Builds versatile skills for multiple industries, from tech startups to multinational companies.',
      'Hands-on projects, coding labs, and internships to boost employability.',
      'A strong foundation for higher studies (MS/MPhil/PhD) in Computer Science and IT-related fields.',
    ],
    careers: [
      'Software Engineer / Developer',
      'Web & Mobile App Developer',
      'Data Scientist / Data Analyst',
      'AI / Machine Learning Engineer',
      'Cybersecurity Specialist',
      'Cloud Computing Engineer',
      'Systems Analyst / IT Consultant',
      'Database Administrator',
      'Researcher or Academic',
    ],
    furtherPathways: [
      'PhD in Computer Science or related fields',
      'MS / MPhil in Computer Science, AI, Data Science, or IT',
      'Specialized Diplomas in Cloud Computing, Cybersecurity, or Game Development',
    ],
    eligibility: ['Minimum Intermediate qualification required.', 'Minimum Marks: 50%'],
    duration: '4 Years',
    courses: [
      'Introduction to Programming',
      'Object Oriented Programming',
      'Data Structures & Algorithms',
      'Database Systems',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
      'Artificial Intelligence',
      'Web Technologies',
      'Mobile App Development',
      'Information Security',
      'Final Year Project',
    ],
  },
  {
    slug: 'information-technology',
    name: 'BS Information Technology',
    shortName: 'Information Technology',
    icon: 'FiWifi',
    category: 'undergraduate',
    affiliation: 'Affiliated with Government College University Faisalabad (GCUF)',
    tagline:
      'The BS Information Technology (BSIT) program is a 4-year degree focused on the practical application of computing and networking technologies to solve organizational and business problems. Students gain hands-on expertise in networks, systems administration, and enterprise software solutions.',
    objectives: [
      'To build strong technical skills in networking, systems, and IT infrastructure.',
      'To prepare graduates for roles in IT support, administration, and enterprise systems.',
      'To develop practical knowledge of modern IT tools and platforms.',
      'To strengthen troubleshooting, deployment, and project management abilities.',
    ],
    coreAreas: [
      'Programming Fundamentals',
      'Computer Networks & Network Security',
      'System & Network Administration',
      'Database Management Systems',
      'Web Development & Content Management',
      'Cloud & Virtualization Technologies',
      'IT Project Management',
      'Information Security',
      'Enterprise Systems',
      'Final Year Project (FYP)',
    ],
    whyChoose: [
      'Strong industry demand for skilled IT professionals across all sectors.',
      'Practical, hands-on labs covering networking, servers, and cloud platforms.',
      'Direct pathway into corporate IT departments and managed service providers.',
      'Solid foundation for professional IT certifications (CCNA, CompTIA, AWS, etc.).',
    ],
    careers: [
      'IT Support Specialist',
      'Network Administrator',
      'Systems Administrator',
      'Cloud Support Engineer',
      'IT Project Coordinator',
      'Web Administrator',
      'Technical Consultant',
      'Help Desk Manager',
    ],
    furtherPathways: [
      'MS in Information Technology or Computer Science',
      'Professional certifications: CCNA, CompTIA Network+/Security+, AWS/Azure',
      'MBA with IT/Technology Management specialization',
    ],
    eligibility: ['Minimum Intermediate qualification required.', 'Minimum Marks: 50%'],
    duration: '4 Years',
    courses: [
      'Introduction to Information Technology',
      'Programming Fundamentals',
      'Computer Networks',
      'Database Systems',
      'Web Technologies',
      'Network Security',
      'System Administration',
      'Cloud Computing',
      'IT Project Management',
      'Final Year Project',
    ],
  },
  {
    slug: 'english',
    name: 'BA English',
    shortName: 'English',
    icon: 'FiBook',
    category: 'undergraduate',
    affiliation: 'Affiliated with Government College University Faisalabad (GCUF)',
    tagline:
      'The BA English program develops strong command over the English language along with a deep understanding of literature, linguistics, and communication. It prepares students for careers in teaching, media, publishing, research, and the corporate sector.',
    objectives: [
      'To build advanced proficiency in written and spoken English.',
      'To develop critical understanding of English literature across eras and genres.',
      'To strengthen skills in linguistics, research, and academic writing.',
      'To prepare students for careers in education, media, and communication.',
    ],
    coreAreas: [
      'English Literature (Prose, Poetry & Drama)',
      'Linguistics & Phonetics',
      'Academic & Creative Writing',
      'Communication Skills',
      'Literary Criticism & Theory',
      'Translation Studies',
      'Research Methodology',
      'Final Year Project / Thesis',
    ],
    whyChoose: [
      'Strengthens command over English — essential across almost every career field.',
      'Opens doors to teaching, journalism, publishing, and content-based industries.',
      'Develops strong analytical, communication, and writing skills.',
      'Solid foundation for competitive exams (CSS/PMS) and higher studies.',
    ],
    careers: [
      'English Language Teacher / Lecturer',
      'Content Writer / Editor',
      'Journalist / Media Professional',
      'Translator',
      'Public Relations Officer',
      'Research Assistant',
      'Civil Services (CSS/PMS) candidate',
    ],
    furtherPathways: [
      'MPhil / PhD in English Literature or Linguistics',
      'M.Ed for teaching specialization',
      'Professional courses in Journalism, Mass Communication, or Public Relations',
    ],
    eligibility: ['Minimum Intermediate qualification required.', 'Minimum Marks: 45%'],
    duration: '4 Years',
    courses: [
      'Introduction to English Literature',
      'Poetry',
      'Drama',
      'Prose',
      'Linguistics',
      'Academic Writing',
      'Literary Criticism',
      'Translation Studies',
      'Research Methodology',
      'Thesis / Final Project',
    ],
  },
  {
    slug: 'dpt',
    name: 'Doctor of Physical Therapy (DPT)',
    shortName: 'DPT',
    icon: 'FiUserCheck',
    category: 'undergraduate',
    affiliation: 'Affiliated with Government College University Faisalabad (GCUF)',
    tagline:
      'The Doctor of Physical Therapy (DPT) is a professional degree that prepares students to assess, diagnose, and treat movement disorders and physical impairments. The program combines medical sciences with clinical rehabilitation practice to produce skilled physical therapists.',
    objectives: [
      'To build a strong foundation in human anatomy, physiology, and biomechanics.',
      'To develop clinical skills in assessment, diagnosis, and rehabilitation techniques.',
      'To prepare students for licensed practice as physical therapists.',
      'To instill professional ethics and patient-care standards in clinical practice.',
    ],
    coreAreas: [
      'Human Anatomy & Physiology',
      'Biomechanics & Kinesiology',
      'Musculoskeletal Rehabilitation',
      'Neurological Rehabilitation',
      'Cardiopulmonary Physiotherapy',
      'Sports Physiotherapy',
      'Pediatric & Geriatric Physiotherapy',
      'Clinical Practice & Internship',
      'Research Methodology / Thesis',
    ],
    whyChoose: [
      'Growing demand for licensed physical therapists in hospitals and rehab centers.',
      'Hands-on clinical training and supervised internships.',
      'Vital role in patient recovery, injury prevention, and quality of life.',
      'Strong opportunities in public/private hospitals, sports teams, and private practice.',
    ],
    careers: [
      'Physical Therapist / Physiotherapist',
      'Sports Rehabilitation Specialist',
      'Clinical Physiotherapist (Hospital)',
      'Pediatric / Geriatric Physiotherapist',
      'Private Practice Consultant',
      'Rehabilitation Center Manager',
    ],
    furtherPathways: [
      'MS / MPhil in Physical Therapy or Rehabilitation Sciences',
      'PhD in Physical Therapy',
      'Specialized certifications in Sports or Neuro Physiotherapy',
    ],
    eligibility: [
      'Minimum Intermediate (FSc Pre-Medical) qualification required.',
      'Minimum Marks: 60%',
    ],
    duration: '5 Years',
    courses: [
      'Human Anatomy',
      'Human Physiology',
      'Biomechanics',
      'Kinesiology',
      'Musculoskeletal Physiotherapy',
      'Neurological Physiotherapy',
      'Cardiopulmonary Physiotherapy',
      'Sports Physiotherapy',
      'Clinical Internship',
      'Research Thesis',
    ],
  },
  {
    slug: 'mlt',
    name: 'BS Medical Laboratory Technology (MLT)',
    shortName: 'MLT',
    icon: 'FiActivity',
    category: 'undergraduate',
    affiliation: 'Affiliated with Government College University Faisalabad (GCUF)',
    tagline:
      'The BS Medical Laboratory Technology (MLT) program trains students in clinical diagnostic techniques, laboratory sciences, and medical testing procedures. Graduates play a vital role in disease diagnosis, research, and healthcare systems.',
    objectives: [
      'To develop technical expertise in clinical laboratory procedures.',
      'To build strong understanding of diagnostic sciences and pathology.',
      'To prepare students for roles in hospitals, labs, and research institutions.',
      'To instill professional and ethical standards in healthcare practice.',
    ],
    coreAreas: [
      'Clinical Chemistry',
      'Hematology',
      'Microbiology & Parasitology',
      'Histopathology',
      'Immunology & Serology',
      'Blood Banking & Transfusion Science',
      'Molecular Diagnostics',
      'Laboratory Management',
      'Clinical Internship / FYP',
    ],
    whyChoose: [
      'Growing demand for skilled lab technologists in hospitals and diagnostic centers.',
      'Hands-on laboratory training with modern diagnostic equipment.',
      'Vital role in healthcare and disease prevention.',
      'Strong opportunities in both public and private healthcare sectors.',
    ],
    careers: [
      'Medical Laboratory Technologist',
      'Clinical Lab Supervisor',
      'Pathology Lab Technician',
      'Blood Bank Technologist',
      'Research Lab Assistant',
      'Quality Control Officer (Healthcare/Pharma)',
    ],
    furtherPathways: [
      'MS / MPhil in Medical Laboratory Sciences',
      'Specialized diplomas in Molecular Diagnostics or Histopathology',
      'PhD in Biomedical / Laboratory Sciences',
    ],
    eligibility: [
      'Minimum Intermediate (FSc Pre-Medical) qualification required.',
      'Minimum Marks: 50%',
    ],
    duration: '4 Years',
    courses: [
      'Human Anatomy & Physiology',
      'Clinical Chemistry',
      'Hematology',
      'Microbiology',
      'Histopathology',
      'Immunology',
      'Blood Banking',
      'Molecular Diagnostics',
      'Laboratory Management',
      'Clinical Internship',
    ],
  },
  {
    slug: 'fsc-pre-medical',
    name: 'FSc Pre-Medical',
    shortName: 'FSc Pre-Medical',
    icon: 'FiHeart',
    category: 'intermediate',
    affiliation: 'Affiliated with Gujranwala Board (BISE)',
    tagline:
      'FSc Pre-Medical is a 2-year intermediate program designed for students aiming to pursue careers in medicine, dentistry, pharmacy, and allied health sciences. It builds a strong foundation in Biology, Chemistry, and Physics.',
    objectives: [
      'To build a strong conceptual foundation in Biology, Chemistry, and Physics.',
      'To prepare students for medical and health-sciences entry tests (MDCAT).',
      'To develop scientific reasoning and laboratory skills.',
      'To lay the groundwork for professional degrees like MBBS, BDS, and Pharm-D.',
    ],
    coreAreas: ['Biology', 'Chemistry', 'Physics', 'English', 'Practical Laboratory Work'],
    whyChoose: [
      'Direct pathway to MBBS, BDS, Pharm-D, and allied health science degrees.',
      'Experienced faculty with focused MDCAT preparation support.',
      'Well-equipped science laboratories for practical learning.',
      'Strong academic environment for board and entry-test success.',
    ],
    careers: [
      'Pathway to MBBS (Doctor)',
      'Pathway to BDS (Dentist)',
      'Pathway to Pharm-D (Pharmacist)',
      'Pathway to Allied Health Sciences (Nursing, MLT, DPT, etc.)',
    ],
    furtherPathways: ['MBBS / BDS via MDCAT', 'Pharm-D', 'BS programs in Biological or Health Sciences'],
    eligibility: ['Minimum Matriculation (Science Group) required.', 'Minimum Marks: 60%'],
    duration: '2 Years',
    courses: ['Biology I & II', 'Chemistry I & II', 'Physics I & II', 'English I & II', 'Practical Labs'],
  },
  {
    slug: 'pre-engineering',
    name: 'FSc Pre-Engineering',
    shortName: 'Pre-Engineering',
    icon: 'FiTool',
    category: 'intermediate',
    affiliation: 'Affiliated with Gujranwala Board (BISE)',
    tagline:
      'FSc Pre-Engineering is a 2-year intermediate program built around Mathematics, Physics, and Chemistry, preparing students for engineering entry tests and university admissions in all engineering disciplines.',
    objectives: [
      'To build strong fundamentals in Mathematics, Physics, and Chemistry.',
      'To prepare students for engineering entrance tests (ECAT/NUST/university tests).',
      'To develop analytical and problem-solving skills for technical fields.',
      'To lay the groundwork for professional engineering degrees.',
    ],
    coreAreas: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Practical Laboratory Work'],
    whyChoose: [
      'Direct pathway to all engineering disciplines (Civil, Electrical, Mechanical, etc.).',
      'Focused preparation for ECAT and other engineering entry tests.',
      'Strong faculty support in Mathematics and Physics.',
      'Well-equipped labs for practical concept building.',
    ],
    careers: [
      'Pathway to BE/BSc Engineering (Civil, Electrical, Mechanical, etc.)',
      'Pathway to BS Software / Computer Engineering',
      'Pathway to Architecture and related technical degrees',
    ],
    furtherPathways: [
      'BSc / BE Engineering via ECAT or NTS-based entry tests',
      'BS Computer Science / Software Engineering',
      'Architecture and Technology degrees',
    ],
    eligibility: ['Minimum Matriculation (Science Group) required.', 'Minimum Marks: 60%'],
    duration: '2 Years',
    courses: ['Mathematics I & II', 'Physics I & II', 'Chemistry I & II', 'English I & II', 'Practical Labs'],
  },
  {
    slug: 'ics',
    name: 'ICS (Physics / Statistics)',
    shortName: 'ICS (Physics/Stats)',
    icon: 'FiBarChart2',
    category: 'intermediate',
    affiliation: 'Affiliated with Gujranwala Board (BISE)',
    tagline:
      'Intermediate in Computer Science (ICS) with Physics or Statistics combines core computing concepts with strong mathematical and analytical foundations, preparing students for degrees in Computer Science, Software Engineering, Data Science, and Statistics.',
    objectives: [
      'To introduce foundational computer science and programming concepts.',
      'To build strong analytical skills through Physics or Statistics.',
      'To prepare students for BS programs in Computer Science, IT, and Data Science.',
      'To develop logical reasoning and computational thinking.',
    ],
    coreAreas: [
      'Computer Science / Programming Fundamentals',
      'Physics or Statistics (elective track)',
      'Mathematics',
      'English',
      'Practical Computer Labs',
    ],
    whyChoose: [
      'Strong foundation for BS Computer Science, Software Engineering, and Data Science.',
      'Hands-on computer labs alongside core science subjects.',
      'Flexible track — choose Physics or Statistics based on interest.',
      'Ideal for students aiming for tech-focused careers.',
    ],
    careers: [
      'Pathway to BS Computer Science / Information Technology',
      'Pathway to BS Software Engineering',
      'Pathway to BS Statistics / Data Science',
    ],
    furtherPathways: [
      'BS Computer Science, IT, or Software Engineering',
      'BS Statistics or Data Science',
      'BS Mathematics or Physics',
    ],
    eligibility: ['Minimum Matriculation qualification required.', 'Minimum Marks: 60%'],
    duration: '2 Years',
    courses: [
      'Computer Science I & II',
      'Physics I & II / Statistics I & II',
      'Mathematics I & II',
      'English I & II',
      'Practical Computer Labs',
    ],
  },
  {
    slug: 'dit',
    name: 'DIT (Diploma in Information Technology)',
    shortName: 'DIT',
    icon: 'FiMonitor',
    category: 'intermediate',
    affiliation: 'Affiliated with Gujranwala Board (BISE)',
    tagline:
      'The Diploma in Information Technology (DIT) is a short-term, skill-focused program designed to equip students with practical IT skills including computer applications, basic programming, and networking — ideal for quick entry into the job market.',
    objectives: [
      'To provide practical, job-ready IT skills in a short timeframe.',
      'To build proficiency in computer applications and basic programming.',
      'To introduce networking and troubleshooting fundamentals.',
      'To prepare students for entry-level IT positions or further study.',
    ],
    coreAreas: [
      'Computer Fundamentals & Applications (MS Office, etc.)',
      'Basic Programming Concepts',
      'Internet & Web Basics',
      'Networking Fundamentals',
      'Hardware & Troubleshooting Basics',
    ],
    whyChoose: [
      'Short duration with immediate practical, job-ready skills.',
      'Affordable pathway into the IT field for students and working professionals.',
      'Hands-on computer lab sessions.',
      'Good stepping stone toward further IT studies (BS IT / BSCS) or employment.',
    ],
    careers: [
      'Computer Operator',
      'Office Assistant (IT-based roles)',
      'Junior IT Support Staff',
      'Data Entry Operator',
    ],
    furtherPathways: [
      'BS Information Technology or Computer Science',
      'Advanced diplomas/certifications in networking or programming',
    ],
    eligibility: ['Minimum Matriculation qualification required.', 'Minimum Marks: 60%'],
    duration: '6 Months – 1 Year',
    courses: [
      'Computer Fundamentals',
      'MS Office Applications',
      'Basic Programming',
      'Internet & Email',
      'Networking Basics',
      'Hardware Troubleshooting',
    ],
  },
];

// ---------------------------------------------------------------------------
// COMPUTER_COURSES DATA (from frontend/src/data/courses.js) -> ShortCourse
// ---------------------------------------------------------------------------
const COMPUTER_COURSES = [
  {
    slug: 'cyber-security',
    title: 'Cyber Security',
    icon: 'FiShield',
    duration: '3 Months',
    description:
      'Learn the fundamentals of network security, ethical hacking, and threat prevention. Covers security tools, vulnerability assessment, and safe practices for protecting systems and data.',
    topics: [
      'Networking & Security Basics',
      'Ethical Hacking Fundamentals',
      'Malware & Threat Analysis',
      'Security Tools & Firewalls',
      'Practical Labs & Case Studies',
    ],
  },
  {
    slug: 'graphic-designing',
    title: 'Graphic Designing',
    icon: 'FiPenTool',
    duration: '3 Months',
    description:
      'Master visual design using industry-standard tools. Learn branding, layout design, typography, and create professional graphics for print and digital media.',
    topics: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva & Digital Design', 'Branding & Logo Design', 'Portfolio Project'],
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    icon: 'FiCode',
    duration: '4 Months',
    description:
      'Build modern, responsive websites from scratch. Covers front-end fundamentals and an introduction to interactive web application development.',
    topics: ['HTML5 & CSS3', 'JavaScript Fundamentals', 'Responsive Web Design', 'Introduction to React', 'Live Project Deployment'],
  },
  {
    slug: 'wordpress-development',
    title: 'WordPress Development',
    icon: 'FiLayout',
    duration: '2 Months',
    description:
      'Learn to design and manage professional websites using WordPress — from installation and themes to plugins and page builders like Elementor.',
    topics: ['WordPress Setup & Hosting', 'Themes & Customization', 'Elementor Page Builder', 'Plugins & SEO Basics', 'E-commerce with WooCommerce'],
  },
  {
    slug: 'microsoft-office',
    title: 'Microsoft Office',
    icon: 'FiFileText',
    duration: '6 Weeks',
    description:
      'Gain practical skills in the most widely used office productivity tools — essential for academic, administrative, and corporate work.',
    topics: ['MS Word (Documents & Formatting)', 'MS Excel (Formulas & Spreadsheets)', 'MS PowerPoint (Presentations)', 'Basic Data Entry Skills'],
  },
  {
    slug: 'spoken-english',
    title: 'Spoken English',
    icon: 'FiMessageCircle',
    duration: '3 Months',
    description:
      'Build fluency and confidence in spoken English through grammar practice, conversation exercises, and real-life communication scenarios.',
    topics: ['Grammar Foundations', 'Vocabulary Building', 'Conversation Practice', 'Public Speaking & Confidence', 'Interview Preparation'],
  },
];

// ---------------------------------------------------------------------------
// SEED LOGIC
// ---------------------------------------------------------------------------
const seedData = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        'MongoDB connection string not found. Set MONGO_URI (or MONGODB_URI) in your .env file.'
      );
    }

    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing academic data (does NOT touch Users/Admin — that flow is untouched)
    await Department.deleteMany();
    await Course.deleteMany();
    await ShortCourse.deleteMany();
    console.log('Old Department, Course, and ShortCourse data cleared.');

    for (const deptData of DEPARTMENTS) {
      const { courses: courseNames, ...departmentFields } = deptData;

      const department = await Department.create(departmentFields);
      console.log(`Created department: ${department.name}`);

      const courseDocs = courseNames.map((courseName) => ({
        courseName,
        department: department._id,
        duration: department.duration,
        eligibility: Array.isArray(department.eligibility)
          ? department.eligibility.join(' ')
          : '',
        description: '',
      }));

      if (courseDocs.length > 0) {
        await Course.insertMany(courseDocs);
        console.log(`  -> Seeded ${courseDocs.length} courses for ${department.name}`);
      }
    }

    await ShortCourse.insertMany(COMPUTER_COURSES);
    console.log(`Seeded ${COMPUTER_COURSES.length} short courses.`);

    console.log('✅ Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();