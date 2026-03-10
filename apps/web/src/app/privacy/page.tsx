"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function PrivacyPolicy() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    reason: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend only - just show success message
    setIsSubmitted(true);
    setFormData({ fullName: "", email: "", reason: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#121826] mb-4">
              Privacy{" "}
              <span className="bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-[#5A6275]">Last updated: March 6, 2026</p>
          </div>

          {/* Content */}
          <div className="card p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">1. Introduction</h2>
              <p className="text-[#5A6275] leading-relaxed">
                Majestor (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our mobile application and website (collectively, the &quot;Service&quot;).
                Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-[#121826] mb-3 mt-6">2.1 Personal Information</h3>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Full name and username</li>
                <li>University email address</li>
                <li>University and faculty information</li>
                <li>Profile picture (optional)</li>
                <li>Phone number (for carpooling features)</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#121826] mb-3 mt-6">2.2 Usage Data</h3>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                We automatically collect certain information when you use the Service:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Device information (type, operating system, unique identifiers)</li>
                <li>Log data (access times, pages viewed, app features used)</li>
                <li>Location data (with your permission, for carpooling features)</li>
                <li>IP address</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#121826] mb-3 mt-6">2.3 User-Generated Content</h3>
              <p className="text-[#5A6275] leading-relaxed">
                We collect and store content you upload or create, including documents,
                images, ride requests, and any other materials you share through the Service.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">3. How We Use Your Information</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Provide, maintain, and improve the Service</li>
                <li>Create and manage your account</li>
                <li>Enable document sharing and carpooling features</li>
                <li>Verify your university affiliation</li>
                <li>Send you important updates about the Service</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues and fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">4. Information Sharing</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>

              <h3 className="text-lg font-semibold text-[#121826] mb-3 mt-6">4.1 With Other Users</h3>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                Your profile information (name, university, faculty) and uploaded documents
                are visible to other users. For carpooling, your contact information may be
                shared with matched drivers or passengers.
              </p>

              <h3 className="text-lg font-semibold text-[#121826] mb-3 mt-6">4.2 With Service Providers</h3>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                We may share your information with third-party vendors who perform services
                on our behalf, such as hosting, analytics, and customer support.
              </p>

              <h3 className="text-lg font-semibold text-[#121826] mb-3 mt-6">4.3 For Legal Reasons</h3>
              <p className="text-[#5A6275] leading-relaxed">
                We may disclose your information if required by law, in response to legal
                process, or to protect the rights, property, or safety of Majestor, our
                users, or the public.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">5. Data Security</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect
                your personal information, including:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure password hashing using BCrypt</li>
                <li>JWT-based authentication</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="text-[#5A6275] leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">6. Data Retention</h2>
              <p className="text-[#5A6275] leading-relaxed">
                We retain your personal information for as long as your account is active
                or as needed to provide you the Service. We may retain certain information
                after account deletion for legitimate business purposes, such as complying
                with legal obligations, resolving disputes, and enforcing our agreements.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">7. Your Rights</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your data</li>
              </ul>
              <p className="text-[#5A6275] leading-relaxed mt-4">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </section>

            {/* Location Data */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">8. Location Data</h2>
              <p className="text-[#5A6275] leading-relaxed">
                For carpooling features, we may request access to your device&apos;s location.
                This is optional and only used to help match you with nearby rides. You can
                enable or disable location services through your device settings at any time.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">9. Third-Party Services</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                Our Service may integrate with third-party services:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li><strong>Google Maps:</strong> For location and mapping features</li>
                <li><strong>Cloud Storage:</strong> For hosting user-uploaded files</li>
                <li><strong>Analytics:</strong> For understanding usage patterns</li>
              </ul>
              <p className="text-[#5A6275] leading-relaxed mt-4">
                These services have their own privacy policies, and we encourage you to
                review them.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-[#5A6275] leading-relaxed">
                The Service is not intended for users under 18 years of age. We do not
                knowingly collect personal information from children. If we become aware
                that we have collected data from a child without parental consent, we will
                take steps to delete that information.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">11. International Data Transfers</h2>
              <p className="text-[#5A6275] leading-relaxed">
                Your information may be transferred to and processed in countries other than
                your country of residence. These countries may have different data protection
                laws. By using the Service, you consent to the transfer of your information
                to these countries.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-[#5A6275] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of
                any changes by posting the new Privacy Policy on this page and updating the
                &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">13. Contact Us</h2>
              <p className="text-[#5A6275] leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices,
                please contact us at:
              </p>
              <div className="mt-4 p-4 bg-[#F0F4FF] rounded-xl space-y-2">
                <p className="text-[#3A6FF8] font-medium">Email: abdullah.zafar.career@gmail</p>
                <p className="text-[#3A6FF8] font-medium">General Inquiries: abdullah.zafar.career@gmail</p>
              </div>
            </section>

            {/* Summary Box */}
            <section className="gradient-primary rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-white mb-3">Privacy Summary</h3>
              <ul className="text-white/90 space-y-2 text-sm">
                <li>✓ We collect only what&apos;s necessary to provide the Service</li>
                <li>✓ Your data is encrypted and securely stored</li>
                <li>✓ We never sell your personal information</li>
                <li>✓ You can request access, correction, or deletion of your data</li>
                <li>✓ Location access is optional and can be disabled anytime</li>
              </ul>
            </section>

            {/* Account Deletion Request Form */}
            <section id="delete-account" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#121826] mb-4">
                Request Account Deletion
              </h2>
              <p className="text-[#5A6275] leading-relaxed mb-6">
                As stated in our privacy policy, you have the right to request deletion of your account
                and all associated data. Please fill out the form below, and our team will process your
                request within 30 days. You will receive a confirmation email once your request is received.
              </p>

              <div className="card p-6 md:p-8 border border-[#E1E5ED]">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#121826] mb-2">
                      Request Submitted
                    </h3>
                    <p className="text-[#5A6275] mb-6">
                      Thank you for your request. Our team will review it and contact you via email
                      within the next 30 days. Please check your inbox (and spam folder) for updates.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-[#3A6FF8] hover:underline font-medium"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[#121826] mb-2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border border-[#E1E5ED] focus:border-[#3A6FF8] focus:ring-2 focus:ring-[#3A6FF8]/20 outline-none transition-all text-[#121826] placeholder:text-[#9CA3AF]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#121826] mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter the email associated with your account"
                        className="w-full px-4 py-3 rounded-xl border border-[#E1E5ED] focus:border-[#3A6FF8] focus:ring-2 focus:ring-[#3A6FF8]/20 outline-none transition-all text-[#121826] placeholder:text-[#9CA3AF]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-[#121826] mb-2"
                      >
                        Reason for Deletion <span className="text-[#5A6275] text-xs">(Optional)</span>
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Please let us know why you'd like to delete your account (optional)"
                        className="w-full px-4 py-3 rounded-xl border border-[#E1E5ED] focus:border-[#3A6FF8] focus:ring-2 focus:ring-[#3A6FF8]/20 outline-none transition-all text-[#121826] placeholder:text-[#9CA3AF] resize-none"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Important Notice</p>
                          <p>
                            Account deletion is permanent and cannot be undone. All your data,
                            including uploaded documents, ride history, and profile information
                            will be permanently removed from our systems.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Submit Deletion Request
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

