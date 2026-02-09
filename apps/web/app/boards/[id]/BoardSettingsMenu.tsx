'use client';

import React, { useState, useEffect } from 'react';
import ArchivedItemsModal from './ArchivedItemsModal';

interface BoardSettingsMenuProps {
  boardId: string;
  boardTitle?: string;
  currentBackgroundColor?: string | null;
  currentBackgroundImage?: string | null;
  onBackgroundChange: (backgroundColor: string | null, backgroundImage: string | null) => void;
  onTitleChange?: (newTitle: string) => void;
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

// Predefined background images (using Unsplash for demo)
const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
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

// Determine if text should be white or black
export function getTextColor(backgroundColor: string | null | undefined): string {
  if (!backgroundColor) return '#172b4d'; // Default color (dark)

  // If it's a gradient or image URL, return white by default
  if (backgroundColor.startsWith('linear-gradient') || backgroundColor.startsWith('http')) {
    return '#ffffff';
  }

  // For solid colors, calculate luminance
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? '#172b4d' : '#ffffff';
}

type TabType = 'appearance' | 'settings';

export default function BoardSettingsMenu({
  boardId,
  boardTitle = '',
  currentBackgroundColor,
  currentBackgroundImage,
  onBackgroundChange,
  onTitleChange,
}: BoardSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [editedTitle, setEditedTitle] = useState(boardTitle);
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  // Reset edited title when board title changes
  useEffect(() => {
    setEditedTitle(boardTitle);
  }, [boardTitle]);

  const handleColorSelect = (color: string) => {
    onBackgroundChange(color, null);
  };

  const handleGradientSelect = (gradient: string) => {
    onBackgroundChange(gradient, null);
  };

  const handleImageSelect = (imageUrl: string) => {
    onBackgroundChange(null, imageUrl);
  };

  const handleReset = () => {
    onBackgroundChange(null, null);
  };

  const handleTitleSave = async () => {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle || trimmedTitle === boardTitle) return;
    
    setIsSavingTitle(true);
    try {
      if (onTitleChange) {
        await onTitleChange(trimmedTitle);
      }
    } finally {
      setIsSavingTitle(false);
    }
  };

  const currentBg = currentBackgroundColor || currentBackgroundImage;

  return (
    <div className="relative">
      {/* Button to open the menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        title="Paramètres du tableau"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="hidden md:inline text-sm font-medium">Paramètres</span>
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
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <h3 className="text-base font-semibold text-gray-800">
                Paramètres du tableau
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Général
                </div>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'appearance'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Apparence
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Board Title Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du tableau
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTitleSave();
                          if (e.key === 'Escape') setEditedTitle(boardTitle);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom du tableau..."
                      />
                      <button
                        onClick={handleTitleSave}
                        disabled={isSavingTitle || editedTitle.trim() === boardTitle || !editedTitle.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSavingTitle ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          'Enregistrer'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-200" />

                  {/* Archived Items Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Archives
                    </h4>
                    <button
                      onClick={() => setIsArchivedModalOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium text-gray-700">Éléments archivés</span>
                          <p className="text-xs text-gray-500">Voir les cartes et listes archivées</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  {/* Current Background Preview */}
                  {currentBg && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                        Fond actuel
                      </h4>
                      <div 
                        className="w-full h-20 rounded-lg border-2 border-gray-200 relative overflow-hidden"
                        style={
                          currentBackgroundImage 
                            ? { backgroundImage: `url(${currentBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : { background: currentBackgroundColor || '#0079bf' }
                        }
                      >
                        <button
                          onClick={handleReset}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 px-2 py-1 rounded text-xs font-medium shadow-sm transition-colors"
                        >
                          Réinitialiser
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Solid Colors Section */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                      Couleurs unies
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {SOLID_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={`w-full aspect-square rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            currentBackgroundColor === color ? 'ring-2 ring-blue-500 ring-offset-2 scale-110' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {currentBackgroundColor === color && (
                            <svg className="w-5 h-5 mx-auto text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gradients Section */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                      Dégradés
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENTS.map((gradient, index) => (
                        <button
                          key={index}
                          onClick={() => handleGradientSelect(gradient)}
                          className={`w-full h-14 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            currentBackgroundColor === gradient ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : ''
                          }`}
                          style={{ background: gradient }}
                          title={`Dégradé ${index + 1}`}
                        >
                          {currentBackgroundColor === gradient && (
                            <svg className="w-5 h-5 mx-auto text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Images Section */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                      Images de fond
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {BACKGROUND_IMAGES.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageSelect(imageUrl)}
                          className={`w-full h-14 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden ${
                            currentBackgroundImage === imageUrl ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : ''
                          }`}
                          style={{ 
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                          title={`Image ${index + 1}`}
                        >
                          {currentBackgroundImage === imageUrl && (
                            <div className="w-full h-full flex items-center justify-center bg-black/30">
                              <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
