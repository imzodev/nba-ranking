import { useState } from 'react';
import { Mail, User, AlertCircle, Send, Loader2 } from 'lucide-react';
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
    
    // Validate email (optional)
    if (email && !isValidEmail(email)) {
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
    
    // Validate rankingType
    const allowedTypes = [10, 25, 50, 100];
    if (!allowedTypes.includes(Number(rankingType))) {
      setSubmissionError('Invalid ranking type. Must be 10, 25, 50, or 100.');
      isValid = false;
      return isValid;
    }

    // Validate players
    if (players.length !== Number(rankingType)) {
      setSubmissionError(`You must select exactly ${rankingType} player${rankingType === 1 ? '' : 's'} for your top ${rankingType} ranking.`);
      isValid = false;
    } else {
      setSubmissionError('');
    }

    // Validate duplicate players
    const playerIds = players.map(p => p.id);
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== playerIds.length) {
      setSubmissionError('Rankings contain duplicate players. Each player must be unique.');
      isValid = false;
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
      ranking_type: Number(rankingType),
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
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            Your Information
          </h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    nameError 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-500/20'
                  }`}
                  placeholder="John Smith"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "name-error" : undefined}
                />
              </div>
              {nameError && (
                <div className="mt-2 flex items-center" id="name-error">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">{nameError}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    emailError 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-500/20'
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              {emailError && (
                <div className="mt-2 flex items-center" id="email-error">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {submissionError && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Submission Error</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">{submissionError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isSubmitting 
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-gray-500'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Ranking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}