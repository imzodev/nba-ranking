import React from 'react';
import { Metadata } from 'next';
import MainLayout from '../../components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | NBA Ultimate Rankings',
  description: 'Terms and conditions for using the NBA Ultimate Rankings platform.',
};

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: July 31, 2025
          </p>
          
          <div className="mt-6 space-y-8 text-gray-600 dark:text-gray-300">
            <p>
              Welcome to NBA Ultimate Rankings! These Terms of Service ("Terms") govern your access to and use of our website, 
              services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be 
              bound by these Terms.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not 
              agree to these Terms, you may not access or use our Services.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">2. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by 
              sending an email notification, providing notice through our Services, or updating the "Last Updated" date at the 
              top of these Terms. Your continued use of our Services following notification of changes will constitute your 
              acceptance of such changes.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">3. User Submissions</h2>
            <p>
              Our Services allow you to create and submit player rankings without requiring an account. When submitting rankings, 
              you may optionally provide an email address. This email address is used solely to prevent duplicate submissions 
              and maintain the integrity of our rankings. We also collect your IP address for the same purpose.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">4. User Content</h2>
            <p>
              Our Services allow you to create and submit player rankings (collectively, "User Content"). You retain all rights in, 
              and are solely responsible for, the rankings you submit to our Services.
            </p>
            <p>
              By submitting rankings through our Services, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, 
              worldwide license to use, modify, publicly perform, publicly display, reproduce, and distribute such rankings on and 
              through our Services. This allows us to include your rankings in our aggregated results and display them on our platform.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">5. Prohibited Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our Services in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from 
              fully enjoying our Services</li>
              <li>Use our Services in any way that could damage, disable, overburden, or impair the functioning of our Services</li>
              <li>Violate any applicable law or regulation</li>
              <li>Post or transmit any content that is unlawful, fraudulent, threatening, abusive, libelous, defamatory, obscene, or 
              otherwise objectionable</li>
              <li>Attempt to circumvent any content-filtering techniques we employ</li>
              <li>Attempt to access or search the Services through the use of any engine, software, tool, agent, device, or mechanism 
              other than the software and/or search agents provided by us</li>
            </ul>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">6. Intellectual Property Rights</h2>
            <p>
              Our Services and its original content, features, and functionality are and will remain the exclusive property of 
              NBA Ultimate Rankings and its licensors. Our Services are protected by copyright, trademark, and other laws of both 
              the United States and foreign countries.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">7. Disclaimer of Warranties</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
              INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, 
              AND NON-INFRINGEMENT.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL NBA ULTIMATE RANKINGS BE LIABLE FOR ANY 
              INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES 
              FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, 
              OR INABILITY TO USE, THE SERVICES.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">9. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the State of California, without respect to its conflict of laws principles.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at 
              <a href="mailto:legal@nbaultimaterankings.com" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                legal@nbaultimaterankings.com
              </a>
            </p>
          </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
