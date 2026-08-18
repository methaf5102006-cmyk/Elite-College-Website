import { useEffect, useState } from "react";
import {
  FiCpu, FiWifi, FiBook, FiUserCheck, FiActivity,
  FiHeart, FiTool, FiBarChart2, FiMonitor,
} from "react-icons/fi";
import { getDepartments } from "../../services/departmentService";
import Card3D from "../common/Card3D";
import AnimatedText from "../common/AnimatedText";

const ICONS = {
  FiCpu, FiWifi, FiBook, FiUserCheck, FiActivity,
  FiHeart, FiTool, FiBarChart2, FiMonitor,
};

const OurDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading || departments.length === 0) return null;

  return (
    <section className="bg-parchment py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <AnimatedText
            as="p"
            className="font-body text-xs sm:text-sm tracking-[0.25em] uppercase text-gold-dark mb-3"
          >
            Academics
          </AnimatedText>
          <AnimatedText
            as="h2"
            className="font-display text-3xl sm:text-4xl font-semibold text-ink"
            delay={0.1}
          >
            Our Departments
          </AnimatedText>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {departments.map((dept) => {
            const Icon = ICONS[dept.icon];
            return (
              <Card3D
                key={dept.slug}
                to={`/departments/${dept.slug}`}
                className="group bg-white border border-ink/10 rounded-2xl overflow-hidden flex flex-col items-center text-center hover:border-gold/60 transition-colors duration-300"
              >
                {dept.image ? (
                  <div className="w-full h-28 sm:h-32 overflow-hidden">
                    <img
                      src={dept.image}
                      alt={dept.shortName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 mt-6 rounded-full bg-parchment flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
                    {Icon && <Icon className="text-gold-dark" size={24} />}
                  </div>
                )}

                <div className="p-4 flex flex-col items-center">
                  <AnimatedText
                    as="h3"
                    className="font-display text-sm sm:text-base font-semibold text-ink"
                  >
                    {dept.shortName}
                  </AnimatedText>

                  {dept.meritCriteria && (
                    <span className="mt-1 text-[11px] font-body text-gold-dark">
                      {dept.meritCriteria} Merit
                    </span>
                  )}
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurDepartments;