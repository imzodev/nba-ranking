import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

const positions = [
  { id: '', name: 'All Positions' },
  { id: 'PG', name: 'Point Guard (PG)' },
  { id: 'SG', name: 'Shooting Guard (SG)' },
  { id: 'SF', name: 'Small Forward (SF)' },
  { id: 'PF', name: 'Power Forward (PF)' },
  { id: 'C', name: 'Center (C)' },
  { id: 'G', name: 'Guard (G)' },
  { id: 'F', name: 'Forward (F)' },
];

interface PositionFilterProps {
  selectedPosition: string;
  onPositionChange: (position: string) => void;
}

export default function PositionFilter({ selectedPosition, onPositionChange }: PositionFilterProps) {
  const selectedPositionObj = positions.find(pos => pos.id === selectedPosition) || positions[0];
  
  return (
    <Listbox value={selectedPosition} onChange={onPositionChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-nba-blue sm:text-sm sm:leading-6">
            <span className="block truncate">{selectedPositionObj.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {positions.map((position) => (
                <Listbox.Option
                  key={position.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-nba-blue/10 text-nba-blue dark:text-white' : 'text-gray-900 dark:text-gray-200'
                    }`
                  }
                  value={position.id}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {position.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-nba-blue">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
