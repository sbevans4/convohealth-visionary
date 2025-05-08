
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const HipaaCompliance = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-grow py-8 px-4">
        <div className="container max-w-4xl mx-auto px-0">
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
              <CardTitle className="text-2xl font-bold">HIPAA Compliance Statement</CardTitle>
              <CardDescription>
                Our commitment to safeguarding your medical data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <section>
                <p className="mb-4">
                  At AI Doctor Notes, we are committed to ensuring the privacy, security, and confidentiality 
                  of Protected Health Information (PHI) in full compliance with the Health Insurance Portability 
                  and Accountability Act (HIPAA) and all applicable regulations.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">How We Ensure HIPAA Compliance</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">1. Data Security & Encryption</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>We implement end-to-end encryption to safeguard PHI both in transit and at rest.</li>
                      <li>Access to patient data is restricted through multi-layer authentication and role-based permissions.</li>
                      <li>Our systems are designed to prevent unauthorized access, modification, or disclosure of sensitive information.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">2. Access Control & User Authentication</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>Only authorized users can access PHI, and each access attempt is logged for auditing purposes.</li>
                      <li>We utilize secure authentication protocols to prevent unauthorized entry into the system.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">3. Compliance with HIPAA Privacy & Security Rules</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>We strictly follow the HIPAA Privacy Rule by ensuring that PHI is only used and disclosed as permitted.</li>
                      <li>Our HIPAA Security Rule compliance includes administrative, technical, and physical safeguards to protect electronic PHI (ePHI).</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">4. Business Associate Agreements (BAAs)</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>If applicable, we enter into Business Associate Agreements (BAAs) with covered entities and partners to ensure HIPAA compliance across all data-handling processes.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">5. Data Minimization & Retention</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>We collect only the necessary data required for SOAP note generation and do not retain PHI longer than necessary.</li>
                      <li>Users have the option to request deletion of their data in accordance with HIPAA guidelines.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">6. Continuous Monitoring & Compliance Updates</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>Our platform undergoes regular security audits, vulnerability assessments, and compliance checks to maintain the highest level of HIPAA compliance.</li>
                      <li>We stay updated with evolving regulations and implement best practices for data security and compliance.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">Your Trust, Our Priority</h2>
                <p>
                  Protecting patient privacy is our top priority at AI Doctor Notes. We are dedicated to 
                  maintaining the highest security standards to ensure that healthcare professionals can 
                  confidently use our platform while complying with HIPAA regulations.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                <p>
                  For more details about our HIPAA compliance practices, contact us at{" "}
                  <a href="mailto:support@aidoctornotes.app" className="text-medical-600 hover:underline">
                    support@aidoctornotes.app
                  </a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default HipaaCompliance;
