
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const TermsOfService = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
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
              <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
              <CardDescription>Effective Date: {currentDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
                <p>
                  Welcome to AI Doctor Notes (the "Service"), an AI-powered medical documentation tool designed 
                  to assist healthcare professionals in generating SOAP (Subjective, Objective, Assessment, and Plan) notes. 
                  These Terms of Service ("Terms") govern your access to and use of AI Doctor Notes, including all related 
                  applications, software, and services.
                </p>
                <p className="mt-2">
                  By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, 
                  you may not use the Service.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">2. Eligibility</h2>
                <p>To use AI Doctor Notes, you must:</p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Be at least 18 years old and legally able to enter into a binding agreement.</li>
                  <li>Be a licensed healthcare professional or authorized medical personnel.</li>
                  <li>Use the Service only in compliance with applicable laws and regulations, including HIPAA and other data privacy laws.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">3. Use of the Service</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">3.1 Permitted Use</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>You may use AI Doctor Notes to generate medical SOAP notes based on recorded or transcribed patient interactions.</li>
                      <li>The Service is intended as a documentation assistance tool and does not replace professional medical judgment.</li>
                      <li>You are responsible for reviewing and verifying all AI-generated notes before integrating them into patient records.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">3.2 Prohibited Use</h3>
                    <p>You agree NOT to:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>Use the Service for any unlawful or unethical purposes.</li>
                      <li>Input false, misleading, or fraudulent patient data.</li>
                      <li>Attempt to reverse-engineer, modify, or disrupt the AI algorithms or software.</li>
                      <li>Share or transfer your account credentials to unauthorized users.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">4. Data Privacy & Security</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>HIPAA Compliance:</strong> AI Doctor Notes follows strict security measures to safeguard Protected Health Information (PHI).</li>
                  <li><strong>Data Encryption:</strong> All data transmissions are encrypted to protect against unauthorized access.</li>
                  <li><strong>Data Retention:</strong> The length of data storage depends on your selected plan (Basic: 7 days, Professional: 30 days, Enterprise: custom options).</li>
                  <li><strong>User Responsibility:</strong> You are responsible for ensuring that any PHI you input or retrieve from the Service complies with your organization's data protection policies.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">5. Subscription & Payment</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AI Doctor Notes operates on a monthly subscription model.</li>
                  <li>Plans include Basic ($99/month), Professional ($499/month), and Enterprise ($1999/month).</li>
                  <li>Payments are processed securely through third-party providers, and all fees are non-refundable unless required by law.</li>
                  <li>We reserve the right to adjust pricing or modify plans with prior notice.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">6. Disclaimers & Limitations of Liability</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">6.1 No Medical Advice</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>The Service does not provide medical advice, diagnosis, or treatment.</li>
                      <li>AI-generated SOAP notes must be reviewed by a qualified medical professional before use.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">6.2 Limitation of Liability</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li>AI Doctor Notes is provided "as is" and "as available" without warranties of any kind.</li>
                      <li>We are not liable for any errors, omissions, or inaccuracies in AI-generated notes.</li>
                      <li>To the maximum extent permitted by law, our liability is limited to the amount paid for the subscription in the past 6 months.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">7. Account Termination</h2>
                <p>We reserve the right to suspend or terminate your access to the Service if:</p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>You violate these Terms.</li>
                  <li>You engage in unauthorized use of the Service.</li>
                  <li>Your subscription payment fails and is not resolved within a reasonable timeframe.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">8. Changes to These Terms</h2>
                <p>
                  We may update these Terms periodically. Any changes will be posted on our website, and continued 
                  use of the Service after modifications constitutes acceptance of the updated Terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-2">9. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-2">
                  <p>📧 Email: <a href="mailto:support@aidoctornotes.app" className="text-medical-600 hover:underline">support@aidoctornotes.app</a></p>
                  <p>📍 Address: AI Doctor Notes HQ, Medical District, San Francisco, CA 94143</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default TermsOfService;
