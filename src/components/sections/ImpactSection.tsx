import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, MapPin, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import communityImage from "@/assets/community-activity.jpg";
import { api } from "@/lib/api";
interface Impact {
  id: string;
  title: string;
  description: string;
  img: string;
  actions_keypoints: string | string[];
  createdAt: string;
  updatedAt: string;
}

const parseActionKeypoints = (keypoints: string | string[]): string[] => {
  if (!keypoints) return [];
  let rawPoints: string[] = [];
  if (Array.isArray(keypoints)) {
    if (keypoints.length === 1 && (keypoints[0].includes('","') || keypoints[0].includes('\",\"'))) {
      rawPoints = keypoints[0].split(/["'],["']|\\",\\"/g);
    } else {
      rawPoints = keypoints;
    }
  } else if (typeof keypoints === 'string') {
    if (keypoints.includes('","') || keypoints.includes('\",\"')) {
      rawPoints = keypoints.split(/["'],["']|\\",\\"/g);
    } else {
      rawPoints = keypoints.split(',').map(p => p.trim());
    }
  }
  return rawPoints.map(p => p.trim().replace(/^["']|["']$/g, '').replace(/^\\"|\\"$/g, '').trim()).filter(p => p && p !== "");
};

const stats = [
  { icon: Users, number: 40, suffix: "+", label: "Children Helped", duration: 2000 },
  { icon: GraduationCap, number: 75, suffix: "+", label: "Weekly Participants", duration: 2200 },
  { icon: MapPin, number: 4, suffix: "", label: "Districts Served", duration: 1800 },
  { icon: Calendar, number: 3, suffix: "+", label: "Years of Impact", duration: 1600 },
];

const achievements = [
  "Conducted door-to-door family visits to assess needs",
  "Provided food, clothing, and school materials",
  "Supported health insurance enrollment for children",
  "Delivered weekly educational and life-skills workshops",
  "Organized annual celebrations for joy and belonging",
];

const AnimatedNumber = ({ target, duration, suffix }: { target: number; duration: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const ImpactSection = () => {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [allKeypoints, setAllKeypoints] = useState<string[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        const response = await api.get('/impact/getAll');
        const data = response.data;
        const impactsList = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
        setImpacts(impactsList);

        const allPoints: string[] = [];
        impactsList.forEach((impact: Impact) => {
          const points = parseActionKeypoints(impact.actions_keypoints);
          allPoints.push(...points);
        });
        setAllKeypoints(allPoints);
      } catch (error) {
        console.error("Failed to fetch impacts", error);
        setAllKeypoints(achievements);
      }
    };

    fetchImpacts();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <stat.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedNumber target={stat.number} duration={stat.duration} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-2 lg:order-1 space-y-8"
          >
            <div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Our Impact
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6 leading-tight">
                Real Change, Real Stories, Real Hope
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Since December 2022, URAKUNZWE Initiative has been walking closely with
                vulnerable children and their families, creating safe spaces where
                children gain confidence, practical skills, and hope for the future.
              </p>
            </div>

            {/* Achievements List */}
            <div className="space-y-4">
              {allKeypoints.slice(0, 5).map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{achievement}</span>
                </motion.div>
              ))}
            </div>
    <br/>
            <Link to="/impact">
              <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                See Our Full Impact
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={communityImage}
                alt="Children participating in community activities"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
            </div>

            {/* Success Story Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 bg-card p-5 rounded-2xl shadow-elevated border border-border max-w-xs"
            >
              <div className="flex gap-3 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-primary text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Children who had dropped out of school successfully returned to education."
              </p>
              <p className="text-xs text-primary font-semibold mt-2">— Success Story</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
