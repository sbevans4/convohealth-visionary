import { motion } from "framer-motion";
import { 
  Mic, 
  FileText, 
  Shield, 
  Zap,
  BrainCircuit,
  Smartphone,
  Clock,
  CheckCircle2
} from "lucide-react";

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  benefits: string[];
  index: number;
}

const Feature = ({ icon: Icon, title, description, benefits, index }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-6 border shadow-md hover:shadow-lg transition-all h-full flex flex-col group"
  >
    <div className="h-14 w-14 rounded-xl bg-medical-100 text-medical-600 flex items-center justify-center mb-5 group-hover:bg-medical-200 transition-colors">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground mb-5">{description}</p>
    <div className="mt-auto">
      <ul className="space-y-2">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-medical-600 mt-0.5 shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Mic,
      title: "Intelligent Voice Recording",
      description: "Record patient conversations with clarity, even in noisy hospital environments.",
      benefits: [
        "Background noise reduction",
        "Multi-speaker recognition",
        "Works without internet connection"
      ]
    },
    {
      icon: FileText,
      title: "Perfect SOAP Notes",
      description: "Transform conversations into properly formatted clinical documentation in seconds.",
      benefits: [
        "Proper medical terminology",
        "Structured SOAP format",
        "One-click EHR integration"
      ]
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "End-to-end encryption and secure data handling that meets all privacy requirements.",
      benefits: [
        "HIPAA compliant infrastructure",
        "Data encryption at rest & in transit",
        "Secure cloud storage with backups"
      ]
    },
    {
      icon: BrainCircuit,
      title: "Medical AI Analysis",
      description: "Get intelligent suggestions for diagnosis codes and treatment plans.",
      benefits: [
        "Real-time ICD-10 code suggestions",
        "Medication interaction alerts",
        "Evidence-based treatment recommendations"
      ]
    },
    {
      icon: Clock,
      title: "Save 10+ Hours Weekly",
      description: "Reduce documentation time by up to 75%, giving you more time for patient care.",
      benefits: [
        "Average 12 minutes saved per patient",
        "Automatic follow-up reminders",
        "Reduces physician burnout"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Purpose-built for Android and iOS devices with intuitive touch controls.",
      benefits: [
        "Works on any smartphone or tablet",
        "Offline functionality included",
        "Syncs when connection is restored"
      ]
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-medical-100 text-medical-800 text-sm font-medium mb-4">
            Key Features
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Documentation That <span className="text-medical-600">Works For You</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge voice recognition with medical AI to deliver 
            accurate, compliant documentation in seconds.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
