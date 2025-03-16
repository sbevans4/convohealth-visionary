
import { motion } from "framer-motion";
import { 
  Mic, 
  FileText, 
  Shield, 
  Zap,
  BrainCircuit
} from "lucide-react";

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const Feature = ({ icon: Icon, title, description, index }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-background rounded-xl p-6 border shadow-soft h-full flex flex-col"
  >
    <div className="h-12 w-12 rounded-lg bg-medical-100 text-medical-600 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground flex-grow">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Mic,
      title: "Voice Recording",
      description: "Record patient encounters with crystal-clear audio capture optimized for medical environments."
    },
    {
      icon: FileText,
      title: "Instant SOAP Notes",
      description: "Convert conversations into properly formatted SOAP notes with AI that understands medical terminology."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "End-to-end encryption and secure data handling that meets or exceeds all privacy requirements."
    },
    {
      icon: BrainCircuit,
      title: "Medical AI Analysis",
      description: "Intelligent suggestions for diagnosis codes and treatment plans based on the conversation."
    },
    {
      icon: Zap,
      title: "Time Saving",
      description: "Reduce documentation time by up to 75%, letting you focus more on patient care."
    },
    {
      icon: Shield,
      title: "Mobile Optimized",
      description: "Purpose-built for Android devices with intuitive controls and offline capability."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Transforming Medical Documentation
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge voice recognition with medical AI to deliver accurate, 
            compliant documentation in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
