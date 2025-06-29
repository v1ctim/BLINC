"use client";

import { useState } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number | null>(null);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    
    return calculatedAge;
  };

  const handleDateSubmit = () => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      setAge(calculatedAge);
    }
  };

  const generateBlocks = () => {
    const blocks = [];
    
    // Create 70 blocks (7 rows × 10 blocks)
    for (let i = 0; i < 70; i++) {
      let blockColor = '';
      let blockShadow = '';
      
      if (age !== null) {
        if (i < age) {
          // Passed years - reduced opacity
          blockColor = isDark ? 'bg-white' : 'bg-black';
          blockShadow = isDark 
            ? '0 0 10px rgb(0, 0, 0)' 
            : '0 0 10px rgba(0, 0, 0, 0.1)';
        } else if (i === age) {
          // Current year - orange cyber color
          blockColor = 'bg-orange-500';
          blockShadow = '0 0 20px rgba(249, 115, 22, 0.6)';
        } else {
          // Future years - white/black
          blockColor = isDark ? 'bg-white' : 'bg-black';
          blockShadow = isDark 
            ? '0 0 15px rgba(255, 255, 255, 0.3)' 
            : '0 0 15px rgba(0, 0, 0, 0.2)';
        }
      } else {
        // Default when no age is set
        blockColor = isDark ? 'bg-white' : 'bg-black';
        blockShadow = isDark 
          ? '0 0 15px rgba(255, 255, 255, 0.3)' 
          : '0 0 15px rgba(0, 0, 0, 0.2)';
      }

      blocks.push(
        <div
          key={i}
          className={`${blockColor} rounded-sm hover:transform hover:-translate-y-1 cursor-pointer relative group`}
          style={{
            width: '36px',
            height: '36px',
            transition: 'all 0.3s ease',
            boxShadow: blockShadow,
            opacity: age !== null && i < age ? 0.3 : 1
          }}
        >
          {/* Tooltip for passed years */}
          {age !== null && i < age && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              <span className="mr-1">⊘</span>
              Unavailable
            </div>
          )}
        </div>
      );
    }
    
    return blocks;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-stone-800 text-white' 
        : 'bg-white'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
            isDark ? 'bg-stone-700' : 'bg-gray-300'
          } relative`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
            isDark ? 'translate-x-0.5' : 'translate-x-6'
          }`} />
        </button>
      </div>

      {/* Life Blocks Grid */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          {/* Age Display or Date Input */}
          <div className="mb-12 text-center">
            {age === null ? (
              <div>
                <div className="text-sm tracking-widest mb-4 opacity-60">
                  DATE OF BIRTH
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`px-4 py-2 rounded-sm border-none outline-none text-lg ${
                      isDark 
                        ? 'bg-stone-700 text-white' 
                        : 'bg-gray-100 text-black'
                    }`}
                  />
                  <button
                    onClick={handleDateSubmit}
                    className={`px-4 py-2 rounded-sm transition-colors duration-300 ${
                      isDark 
                        ? 'bg-white text-stone-800 hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm tracking-widest mb-2 opacity-60">
                  AGE
                </div>
                <div className="text-4xl font-light">
                  {age}
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="life-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              columnGap: '10px',
              rowGap: '10px',
              maxWidth: '600px'
            }}
          >
            {generateBlocks()}
          </div>
        </div>
      </div>
    </div>
  );
}