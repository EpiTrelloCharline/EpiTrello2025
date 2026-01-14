'use client';

import React, { useState, useRef, useEffect } from 'react';

type Label = { id: string; name: string; color: string };
type Member = { id: string; userId: string; role: string; user: { id: string; name: string | null; email: string } };

export type DateFilterType = 'none' | 'overdue' | 'dueToday' | 'dueThisWeek' | 'noDueDate' | 'completed';

interface FilterPopoverProps {
  labels: Label[];
  members: Member[];
  selectedLabelIds: string[];
  selectedMemberIds: string[];
  dateFilter: DateFilterType;
  onLabelToggle: (labelId: string) => void;
  onMemberToggle: (memberId: string) => void;
  onDateFilterChange: (filter: DateFilterType) => void;
  onClearAll: () => void;
  textColor?: string;
}

export function FilterPopover({
  labels,
  members,
  selectedLabelIds,
  selectedMemberIds,
  dateFilter,
  onLabelToggle,
  onMemberToggle,
  onDateFilterChange,
  onClearAll,
  textColor = '#ffffff',
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeFiltersCount = 
    selectedLabelIds.length + 
    selectedMemberIds.length + 
    (dateFilter !== 'none' ? 1 : 0);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const dateFilterOptions: { value: DateFilterType; label: string; icon: string }[] = [
    { value: 'none', label: 'Toutes les dates', icon: '📅' },
    { value: 'overdue', label: 'En retard', icon: '🔴' },
    { value: 'dueToday', label: "Aujourd'hui", icon: '📌' },
    { value: 'dueThisWeek', label: 'Cette semaine', icon: '📆' },
    { value: 'noDueDate', label: 'Sans date', icon: '❓' },
    { value: 'completed', label: 'Terminées', icon: '✅' },
  ];

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          activeFiltersCount > 0
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-white/20 hover:bg-white/30'
        }`}
        style={{ color: activeFiltersCount > 0 ? '#ffffff' : textColor }}
        title="Filtrer les cartes"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="hidden md:inline">Filtrer</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] max-h-[70vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Filtrer</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters Content */}
          <div className="p-4 space-y-6">
            {/* Labels Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Étiquettes
              </h4>
              {labels.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Aucune étiquette disponible</p>
              ) : (
                <div className="space-y-2">
                  {labels.map((label) => {
                    const isSelected = selectedLabelIds.includes(label.id);
                    return (
                      <button
                        key={label.id}
                        onClick={() => onLabelToggle(label.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-500 ring-offset-1'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className="w-8 h-6 rounded"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="text-sm text-gray-700 flex-1 text-left">
                          {label.name || 'Sans nom'}
                        </span>
                        {isSelected && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Members Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Membres
              </h4>
              {members.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Aucun membre disponible</p>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => {
                    const isSelected = selectedMemberIds.includes(member.userId);
                    const displayName = member.user.name || member.user.email;
                    const initial = displayName[0].toUpperCase();
                    return (
                      <button
                        key={member.id}
                        onClick={() => onMemberToggle(member.userId)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-50'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: '#dfe1e6', color: '#172b4d' }}
                        >
                          {initial}
                        </div>
                        <span className="text-sm text-gray-700 flex-1 text-left">
                          {displayName}
                        </span>
                        {isSelected && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Date Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date d&apos;échéance
              </h4>
              <div className="space-y-1">
                {dateFilterOptions.map((option) => {
                  const isSelected = dateFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => onDateFilterChange(option.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span className="text-sm flex-1">{option.label}</span>
                      {isSelected && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer - Clear All */}
          {activeFiltersCount > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  onClearAll();
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium py-2 rounded-md hover:bg-red-50 transition-colors"
              >
                Effacer tous les filtres ({activeFiltersCount})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
