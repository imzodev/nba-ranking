import { useState } from 'react';
import { isValidEmail, isValidName } from '@/lib/utils/validation';
import type { Player } from '@/lib/types/Player';
import type { RankingSubmission } from '@/lib/types/Ranking';

interface SubmissionFormProps {
  players: Player[];
  rankingType: number;
  onSubmit: (submission: RankingSubmission) => Promise<void>;
  isSubmitting?: boolean;
}

export default function SubmissionForm({
  players,
  rankingType,
  onSubmit,
  isSubmitting = false,
}: SubmissionFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate name
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else if (!isValidName(name)) {
      setNameError('Name must be between 2 and 50 characters');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate players
    if (players.length === 0) {
      setSubmissionError('Please select at least one player for your ranking');
      isValid = false;
    } else {
      setSubmissionError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submission: RankingSubmission = {
      email,
      name,
      ranking_type: rankingType,
      rankings: players.map((player, index) => ({
        playerId: player.id,
        rank: index + 1,
      })),
    };
    
    try {
      await onSubmit(submission);
      // Reset form on successful submission
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError('Failed to submit ranking. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
                  emailError ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 dark:ring-gray-600 focus:ring-nba-blue'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                placeholder="you@example.com"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {emailError}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
                  nameError ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 dark:ring-gray-600 focus:ring-nba-blue'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                placeholder="John Smith"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : undefined}
              />
              {nameError && (
                <p className="mt-2 text-sm text-red-600" id="name-error">
                  {nameError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {submissionError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Submission Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{submissionError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center rounded-md bg-nba-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-nba-blue/90 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-nba-blue ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Ranking'
          )}
        </button>
      </div>
    </form>
  );
}
