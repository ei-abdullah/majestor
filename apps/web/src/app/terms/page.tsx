import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Majestor",
  description: "Read the Terms of Service for using the Majestor platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#121826] mb-4">
              Terms of{" "}
              <span className="bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-[#5A6275]">Last updated: March 21, 2026</p>
          </div>

          {/* Content */}
          <div className="card p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">1. Introduction</h2>
              <p className="text-[#5A6275] leading-relaxed">
                Welcome to Majestor (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;)
                govern your access to and use of the Majestor mobile application and website
                (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to
                be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">2. Eligibility</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                To use Majestor, you must:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Be a currently enrolled student at a supported university</li>
                <li>Have a valid university email address (e.g., @cust.pk)</li>
                <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into these Terms</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">3. Account Registration</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                To access certain features of the Service, you must create an account. When creating
                an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">4. Acceptable Use</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes. You may NOT:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Upload copyrighted materials without proper authorization</li>
                <li>Share content that is offensive, defamatory, or harmful</li>
                <li>Use the Service for commercial purposes without our consent</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service or its servers</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
              </ul>
            </section>

            {/* User-Generated Content */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">5. User-Generated Content</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                You are solely responsible for the content you upload, post, or otherwise make available
                through the Service (&quot;User Content&quot;). You retain all ownership rights in your User
                Content, but you grant Majestor a worldwide, non-exclusive, royalty-free license to use,
                reproduce, modify, and distribute your User Content in connection with the Service.
              </p>
              <p className="text-[#5A6275] leading-relaxed">
                We do not endorse any User Content and are not responsible or liable for any User
                Content. We reserve the right to remove any User Content that violates these Terms or
                is otherwise objectionable.
              </p>
            </section>

            {/* Document Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">6. Document Sharing</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                When uploading documents to Majestor:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>You represent that you have the right to share the content</li>
                <li>You grant Majestor a non-exclusive license to host and display the content</li>
                <li>You understand that uploaded content may be viewed by other users</li>
                <li>You are responsible for ensuring content does not violate any laws or third-party rights</li>
              </ul>
              <p className="text-[#5A6275] leading-relaxed mt-4">
                We reserve the right to remove any content that violates these Terms or is deemed
                inappropriate at our sole discretion.
              </p>
            </section>

            {/* Carpooling Services */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">7. Carpooling Services</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                Majestor facilitates connections between drivers and passengers. You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Majestor is not a transportation provider</li>
                <li>Drivers must have valid licenses and insurance</li>
                <li>Users arrange rides at their own risk</li>
                <li>We do not guarantee the safety, quality, or legality of rides</li>
                <li>Any agreements or disputes are between drivers and passengers</li>
              </ul>
            </section>

            {/* User Conduct and Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">8. User Conduct and Responsibilities</h2>
              <p className="text-[#5A6275] leading-relaxed mb-4">
                You agree to use the Service in a manner that is lawful, respectful, and in accordance
                with these Terms. You are responsible for your own conduct and for any consequences
                thereof. This includes, but is not limited to, the following:
              </p>
              <ul className="list-disc list-inside text-[#5A6275] space-y-2 ml-4">
                <li>Treating other users with respect and courtesy</li>
                <li>Not engaging in any form of harassment, discrimination, or hate speech</li>
                <li>Not using the Service to promote illegal activities</li>
                <li>Not engaging in any fraudulent or deceptive practices</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">9. Intellectual Property</h2>
              <p className="text-[#5A6275] leading-relaxed">
                The Service and its original content (excluding user-generated content), features,
                and functionality are owned by Majestor and are protected by international copyright,
                trademark, patent, trade secret, and other intellectual property laws. You may not
                copy, modify, distribute, sell, or lease any part of our Service without our prior
                written consent.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">10. Disclaimers</h2>
              <p className="text-[#5A6275] leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
                SECURE, OR ERROR-FREE. WE MAKE NO WARRANTIES ABOUT THE ACCURACY OR RELIABILITY OF
                USER-GENERATED CONTENT.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">11. Limitation of Liability</h2>
              <p className="text-[#5A6275] leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAJESTOR SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
                LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">12. Termination</h2>
              <p className="text-[#5A6275] leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately,
                without prior notice or liability, for any reason, including if you breach these
                Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">13. Changes to Terms</h2>
              <p className="text-[#5A6275] leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of
                any material changes by posting the new Terms on the Service. Your continued use
                of the Service after changes become effective constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">14. Governing Law</h2>
              <p className="text-[#5A6275] leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Pakistan,
                without regard to its conflict of law provisions. Any disputes arising under these
                Terms shall be subject to the exclusive jurisdiction of the courts in Islamabad, Pakistan.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-[#121826] mb-4">15. Contact Us</h2>
              <p className="text-[#5A6275] leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-[#F0F4FF] rounded-xl">
                <p className="text-[#3A6FF8] font-medium">abdullah.zafar.career@gmail.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

