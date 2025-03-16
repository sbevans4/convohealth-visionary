
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Effective Date: {currentDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to AI Doctor Notes ("Company," "we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring that your personal and medical information is handled securely and responsibly. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our AI-powered medical SOAP notes creator (the "Service").
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            
            <h3 className="font-medium mt-3">(a) Personal Information:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email address, and contact details (if provided).</li>
              <li>Healthcare provider or facility name (if applicable).</li>
            </ul>
            
            <h3 className="font-medium mt-3">(b) Medical Information:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Patient data inputted into the Service for SOAP note generation.</li>
              <li>Diagnoses, treatments, medications, and other clinical documentation.</li>
            </ul>
            
            <h3 className="font-medium mt-3">(c) Usage Data:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Information on how you use the Service, including timestamps and activity logs.</li>
              <li>Technical data such as IP address, browser type, and device information.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Generate SOAP notes based on user input.</li>
              <li>Improve and enhance our AI model and Service functionality.</li>
              <li>Ensure compliance with legal and regulatory requirements.</li>
              <li>Provide customer support and respond to inquiries.</li>
              <li>Maintain the security and integrity of our platform.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">4. Data Protection & Security</h2>
            <p>We implement robust security measures to safeguard your information, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>End-to-end encryption of medical data.</li>
              <li>Access controls and authentication protocols.</li>
              <li>Compliance with HIPAA, GDPR, and other relevant regulations.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">5. Data Sharing & Disclosure</h2>
            <p>
              We do not sell or share your data with third parties except in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>When required by law or legal processes.</li>
              <li>With trusted service providers who assist in maintaining our platform (under strict confidentiality agreements).</li>
              <li>With your explicit consent.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>
            <p>
              We retain data only as long as necessary for the intended purpose or as required by law. 
              Users may request deletion of their data by contacting us at support@aidoctornotes.app.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">7. User Rights & Choices</h2>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access, modify, or delete your personal data.</li>
              <li>Restrict or object to certain processing activities.</li>
              <li>Withdraw consent for data collection.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">8. Third-Party Links & Services</h2>
            <p>
              Our Service may contain links to third-party websites or integrations. We are not responsible for 
              their privacy practices and encourage users to review their policies.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-2">10. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <div className="mt-2">
              <p>AI Doctor Notes</p>
              <p>Email: support@aidoctornotes.app</p>
              <p>Website: https://aidoctornotes.app</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
