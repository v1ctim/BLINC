"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const getPersonalYearDates = (birthDate: string, yearIndex: number) => {
    const birth = new Date(birthDate);
    const yearStart = new Date(birth);
    yearStart.setFullYear(birth.getFullYear() + yearIndex);
    
    const yearEnd = new Date(yearStart);
    yearEnd.setFullYear(yearStart.getFullYear() + 1);
    yearEnd.setDate(yearEnd.getDate() - 1); // Last day of personal year
    
    return { yearStart, yearEnd };
  };

  const getWeeksInPersonalYear = (birthDate: string, yearIndex: number) => {
    const { yearStart, yearEnd } = getPersonalYearDates(birthDate, yearIndex);
    const diffTime = yearEnd.getTime() - yearStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(diffDays / 7);
  };

  const getCurrentPersonalWeek = (birthDate: string) => {
    const today = new Date();
    const currentAge = calculateAge(birthDate);
    const { yearStart } = getPersonalYearDates(birthDate, currentAge);
    
    if (today < yearStart) return 0;
    
    const diffTime = today.getTime() - yearStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  const getWeekInfo = (birthDate: string, yearIndex: number, weekIndex: number) => {
    const { yearStart } = getPersonalYearDates(birthDate, yearIndex);
    
    // Week starts from the same day of week as birth
    const weekStart = new Date(yearStart);
    weekStart.setDate(weekStart.getDate() + (weekIndex - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const { yearEnd } = getPersonalYearDates(birthDate, yearIndex);
    
    // Check if this week extends beyond the personal year
    const isPartialWeek = weekEnd > yearEnd;
    const actualWeekEnd = isPartialWeek ? yearEnd : weekEnd;
    
    const daysInWeek = Math.floor((actualWeekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      weekStart,
      weekEnd: actualWeekEnd,
      isPartialWeek,
      daysInWeek
    };
  };

  const handleDateSubmit = () => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      setAge(calculatedAge);
    }
  };

  const handleBlockClick = (yearIndex: number) => {
    if (age !== null) {
      setIsTransitioning(true);
      setTimeout(() => {
        setExpandedWeek(null);
        setExpandedYear(yearIndex);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPreviousYear = () => {
    if (expandedYear !== null && expandedYear > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setExpandedWeek(null);
        setExpandedYear(expandedYear - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToNextYear = () => {
    if (expandedYear !== null && expandedYear < 69) {
      setIsTransitioning(true);
      setTimeout(() => {
        setExpandedWeek(null);
        setExpandedYear(expandedYear + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleWeekClick = (weekIndex: number) => {
    if (expandedYear !== null) {
      setIsTransitioning(true);
      setTimeout(() => {
        setExpandedWeek(weekIndex);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPreviousWeek = () => {
    if (expandedWeek !== null && expandedWeek > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setExpandedWeek(expandedWeek - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToNextWeek = () => {
    if (expandedWeek !== null && dateOfBirth && expandedYear !== null) {
      const maxWeeks = getWeeksInPersonalYear(dateOfBirth, expandedYear);
      if (expandedWeek < maxWeeks) {
        setIsTransitioning(true);
        setTimeout(() => {
          setExpandedWeek(expandedWeek + 1);
          setIsTransitioning(false);
        }, 300);
      }
    }
  };

  const getDayInfo = (birthDate: string, yearIndex: number, weekIndex: number, dayIndex: number) => {
    const { yearStart } = getPersonalYearDates(birthDate, yearIndex);
    
    // Calculate the actual day based on birth day of week
    const dayDate = new Date(yearStart);
    dayDate.setDate(dayDate.getDate() + (weekIndex - 1) * 7 + (dayIndex - 1));
    
    const { yearEnd } = getPersonalYearDates(birthDate, yearIndex);
    const isValidDay = dayDate <= yearEnd;
    
    return {
      date: dayDate,
      isValidDay
    };
  };

  const getCurrentPersonalDay = (birthDate: string) => {
    const today = new Date();
    const currentAge = calculateAge(birthDate);
    const { yearStart } = getPersonalYearDates(birthDate, currentAge);
    
    if (today < yearStart) return 0;
    
    const diffTime = today.getTime() - yearStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const generateDayBlocks = (yearIndex: number, weekIndex: number) => {
    if (!age || !dateOfBirth) return [];
    
    const currentAge = age;
    const currentPersonalDay = getCurrentPersonalDay(dateOfBirth);
    const dayBlocks = [];
    
    for (let day = 1; day <= 7; day++) {
      const dayInfo = getDayInfo(dateOfBirth, yearIndex, weekIndex, day);
      let dayColor = '';
      
      if (!dayInfo.isValidDay) {
        // Day beyond personal year - cyan
        dayColor = 'bg-cyan-500';
      } else if (yearIndex < currentAge) {
        // Past year - all days unavailable
        dayColor = isDark ? 'bg-white' : 'bg-black';
      } else if (yearIndex === currentAge) {
        // Current personal year
        const dayNumber = (weekIndex - 1) * 7 + day;
        
        if (dayNumber < currentPersonalDay) {
          // Past days
          dayColor = isDark ? 'bg-white' : 'bg-black';
        } else if (dayNumber === currentPersonalDay) {
          // Current day
          dayColor = 'bg-orange-500';
        } else {
          // Future days
          dayColor = isDark ? 'bg-white' : 'bg-black';
        }
      } else {
        // Future years
        dayColor = isDark ? 'bg-white' : 'bg-black';
      }
      
      const dayNumber = (weekIndex - 1) * 7 + day;
      const isPastDay = yearIndex < currentAge || (yearIndex === currentAge && dayNumber < currentPersonalDay);
      
      dayBlocks.push(
        <div
          key={day}
          className={`${dayColor} rounded-lg`}
          style={{
            width: '180px',
            height: '500px',
            opacity: isPastDay ? 0.3 : 1,
            boxShadow: dayNumber === currentPersonalDay && yearIndex === currentAge 
              ? '0 0 25px rgba(249, 115, 22, 0.6)' 
              : isDark 
                ? '0 0 15px rgba(255, 255, 255, 0.3)' 
                : '0 0 15px rgba(0, 0, 0, 0.2)'
          }}
        />
      );
    }
    
    return dayBlocks;
  };

  const generateWeekBlocks = (yearIndex: number) => {
    if (!age || !dateOfBirth) return [];
    
    const currentAge = age;
    const weeksInPersonalYear = getWeeksInPersonalYear(dateOfBirth, yearIndex);
    const currentPersonalWeek = getCurrentPersonalWeek(dateOfBirth);
    const today = new Date();
    const { yearStart, yearEnd } = getPersonalYearDates(dateOfBirth, yearIndex);
    
    const weekBlocks = [];
    
    for (let week = 1; week <= weeksInPersonalYear; week++) {
      const weekInfo = getWeekInfo(dateOfBirth, yearIndex, week);
      let weekColor = '';
      let weekShadow = '';
      let isCurrentWeek = false;
      
      if (yearIndex < currentAge) {
        // Past year - all weeks unavailable
        if (weekInfo.isPartialWeek) {
          weekColor = 'bg-cyan-500'; // Partial week in past
          weekShadow = '0 0 8px rgba(6, 182, 212, 0.4)';
        } else {
          weekColor = isDark ? 'bg-white' : 'bg-black';
          weekShadow = isDark 
            ? '0 0 5px rgba(255, 255, 255, 0.1)' 
            : '0 0 5px rgba(0, 0, 0, 0.1)';
        }
      } else if (yearIndex === currentAge) {
        // Current personal year
        if (week < currentPersonalWeek) {
          // Past weeks in current year
          if (weekInfo.isPartialWeek) {
            weekColor = 'bg-cyan-500';
            weekShadow = '0 0 8px rgba(6, 182, 212, 0.4)';
          } else {
            weekColor = isDark ? 'bg-white' : 'bg-black';
            weekShadow = isDark 
              ? '0 0 5px rgba(255, 255, 255, 0.1)' 
              : '0 0 5px rgba(0, 0, 0, 0.1)';
          }
        } else if (week === currentPersonalWeek) {
          // Current week
          weekColor = 'bg-orange-500';
          weekShadow = '0 0 10px rgba(249, 115, 22, 0.6)';
          isCurrentWeek = true;
        } else {
          // Future weeks in current year
          if (weekInfo.isPartialWeek) {
            weekColor = 'bg-cyan-500';
            weekShadow = '0 0 8px rgba(6, 182, 212, 0.4)';
          } else {
            weekColor = isDark ? 'bg-white' : 'bg-black';
            weekShadow = isDark 
              ? '0 0 8px rgba(255, 255, 255, 0.3)' 
              : '0 0 8px rgba(0, 0, 0, 0.2)';
          }
        }
      } else {
        // Future years
        if (weekInfo.isPartialWeek) {
          weekColor = 'bg-cyan-500';
          weekShadow = '0 0 8px rgba(6, 182, 212, 0.4)';
        } else {
          weekColor = isDark ? 'bg-white' : 'bg-black';
          weekShadow = isDark 
            ? '0 0 8px rgba(255, 255, 255, 0.3)' 
            : '0 0 8px rgba(0, 0, 0, 0.2)';
        }
      }
      
      const isPastWeek = yearIndex < currentAge || (yearIndex === currentAge && week < currentPersonalWeek);
      
      weekBlocks.push(
        <div
          key={week}
          className={`${weekColor} rounded-sm hover:transform hover:-translate-y-1 cursor-pointer transition-all duration-200 relative group`}
          style={{
            width: '34px',
            height: '34px',
            boxShadow: weekShadow,
            opacity: isPastWeek ? 0.3 : 1
          }}
          onClick={() => handleWeekClick(week)}
        >
          {/* Tooltip */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
            {isPastWeek && <span className="mr-1">⊘</span>}
            {weekInfo.isPartialWeek 
              ? `Week ${week} (${weekInfo.daysInWeek} days)` 
              : isPastWeek ? 'Unavailable' : `Week ${week}`
            }
          </div>
        </div>
      );
    }
    
    return weekBlocks;
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
            ? '0 0 10px rgba(255, 255, 255, 0.1)' 
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
          className={`${blockColor} rounded-sm hover:transform hover:-translate-y-1 cursor-pointer relative group transition-all duration-300`}
          style={{
            width: '36px',
            height: '36px',
            boxShadow: blockShadow,
            opacity: age !== null && i < age ? 0.3 : 1
          }}
          onClick={() => handleBlockClick(i)}
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

  // If a week is expanded, show days view
  if (expandedWeek !== null && expandedYear !== null) {
    const maxWeeks = getWeeksInPersonalYear(dateOfBirth, expandedYear);
    
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDark 
          ? 'bg-stone-800 text-white' 
          : 'bg-white'
      }`}>
        {/* Days Grid */}
        <div className="flex items-center justify-center min-h-screen">
          <div className={`flex flex-col items-center transition-all duration-500 ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            {/* Week info */}
            <div className="mb-12 text-center">
              <div className="text-sm tracking-widest mb-2 opacity-60">
                YEAR {expandedYear} • WEEK {expandedWeek}
              </div>
            </div>
            
            <div 
              className="days-schedule"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '8px',
                alignItems: 'end',
                justifyContent: 'center'
              }}
            >
              {generateDayBlocks(expandedYear, expandedWeek)}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-8 mt-12">
              {/* Previous week button */}
              <button
                onClick={goToPreviousWeek}
                disabled={expandedWeek === 1}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  expandedWeek === 1
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark 
                      ? 'border-white hover:bg-white hover:text-stone-800' 
                      : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <span className="text-lg font-light">←</span>
              </button>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setExpandedWeek(null);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isDark 
                    ? 'border-white hover:bg-white hover:text-stone-800' 
                    : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <span className="text-lg font-light">×</span>
              </button>

              {/* Next week button */}
              <button
                onClick={goToNextWeek}
                disabled={expandedWeek === maxWeeks}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  expandedWeek === maxWeeks
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark 
                      ? 'border-white hover:bg-white hover:text-stone-800' 
                      : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <span className="text-lg font-light">→</span>
              </button>
            </div>
          </div>
        </div>

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
      </div>
    );
  }

  // If a year is expanded, show weeks view
  if (expandedYear !== null) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDark 
          ? 'bg-stone-800 text-white' 
          : 'bg-white'
      }`}>
        {/* Weeks Grid */}
        <div className="flex items-center justify-center min-h-screen">
          <div className={`flex flex-col items-center transition-all duration-500 ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            {/* Year info */}
            <div className="mb-12 text-center">
              <div className="text-sm tracking-widest mb-2 opacity-60">
                YEAR {expandedYear}
              </div>
              <div className="text-2xl font-light">
                {getWeeksInPersonalYear(dateOfBirth, expandedYear)} WEEKS
              </div>
            </div>
            
            <div 
              className="weeks-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(13, 1fr)',
                columnGap: '8px',
                rowGap: '8px',
                maxWidth: '600px'
              }}
            >
              {generateWeekBlocks(expandedYear)}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-8 mt-12">
              {/* Previous year button */}
              <button
                onClick={goToPreviousYear}
                disabled={expandedYear === 0}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  expandedYear === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark 
                      ? 'border-white hover:bg-white hover:text-stone-800' 
                      : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <span className="text-lg font-light">←</span>
              </button>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setExpandedYear(null);
                    setExpandedWeek(null);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isDark 
                    ? 'border-white hover:bg-white hover:text-stone-800' 
                    : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <span className="text-lg font-light">×</span>
              </button>

              {/* Next year button */}
              <button
                onClick={goToNextYear}
                disabled={expandedYear === 69}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  expandedYear === 69
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark 
                      ? 'border-white hover:bg-white hover:text-stone-800' 
                      : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <span className="text-lg font-light">→</span>
              </button>
            </div>
          </div>
        </div>

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
      </div>
    );
  }

  // Default years view
  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-stone-800 text-white' 
        : 'bg-white'
    }`}>
      {/* Life Blocks Grid */}
      <div className="flex items-center justify-center min-h-screen">
        <div className={`flex flex-col items-center transition-all duration-500 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
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
    </div>
  );
}