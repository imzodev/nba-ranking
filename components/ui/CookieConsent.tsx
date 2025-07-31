"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            We use cookies to enhance your experience on our website. By continuing to use our site, you consent to our use of cookies.
            Learn more in our{' '}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
