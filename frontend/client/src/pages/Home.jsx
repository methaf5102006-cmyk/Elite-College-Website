import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSections } from "../services/sectionService";

import HeroBlock from "../components/home/blocks/HeroBlock";
import FeatureHighlightsBlock from "../components/home/blocks/FeatureHighlightsBlock";
import DirectorMessageBlock from "../components/home/blocks/DirectorMessageBlock";
import WhyUsBlock from "../components/home/blocks/WhyUsBlock";
import AchievementsBlock from "../components/home/blocks/AchievementsBlock";
import QuickLinksBlock from "../components/home/blocks/QuickLinksBlock";
import CustomBlock from "../components/home/blocks/CustomBlock";

import OurDepartments from "../components/home/OurDepartments";
import NoticesSlider from "../components/home/NoticesSlider";
import StatsCounter from "../components/home/StatsCounter";

const BLOCK_MAP = {
  hero: HeroBlock,
  featureHighlights: FeatureHighlightsBlock,
  directorMessage: DirectorMessageBlock,
  whyUs: WhyUsBlock,
  achievements: AchievementsBlock,
  quickLinks: QuickLinksBlock,
  custom: CustomBlock,
  ourDepartments: OurDepartments,
  noticesSlider: NoticesSlider,
  statsCounter: StatsCounter,
};

// Hero ko turant dikhna chahiye (fade only), baaki sections scroll pe upar se aayen
const getVariant = (type) => {
  if (type === "hero") {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
    };
  }
  return {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
};

const Home = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getSections();
        setSections(data);
      } catch (err) {
        console.error("Failed to load home sections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  if (loading) return null;

  return (
    <>
      {sections.map((section, index) => {
        const Block = BLOCK_MAP[section.type];
        if (!Block) return null;

        // Hero pehla section hai — turant animate ho, baaki scroll pe
        const isHero = section.type === "hero";

        return (
          <motion.div
            key={section._id}
            initial="hidden"
            {...(isHero
              ? { animate: "visible" }
              : { whileInView: "visible", viewport: { once: true, amount: 0.2 } })}
            variants={getVariant(section.type)}
          >
            <Block content={section.content} />
          </motion.div>
        );
      })}
    </>
  );
};

export default Home;