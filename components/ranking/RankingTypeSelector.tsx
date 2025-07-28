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
                `${
                  active
                    ? 'ring-2 ring-nba-blue ring-offset-2'
                    : ''
                }
                ${
                  checked
                    ? 'bg-nba-blue text-white hover:bg-nba-blue/90'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex w-full items-center justify-center">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {RANKING_TYPE_LABELS[type]}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
