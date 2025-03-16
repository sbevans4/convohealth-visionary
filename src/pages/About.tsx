
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-grow py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-medical-600 mb-4">
                AI Doctor Notes: Revolutionizing Medical Documentation
              </h1>
              <div className="w-20 h-1 bg-medical-500 mx-auto my-6"></div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed">
                At AI Doctor Notes, we are transforming the way healthcare professionals handle medical documentation. 
                Our AI-powered platform streamlines the creation of SOAP (Subjective, Objective, Assessment, and Plan) 
                notes, allowing physicians, nurse practitioners, and medical staff to focus more on patient care and 
                less on paperwork.
              </p>
              
              <h2 className="text-2xl font-display font-semibold text-gray-800 mt-10 mb-4">
                Our Mission
              </h2>
              
              <p className="text-lg leading-relaxed">
                We aim to simplify and enhance the medical documentation process by leveraging artificial intelligence. 
                Our goal is to reduce administrative burden, minimize errors, and improve efficiency—ultimately leading 
                to better patient outcomes.
              </p>
              
              <h2 className="text-2xl font-display font-semibold text-gray-800 mt-10 mb-4">
                Why Choose AI Doctor Notes?
              </h2>
              
              <ul className="space-y-3 my-6">
                <li className="flex items-start">
                  <span className="text-medical-600 font-bold mr-2">✅</span>
                  <span><strong>Efficiency:</strong> Generate high-quality SOAP notes in seconds.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-medical-600 font-bold mr-2">✅</span>
                  <span><strong>Accuracy:</strong> AI-driven insights help ensure clarity and compliance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-medical-600 font-bold mr-2">✅</span>
                  <span><strong>Security:</strong> HIPAA-compliant data protection measures safeguard sensitive patient information.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-medical-600 font-bold mr-2">✅</span>
                  <span><strong>User-Friendly:</strong> Intuitive design makes documentation seamless for all medical professionals.</span>
                </li>
              </ul>
              
              <h2 className="text-2xl font-display font-semibold text-gray-800 mt-10 mb-4">
                Who We Serve
              </h2>
              
              <p className="text-lg leading-relaxed">
                Whether you're a solo practitioner, part of a large healthcare system, or a telemedicine provider, 
                AI Doctor Notes adapts to your workflow, enhancing productivity and documentation accuracy.
              </p>
              
              <h2 className="text-2xl font-display font-semibold text-gray-800 mt-10 mb-4">
                Our Commitment
              </h2>
              
              <p className="text-lg leading-relaxed">
                We are dedicated to continuous improvement, innovation, and maintaining the highest standards of 
                security and compliance in medical AI technology.
              </p>
              
              <div className="bg-medical-50 p-6 rounded-lg border border-medical-100 my-10">
                <p className="text-xl font-medium text-center text-medical-800">
                  Experience the future of medical documentation with AI Doctor Notes.
                </p>
              </div>
              
              <div className="text-center mt-12">
                <p className="text-lg mb-4">For inquiries or support, contact us:</p>
                <Button className="gap-2" asChild>
                  <a href="mailto:support@aidoctornotes.app">
                    <Mail className="h-4 w-4" />
                    support@aidoctornotes.app
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <Button asChild>
                <Link to="/auth">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default About;
