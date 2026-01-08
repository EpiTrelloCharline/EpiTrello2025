'use client';

import React, { useState } from 'react';
import ArchivedItemsModal from './ArchivedItemsModal';

interface BoardSettingsMenuProps {
  boardId: string;
  currentBackgroundColor?: string | null;
  currentBackgroundImage?: string | null;
  onBackgroundChange: (backgroundColor: string | null, backgroundImage: string | null) => void;
}

// Predefined solid colors
const SOLID_COLORS = [
  '#0079bf', // Classic Blue
  '#d29034', // Orange
  '#519839', // Green
  '#b04632', // Red
  '#89609e', // Purple
  '#cd5a91', // Pink
  '#4bbf6b', // Light Green
  '#00aecc', // Cyan
  '#838c91', // Gray
];

// Predefined gradients
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

// Function to calculate luminance of a color
function getLuminance(color: string): number {
  // Convert hex color to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Calculate relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance;
}

// DDetermine if text should be white or black
export function getTextColor(backgroundColor: string | null | undefined): string {
  if (!backgroundColor) return '#172b4d'; // Default color (dark)

  // If it's a gradient, return white by default
  if (backgroundColor.startsWith('linear-gradient')) {
    return '#ffffff';
  }

  // For solid colors, calculate luminance
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? '#172b4d' : '#ffffff';
}

export default function BoardSettingsMenu({
  boardId,
  currentBackgroundColor,
  currentBackgroundImage,
  onBackgroundChange,
}: BoardSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onBackgroundChange(color, null);
    setIsOpen(false);
  };

  const handleGradientSelect = (gradient: string) => {
    onBackgroundChange(gradient, null);
    setIsOpen(false);
  };

  const handleReset = () => {
    onBackgroundChange(null, null);
    setIsOpen(false);
  };

  const currentBg = currentBackgroundColor || currentBackgroundImage;

  return (
    <div className="relative">
      {/* Button ... to open the menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/20 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        title="Paramètres du board"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Overlay to close the menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Apparence du board
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Solid Colors Section */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-600 mb-2">
                Couleurs unies
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {SOLID_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-full aspect-square rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentBg === color ? 'ring-2 ring-blue-500 scale-110' : ''
                      }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Gradients Section */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-600 mb-2">
                Dégradés
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {GRADIENTS.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleGradientSelect(gradient)}
                    className={`w-full h-16 rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentBg === gradient ? 'ring-2 ring-blue-500 scale-105' : ''
                      }`}
                    style={{ background: gradient }}
                    title={`Gradient ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {currentBg && (
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 mb-2"
              >
                Réinitialiser l'apparence
              </button>
            )}

            {/* Archived Items Section */}
            <div className="border-t pt-4 mt-2">
              <button
                onClick={() => setIsArchivedModalOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Éléments archivés</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      <ArchivedItemsModal
        boardId={boardId}
        isOpen={isArchivedModalOpen}
        onClose={() => setIsArchivedModalOpen(false)}
      />
    </div>
  );
}
