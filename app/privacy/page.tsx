import React from 'react';
import { Metadata } from 'next';
import MainLayout from '../../components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | NBA Ultimate Rankings',
  description: 'Privacy policy for NBA Ultimate Rankings - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: July 31, 2025
          </p>
          
          <div className="mt-6 space-y-8 text-gray-600 dark:text-gray-300">
            <p>
              At NBA Ultimate Rankings, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Information We Collect</h2>
            <p>
              We collect limited information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and submit rankings</li>
              <li>Contact us with questions or feedback</li>
            </ul>
            <p>
              This information may include your email address (optional) and the rankings you create on our platform.
              We collect email addresses solely to prevent duplicate voting and to maintain the integrity of our rankings.
            </p>
            <p>
              We also automatically collect certain information when you visit our website, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address (used solely to prevent duplicate voting)</li>
              <li>Browser type</li>
              <li>Basic device information</li>
              <li>Pages visited</li>
            </ul>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and store your rankings</li>
              <li>Prevent duplicate voting to maintain ranking integrity</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns</li>
            </ul>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. 
              However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services that are not owned or controlled by us. 
              We have no control over, and assume no responsibility for, the content, privacy policies, or practices of 
              any third-party websites or services.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@nbaultimaterankings.com" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                privacy@nbaultimaterankings.com
              </a>
            </p>
          </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
