import React from 'react';
import { Metadata } from 'next';
import MainLayout from '../../components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'About | NBA Ultimate Rankings',
  description: 'Learn about the NBA Ultimate Rankings project, how it works, and the team behind it.',
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            About NBA Ultimate Rankings
          </h1>
          
          <div className="mt-6 space-y-8 text-gray-600 dark:text-gray-300">
            <p>
              NBA Ultimate Rankings is a platform that allows basketball fans to create, share, and discover 
              rankings of NBA players. Whether you're debating the greatest of all time, comparing players from 
              different eras, or just having fun organizing your favorite players, our platform makes it easy.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Our Mission</h2>
            <p>
              Our mission is to provide basketball fans with a fun, interactive way to engage with the rich history 
              and exciting present of the NBA. We believe that rankings and comparisons are a natural part of sports 
              fandom, and we want to give fans the tools to express their opinions and share them with others.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">How It Works</h2>
            <p>
              Creating a ranking is simple:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Choose a ranking type (Top 10, Top 25, Top 50, or Top 100)</li>
              <li>Search for players from our database of over 5,000 NBA players</li>
              <li>Drag and drop players to arrange them in your preferred order</li>
              <li>Add a title and description to your ranking</li>
              <li>Share your ranking with friends or the community</li>
            </ol>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Our Data</h2>
            <p>
              Our player database includes comprehensive information on NBA players from the league's founding to the 
              present day. Player information is sourced from publicly available data and is regularly updated to 
              ensure accuracy.
            </p>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Contact Us</h2>
            <p>
              Have questions, suggestions, or feedback? We'd love to hear from you! Contact us at 
              <a href="mailto:contact@nbaultimaterankings.com" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                contact@nbaultimaterankings.com
              </a>
            </p>
          </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
