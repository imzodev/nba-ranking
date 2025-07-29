import { RadioGroup } from '@headlessui/react';
import { RANKING_TYPES, RANKING_TYPE_LABELS } from '@/lib/utils/constants';

interface RankingTypeSelectorProps {
  selectedType: number;
  onChange: (type: number) => void;
}

export default function RankingTypeSelector({ selectedType, onChange }: RankingTypeSelectorProps) {
  return (
    <div className="w-full">
      <RadioGroup value={selectedType} onChange={onChange}>
        <RadioGroup.Label className="sr-only">Ranking Type</RadioGroup.Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {RANKING_TYPES.map((type) => (
            <RadioGroup.Option
              key={type}
              value={type}
              className={({ active, checked }) =>
                `relative flex cursor-pointer rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none ${
                  checked
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300'
                    : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500'
                } ${
                  active ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                }`
              }
            >
              {({ checked }) => (
                <div className="flex w-full items-center justify-between">
                  <RadioGroup.Label
                    as="span"
                    className={`text-sm font-medium ${
                      checked ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {RANKING_TYPE_LABELS[type]}
                  </RadioGroup.Label>
                  {checked && (
                    <svg
                      className="h-4 w-4 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}