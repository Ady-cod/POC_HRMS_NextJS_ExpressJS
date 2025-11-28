import React from "react";
import dynamic from "next/dynamic";

const PrintButton = dynamic(() => import("./PrintButton"), { ssr: false });
const BackButton = dynamic(() => import('./BackButton'), { ssr: false })

export const metadata = {
  title: "Privacy Policy - Digital Nexus AI",
  description: "Privacy Policy for Digital Nexus AI dashboard and services",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-darkblue-50 py-16">
      <div
        id="privacy-content"
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-darkblue-900"
      >
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-darkblue-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-darkblue-300 mt-1">
            Last updated: May 28, 2024
          </p>
        </header>

        <section className="space-y-4 text-sm text-darkblue-700">
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You. We use Your Personal data to provide and improve the
            Service. By using the Service, You agree to the collection and use
            of information in accordance with this Privacy Policy.
          </p>

          {/* ------------------------ */}
          {/* INTERPRETATION & DEFINITIONS */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Interpretation and Definitions
          </h2>

          <h3 className="font-semibold">Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </p>

          <h3 className="font-semibold">Definitions</h3>
          <p>For the purposes of this Privacy Policy:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Account</strong> means a unique account created for You to
              access our Service.
            </li>
            <li>
              <strong>Affiliate</strong> means an entity that controls, is
              controlled by or is under common control with a party.
            </li>
            <li>
              <strong>Company</strong> refers to DigitalNexusAI.
            </li>
            <li>
              <strong>Cookies</strong> are small files placed on Your Device.
            </li>
            <li>
              <strong>Country</strong> refers to Karnataka, India.
            </li>
            <li>
              <strong>Device</strong> means any device that can access the
              Service.
            </li>
            <li>
              <strong>Personal Data</strong> is any identifiable information.
            </li>
            <li>
              <strong>Service</strong> refers to the Website.
            </li>
            <li>
              <strong>Service Provider</strong> means third parties processing
              data for the Company.
            </li>
            <li>
              <strong>Third-party Social Media Service</strong> refers to any
              site that allows login to the Service.
            </li>
            <li>
              <strong>Usage Data</strong> refers to data collected
              automatically.
            </li>
            <li>
              <strong>Website</strong> refers to DigitalNexusAI, accessible from{" "}
              <a
                className="text-lightblue-600 underline"
                href="https://digitalnexusai.com/"
              >
                https://digitalnexusai.com/
              </a>
              .
            </li>
            <li>
              <strong>You</strong> means the individual or entity using the
              Service.
            </li>
          </ul>

          {/* ------------------------ */}
          {/* PERSONAL DATA COLLECTION */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Collecting and Using Your Personal Data
          </h2>

          <h3 className="font-semibold">Types of Data Collected</h3>
          <h4 className="font-semibold">Personal Data</h4>

          <p>
            While using Our Service, We may ask You to provide certain
            personally identifiable information, including but not limited to:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Email address</li>
            <li>First and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Usage Data</li>
          </ul>

          <h4 className="font-semibold">Usage Data</h4>
          <p>
            Usage Data is collected automatically and may include IP address,
            browser details, pages visited, time spent, device identifiers, and
            diagnostic data.
          </p>

          <h4 className="font-semibold">
            Information from Third-Party Social Media Services
          </h4>
          <p>
            You may log in using services such as Google, Facebook, Instagram,
            Twitter, or LinkedIn. We may collect profile information from these
            accounts with your permission.
          </p>

          <h3 className="font-semibold mt-4">
            Tracking Technologies and Cookies
          </h3>
          <p>
            We use Cookies, beacons, tags, and scripts to track activity and
            improve the Service.
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Necessary Cookies</strong> – Required for Service
              functionality.
            </li>
            <li>
              <strong>Acceptance Cookies</strong> – Track cookie consent.
            </li>
            <li>
              <strong>Functionality Cookies</strong> – Remember preferences.
            </li>
          </ul>

          {/* ------------------------ */}
          {/* USE OF DATA */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Use of Your Personal Data
          </h2>
          <p>The Company may use Personal Data to:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Provide and maintain the Service.</li>
            <li>Manage Your Account.</li>
            <li>Perform contractual obligations.</li>
            <li>Contact You regarding updates or notifications.</li>
            <li>Provide news, offers, and promotional content.</li>
            <li>Manage user requests.</li>
            <li>Conduct business transfers.</li>
            <li>Analyze data and improve services.</li>
          </ul>

          <p>We may share your information with:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Service Providers</li>
            <li>Business partners</li>
            <li>Affiliates</li>
            <li>Other users (if you interact publicly)</li>
            <li>With your consent</li>
          </ul>

          {/* ------------------------ */}
          {/* RETENTION, TRANSFER, DELETION */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Retention of Your Personal Data
          </h2>
          <p>
            Personal Data is retained only as long as needed for purposes in
            this Policy or to comply with legal obligations.
          </p>

          <h2 className="font-semibold text-lg mt-6">
            Transfer of Your Personal Data
          </h2>
          <p>
            Your data may be transferred to and processed in locations outside
            your jurisdiction. We ensure such transfers follow legal
            protections.
          </p>

          <h2 className="font-semibold text-lg mt-6">
            Delete Your Personal Data
          </h2>
          <p>
            You may request deletion, correction, or access to your personal
            information. We may retain data when legally required.
          </p>

          {/* ------------------------ */}
          {/* DISCLOSURES */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Disclosure of Your Personal Data
          </h2>

          <h3 className="font-semibold">Business Transactions</h3>
          <p>
            If the Company is involved in a merger or acquisition, Personal Data
            may be transferred with notice.
          </p>

          <h3 className="font-semibold">Law Enforcement</h3>
          <p>
            The Company may disclose data if required by law or government
            authorities.
          </p>

          <h3 className="font-semibold">Other Legal Requirements</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Comply with legal obligations.</li>
            <li>Protect Company rights and property.</li>
            <li>Investigate wrongdoing.</li>
            <li>Protect user safety.</li>
            <li>Protect against liability.</li>
          </ul>

          {/* ------------------------ */}
          {/* SECURITY */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Security of Your Personal Data
          </h2>
          <p>
            While we use commercially acceptable methods to secure data, no
            system is 100% secure.
          </p>

          {/* ------------------------ */}
          {/* CHILDREN */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Children &apos; s Privacy
          </h2>
          <p>
            We do not knowingly collect information from anyone under the age of
            13. Parents may contact Us if data was collected without consent.
          </p>

          {/* ------------------------ */}
          {/* LINKS */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Links to Other Websites
          </h2>
          <p>
            Our Service may contain links to third-party sites. We are not
            responsible for their content or privacy practices.
          </p>

          {/* ------------------------ */}
          {/* CHANGES */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy and notify You via email or a
            prominent notice on the Service.
          </p>

          {/* ------------------------ */}
          {/* CONTACT */}
          {/* ------------------------ */}

          <h2 className="font-semibold text-lg mt-6">Contact Us</h2>
          <p>If you have any questions, You can contact us:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>
              By email:{" "}
              <a
                className="text-lightblue-600 underline"
                href="mailto:info@digitalnexusai.com"
              >
                info@digitalnexusai.com
              </a>
            </li>
            <li>
              By visiting this page:{" "}
              <a
                className="text-lightblue-600 underline"
                href="https://digitalnexusai.com/contact.html"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </section>

        <footer className="mt-8 flex items-center justify-between">
          <div>
            <BackButton />
          </div>

          {/* PrintButton is a client component that triggers PDF generation */}
          <div>
            <PrintButton />
          </div>
        </footer>
      </div>
    </main>
  );
}
