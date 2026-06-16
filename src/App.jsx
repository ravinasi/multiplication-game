import React, { useState, useEffect, useCallback } from 'react';

// Theme configurations with visual representations
const THEMES = [
  {
    id: 'baskets',
    name: 'Baskets & Apples',
    colors: { primary: '#FF6B6B', secondary: '#FFD93D', bg: '#FFF5E1' },
    container: '🧺',
    item: '🍎',
  },
  {
    id: 'cookies',
    name: 'Plates & Cookies',
    colors: { primary: '#6BCB77', secondary: '#FFD93D', bg: '#E8F5E9' },
    container: '🍽️',
    item: '🍪',
  },
  {
    id: 'fish',
    name: 'Fish Tanks',
    colors: { primary: '#4D96FF', secondary: '#00D4FF', bg: '#E0F7FF' },
    container: '🐠',
    item: '🐟',
  },
  {
    id: 'birds',
    name: 'Trees & Birds',
    colors: { primary: '#95E1D3', secondary: '#F38181', bg: '#E8F8F5' },
    container: '🌳',
    item: '🐦',
  },
  {
    id: 'aliens',
    name: 'Spaceships & Aliens',
    colors: { primary: '#A29BFE', secondary: '#74B9FF', bg: '#F0F3FF' },
    container: '🚀',
    item: '👽',
  },
];

// Visual grid component - shows multiplication visually
const VisualGrid = ({ rows, cols, theme }) => {
  const hasItems = cols > 0;

  return (
    <div className="flex justify-center gap-2 flex-wrap p-3 rounded-2xl" style={{ backgroundColor: theme.colors.bg }}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-2 p-3 rounded-xl border-2 border-dashed min-h-12 items-center justify-center"
          style={{
            backgroundColor: theme.colors.primary,
            opacity: hasItems ? 0.9 : 0.4,
            borderColor: hasItems ? 'transparent' : theme.colors.primary,
            animation: `fadeInScale 0.6s ease-out ${rowIdx * 0.1}s both`,
          }}
        >
          {hasItems ? (
            Array.from({ length: cols }).map((_, colIdx) => (
              <span
                key={`${rowIdx}-${colIdx}`}
                className="text-2xl md:text-3xl"
                style={{
                  animation: `bounce 2s ease-in-out ${rowIdx * 0.1 + colIdx * 0.05}s infinite`,
                }}
              >
                {theme.item}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 font-semibold">empty</span>
          )}
        </div>
      ))}
    </div>
  );
};

// Numeric Keypad Component
const NumericKeypad = ({ isVisible, onNumberClick, onClear, onBackspace }) => {
  if (!isVisible) return null;

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-purple-500 shadow-2xl p-4 z-40">
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {buttons.map((num) => (
            <button
              key={num}
              onMouseDown={(e) => {
                e.preventDefault();
                onNumberClick(num);
              }}
              className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xl py-4 rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onBackspace();
            }}
            className="col-span-2 bg-orange-400 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all active:scale-95"
          >
            ← Delete
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onClear();
            }}
            className="col-span-3 bg-red-400 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

// Input field component with error state
const InputField = React.forwardRef(({ value, onChange, placeholder, error, onKeyPress, onFocus, onBlur, minValue = 0, maxValue = 12 }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        type="number"
        inputMode="none"
        min={minValue}
        max={maxValue}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-16 md:w-20 px-2 py-2 text-lg md:text-xl font-bold text-center rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-3 ${
          error
            ? 'border-red-500 ring-red-300 bg-red-50 animate-shake'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-300 bg-white'
        }`}
      />
    </div>
  );
});

// Game Over Summary Screen
const GameOverScreen = ({ score, totalExercises, onPlayAgain }) => {
  const playAgainButtonRef = React.useRef(null);
  const percentage = Math.round((score / totalExercises) * 100);
  let message = '';
  let emoji = '';

  if (percentage === 100) {
    message = 'Perfect Score! 🏆';
    emoji = '🎯';
  } else if (percentage >= 80) {
    message = 'Excellent Work! 🌟';
    emoji = '⭐';
  } else if (percentage >= 60) {
    message = 'Great Job! 🎉';
    emoji = '👏';
  } else if (percentage >= 40) {
    message = 'Good Effort! 💪';
    emoji = '👍';
  } else {
    message = 'Keep Practicing! 📚';
    emoji = '🚀';
  }

  // Auto-focus on Play Again button
  useEffect(() => {
    if (playAgainButtonRef.current) {
      setTimeout(() => {
        playAgainButtonRef.current?.focus();
      }, 100);
    }
  }, []);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onPlayAgain();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center z-50 p-4" onKeyPress={handleKeyPress} tabIndex={0}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Summary Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center z-10 transform transition-all duration-500 scale-100 animate-pulse-slow">
        {/* Celebration Emoji */}
        <div className="text-6xl mb-6 animate-bounce">{emoji}</div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {message}
        </h2>

        {/* Score Display */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-2">Final Score</p>
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {score}/{totalExercises}
          </div>
          <p className="text-2xl font-bold text-gray-700 mb-2">{percentage}%</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Performance Message */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl">
          {percentage === 100 && (
            <p className="text-gray-700 font-semibold">You're a multiplication master! 👑</p>
          )}
          {percentage >= 80 && percentage < 100 && (
            <p className="text-gray-700 font-semibold">Outstanding performance! Keep it up!</p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p className="text-gray-700 font-semibold">Nice work! Practice makes perfect!</p>
          )}
          {percentage >= 40 && percentage < 60 && (
            <p className="text-gray-700 font-semibold">Good start! Practice more to improve!</p>
          )}
          {percentage < 40 && (
            <p className="text-gray-700 font-semibold">Don't give up! Try again and you'll do better!</p>
          )}
        </div>

        {/* Play Again Button */}
        <button
          ref={playAgainButtonRef}
          onClick={onPlayAgain}
          onKeyPress={handleKeyPress}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          🎮 Play Again
        </button>
      </div>
    </div>
  );
};

// Feedback popup component - celebrates correct answers
const Feedback = ({ isCorrect, message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 1800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-6 rounded-2xl text-white text-2xl font-bold shadow-2xl z-50 ${
        isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-yellow-400 to-orange-400'
      }`}
      style={{
        animation: `${isCorrect ? 'successPop' : 'wrongBounce'} 0.6s ease-out`,
      }}
    >
      {isCorrect ? '🎉' : '✨'} {message}
    </div>
  );
};

// Dual Handle Range Slider Component
const DualRangeSlider = ({ min, max, onChange }) => {
  const handleMinChange = (value) => {
    const newMin = parseInt(value);
    // Prevent 0×0 - if setting min to 0, max must be at least 1
    const newMax = newMin === 0 && max === 0 ? 1 : max;
    const finalMin = Math.min(newMin, newMax);
    onChange({ min: finalMin, max: newMax });
  };

  const handleMaxChange = (value) => {
    const newMax = parseInt(value);
    // Prevent 0×0 - if setting max to 0, min must be at least 1
    const newMin = newMax === 0 && min === 0 ? 1 : min;
    const finalMax = Math.max(newMax, newMin);
    onChange({ min: newMin, max: finalMax });
  };

  return (
    <div className="relative py-8 px-2">
      {/* Value Labels at Top */}
      <div className="flex justify-between mb-6 px-2 text-sm font-bold">
        <span className="text-blue-600">{min}</span>
        <span className="text-gray-400">—</span>
        <span className="text-pink-600">{max}</span>
      </div>

      {/* Slider Container */}
      <div className="relative h-8 flex items-center">
        {/* Visual Track Background */}
        <div className="absolute left-0 right-0 h-2 bg-gray-300 rounded-full pointer-events-none"></div>

        {/* Active Range Highlight */}
        <div
          className="absolute h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full pointer-events-none transition-all"
          style={{
            left: `${(min / 12) * 100}%`,
            right: `${100 - (max / 12) * 100}%`,
          }}
        ></div>

        {/* Min Range Input */}
        <input
          type="range"
          min="0"
          max="12"
          value={min}
          onChange={(e) => handleMinChange(e.target.value)}
          className="absolute w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer thumb thumb-left"
          style={{ zIndex: min > 6 ? 5 : 3 }}
        />

        {/* Max Range Input */}
        <input
          type="range"
          min="0"
          max="12"
          value={max}
          onChange={(e) => handleMaxChange(e.target.value)}
          className="absolute w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer thumb thumb-right"
          style={{ zIndex: max > 6 ? 5 : 4 }}
        />
      </div>

      {/* Track Labels */}
      <div className="flex justify-between mt-6 px-2 text-xs text-gray-500">
        <span>0</span>
        <span>6</span>
        <span>12</span>
      </div>
    </div>
  );
};

// Settings Panel Component
const SettingsPanel = ({ minMultiplier, maxMultiplier, onMinMultiplierChange, onMaxMultiplierChange, onClose }) => {
  const handleRangeChange = ({ min, max }) => {
    // Prevent 0×0 combination
    if (min === 0 && max === 0) {
      onMinMultiplierChange(0);
      onMaxMultiplierChange(1);
    } else {
      onMinMultiplierChange(min);
      onMaxMultiplierChange(max);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Range Slider Section */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-4 text-center">
            Multiplication Range
          </label>

          {/* Custom Range Sliders */}
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <p className="text-gray-600 text-sm text-center mb-4">Current: <span className="font-bold text-purple-600">{minMultiplier} - {maxMultiplier}</span></p>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="0"
                max="10"
                value={minMultiplier}
                onChange={(e) => {
                  const newMin = Math.min(parseInt(e.target.value), maxMultiplier);
                  handleRangeChange({ min: newMin, max: maxMultiplier });
                }}
                className="flex-1 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 min-w-12">Min: {minMultiplier}</span>
            </div>
            <div className="flex gap-2 items-center mt-3">
              <input
                type="range"
                min="0"
                max="10"
                value={maxMultiplier}
                onChange={(e) => {
                  const newMax = Math.max(parseInt(e.target.value), minMultiplier);
                  handleRangeChange({ min: minMultiplier, max: newMax });
                }}
                className="flex-1 h-2 bg-pink-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 min-w-12">Max: {maxMultiplier}</span>
            </div>
          </div>
        </div>

        {/* Quick Preset Ranges */}
        <div className="mb-8">
          <p className="text-gray-700 font-semibold text-sm mb-3">Quick Presets:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '0 - 5 Easy', min: 0, max: 5 },
              { label: '2 - 10 Normal', min: 2, max: 10 },
              { label: '5 - 10 Hard', min: 5, max: 10 },
              { label: '0 - 10 Expert', min: 0, max: 10 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleRangeChange({ min: preset.min, max: preset.max })}
                className={`py-2 px-3 rounded-lg font-bold transition-all text-xs md:text-sm ${
                  minMultiplier === preset.min && maxMultiplier === preset.max
                    ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
        >
          ✓ Done
        </button>
      </div>
    </div>
  );
};

// Welcome Screen Component
const WelcomeScreen = ({ onStartGame }) => {
  const [selectedExercises, setSelectedExercises] = useState(10);
  const [customExercises, setCustomExercises] = useState('');
  const [minMultiplier, setMinMultiplier] = useState(0);
  const [maxMultiplier, setMaxMultiplier] = useState(10);

  const exerciseOptions = [5, 10, 15, 20];
  const difficultyPresets = [
    { label: '0 - 5 Easy', min: 0, max: 5 },
    { label: '2 - 10 Normal', min: 2, max: 10 },
    { label: '5 - 10 Hard', min: 5, max: 10 },
    { label: '0 - 10 Expert', min: 0, max: 10 },
  ];

  const handleStart = () => {
    const numExercises = customExercises && parseInt(customExercises) > 0 ? parseInt(customExercises) : selectedExercises;
    onStartGame(numExercises, minMultiplier, maxMultiplier);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-10 blur-3xl animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-300 rounded-full opacity-10 blur-3xl animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-blue-300 rounded-full opacity-10 blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Welcome Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full my-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Multiplication Master
          </h1>
          <p className="text-gray-600 text-lg">Customize your practice session</p>
        </div>

        {/* Exercise Selection */}
        <div className="mb-8">
          <p className="text-gray-700 font-semibold mb-3 text-center">Number of Exercises:</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {exerciseOptions.map((num) => (
              <button
                key={num}
                onClick={() => {
                  setSelectedExercises(num);
                  setCustomExercises('');
                }}
                className={`py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedExercises === num && customExercises === ''
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Custom Exercise Input */}
          <input
            type="number"
            min="1"
            max="100"
            value={customExercises}
            onChange={(e) => {
              setCustomExercises(e.target.value);
              if (e.target.value) setSelectedExercises(0);
            }}
            placeholder="Or enter custom (1-100)"
            className="w-full px-4 py-2 text-center text-sm font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <p className="text-gray-700 font-semibold mb-3 text-center">Difficulty (Multiplication Range):</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {difficultyPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setMinMultiplier(preset.min);
                  setMaxMultiplier(preset.max);
                }}
                className={`py-2 px-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 ${
                  minMultiplier === preset.min && maxMultiplier === preset.max
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Range Slider */}
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <p className="text-gray-600 text-sm text-center mb-3">Custom Range: <span className="font-bold text-purple-600">{minMultiplier} - {maxMultiplier}</span></p>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="0"
                max="10"
                value={minMultiplier}
                onChange={(e) => {
                  const newMin = Math.min(parseInt(e.target.value), maxMultiplier);
                  setMinMultiplier(newMin);
                }}
                className="flex-1 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 min-w-12">Min: {minMultiplier}</span>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="range"
                min="0"
                max="10"
                value={maxMultiplier}
                onChange={(e) => {
                  const newMax = Math.max(parseInt(e.target.value), minMultiplier);
                  setMaxMultiplier(newMax);
                }}
                className="flex-1 h-2 bg-pink-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 min-w-12">Max: {maxMultiplier}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-6 text-center">
          <p className="text-gray-700 text-sm">
            <strong className="text-purple-600">{customExercises && parseInt(customExercises) > 0 ? parseInt(customExercises) : selectedExercises}</strong> exercises
            <br />
            <strong className="text-blue-600">{minMultiplier} to {maxMultiplier}</strong> multiplication range
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 text-lg"
        >
          ✨ Start Game
        </button>

        {/* Info */}
        <p className="text-center text-gray-500 text-xs mt-6">
          You can adjust difficulty anytime during the game ⚙️
        </p>
      </div>
    </div>
  );
};

// Main Game Component
export default function App() {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userInputs, setUserInputs] = useState({ factor1: '', factor2: '', result: '' });
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [errors, setErrors] = useState({ factor1: false, factor2: false, result: false });
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [minMultiplier, setMinMultiplier] = useState(0);
  const [maxMultiplier, setMaxMultiplier] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [totalExercises, setTotalExercises] = useState(10);
  const [focusedInput, setFocusedInput] = useState(null);
  const lastFocusedInputRef = React.useRef(null);

  // Ref for first input field (factor1)
  const factor1InputRef = React.useRef(null);

  // Start game function
  const startGame = (numExercises, minMult, maxMult) => {
    setTotalExercises(numExercises);
    setMinMultiplier(minMult);
    setMaxMultiplier(maxMult);
    setScore(0);
    setExerciseCount(0);
    setIsGameFinished(false);
    setUserInputs({ factor1: '', factor2: '', result: '' });
    setErrors({ factor1: false, factor2: false, result: false });
    setFeedback(null);
    setShowWelcome(false);
    generateExerciseWithRange(minMult, maxMult);
  };

  // Generate random multiplication exercise with explicit min/max parameters
  const generateExerciseWithRange = (minMult, maxMult) => {
    const range = maxMult - minMult + 1;
    let factor1 = Math.floor(Math.random() * range) + minMult;
    // Ensure factor1 is never 0 (rows must have at least 1 group)
    if (factor1 === 0) {
      factor1 = 1;
    }
    // Ensure factor1 stays within bounds
    factor1 = Math.max(minMult, Math.min(factor1, maxMult));

    const factor2 = Math.floor(Math.random() * range) + minMult;
    const newTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

    setCurrentExercise({ factor1, factor2 });
    setCurrentTheme(newTheme);
    setUserInputs({ factor1: '', factor2: '', result: '' });
    setErrors({ factor1: false, factor2: false, result: false });
  };

  // Generate random multiplication exercise based on min and max multiplier
  const generateExercise = useCallback(() => {
    generateExerciseWithRange(minMultiplier, maxMultiplier);
  }, [minMultiplier, maxMultiplier]);

  // Initialize game on mount
  useEffect(() => {
    generateExercise();
  }, [generateExercise]);

  // Auto-focus on first input when exercise changes
  useEffect(() => {
    if (currentExercise && factor1InputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        factor1InputRef.current?.focus();
        factor1InputRef.current?.select();
      }, 100);
    }
  }, [currentExercise]);

  // Handle input change
  const handleInputChange = (field, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      setUserInputs((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Keypad handlers
  const handleKeypadNumber = (num) => {
    const inputField = lastFocusedInputRef.current;
    if (!inputField) return;
    const currentValue = userInputs[inputField];
    const newValue = currentValue + num;
    handleInputChange(inputField, newValue);
  };

  const handleKeypadBackspace = () => {
    const inputField = lastFocusedInputRef.current;
    if (!inputField) return;
    const currentValue = userInputs[inputField];
    handleInputChange(inputField, currentValue.slice(0, -1));
  };

  const handleKeypadClear = () => {
    const inputField = lastFocusedInputRef.current;
    if (!inputField) return;
    handleInputChange(inputField, '');
  };

  // Validate and submit answer
  const handleSubmit = () => {
    if (!currentExercise) return;

    const { factor1, factor2, result } = userInputs;
    const correctResult = currentExercise.factor1 * currentExercise.factor2;
    const f1 = factor1 !== '' ? parseInt(factor1) : null;
    const f2 = factor2 !== '' ? parseInt(factor2) : null;

    let newErrors = { factor1: false, factor2: false, result: false };

    // Check if factors are valid and present
    if (factor1 === '' || factor2 === '') {
      if (factor1 === '') newErrors.factor1 = true;
      if (factor2 === '') newErrors.factor2 = true;
    } else {
      // Check if factors match in either order (commutative property)
      const correctOrder = (f1 === currentExercise.factor1 && f2 === currentExercise.factor2);
      const reverseOrder = (f1 === currentExercise.factor2 && f2 === currentExercise.factor1);

      if (!correctOrder && !reverseOrder) {
        newErrors.factor1 = true;
        newErrors.factor2 = true;
      }
    }

    // Check result
    if (result === '' || parseInt(result) !== correctResult) {
      newErrors.result = true;
    }

    setErrors(newErrors);

    // Check if all correct
    if (!newErrors.factor1 && !newErrors.factor2 && !newErrors.result) {
      setFeedback({ isCorrect: true, message: 'Perfect! 🌟' });
      setScore((prev) => prev + 1);
      setExerciseCount((prev) => {
        const newCount = prev + 1;
        // Check if game is finished
        if (newCount >= totalExercises) {
          setTimeout(() => {
            setIsGameFinished(true);
            setFeedback(null);
          }, 1800);
        } else {
          setTimeout(() => {
            generateExercise();
            setFeedback(null);
          }, 1800);
        }
        return newCount;
      });
    } else {
      setFeedback({ isCorrect: false, message: 'Try again! 💪' });
      setExerciseCount((prev) => {
        const newCount = prev + 1;
        // Check if game is finished (user ran out of attempts)
        if (newCount >= totalExercises) {
          setTimeout(() => {
            setIsGameFinished(true);
            setFeedback(null);
          }, 1800);
        }
        return newCount;
      });
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Play again - show welcome screen
  const playAgain = () => {
    setShowWelcome(true);
  };

  // Show welcome screen if needed
  if (showWelcome) {
    return <WelcomeScreen onStartGame={startGame} />;
  }

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: currentTheme.colors.bg }}>
      {/* Global animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        @keyframes successPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes wrongBounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          25% { transform: translate(-50%, -50%) scale(0.95) rotate(-2deg); }
          75% { transform: translate(-50%, -50%) scale(0.95) rotate(2deg); }
        }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.98; }
        }

        .animate-shake {
          animation: shake 0.5s;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        /* Slider Styling */
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid #a855f7;
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid #a855f7;
          transition: all 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .slider::-moz-range-track {
          background: transparent;
          border: none;
        }

        /* Dual Range Slider Styling */
        .thumb {
          -webkit-appearance: none;
          appearance: none;
        }

        .thumb::-webkit-slider-runnable-track {
          background: transparent;
          border: none;
          height: 2px;
        }

        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
          border: 3px solid #3b82f6;
          pointer-events: auto;
          touch-action: none;
          transition: all 0.3s ease;
          margin-top: -13px;
        }

        .thumb-left::-webkit-slider-thumb:hover {
          background: #e0f2fe;
          border-color: #0284c7;
          transform: scale(1.2);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.5);
        }

        .thumb-right::-webkit-slider-thumb {
          border-color: #ec4899;
        }

        .thumb-right::-webkit-slider-thumb:hover {
          background: #fce7f3;
          border-color: #be185d;
          transform: scale(1.2);
          box-shadow: 0 5px 15px rgba(236, 72, 153, 0.5);
        }

        /* Firefox */
        .thumb::-moz-range-track {
          background: transparent;
          border: none;
          height: 2px;
        }

        .thumb::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
          border: 3px solid #3b82f6;
          pointer-events: auto;
          touch-action: none;
          transition: all 0.3s ease;
        }

        .thumb-left::-moz-range-thumb:hover {
          background: #e0f2fe;
          border-color: #0284c7;
          transform: scale(1.2);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.5);
        }

        .thumb-right::-moz-range-thumb {
          border-color: #ec4899;
        }

        .thumb-right::-moz-range-thumb:hover {
          background: #fce7f3;
          border-color: #be185d;
          transform: scale(1.2);
          box-shadow: 0 5px 15px rgba(236, 72, 153, 0.5);
        }
      `}</style>

      {/* Header - Single Row Dashboard */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Single Row Flex Layout */}
          <div className="flex items-center justify-between gap-4 md:gap-6">

            {/* Left: Game Title */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold whitespace-nowrap">
                🎮 Multiplication Master
              </h1>
            </div>

            {/* Center/Right-Center: Stats Badges */}
            <div className="flex items-center gap-3 md:gap-4 flex-grow justify-center px-4">
              {/* Score Badge */}
              <div className="bg-white bg-opacity-20 backdrop-blur px-3 md:px-4 py-2 rounded-xl hover:bg-opacity-30 transition-all text-center min-w-fit">
                <p className="text-xs opacity-75 font-medium">Score</p>
                <p className="text-xl md:text-2xl font-bold">{score}/{totalExercises}</p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-white bg-opacity-20"></div>

              {/* Theme Badge */}
              <div className="bg-white bg-opacity-20 backdrop-blur px-3 md:px-4 py-2 rounded-xl hover:bg-opacity-30 transition-all text-center min-w-fit">
                <p className="text-xs opacity-75 font-medium">Theme</p>
                <p className="text-sm md:text-base font-semibold truncate">{currentTheme.name}</p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-white bg-opacity-20"></div>

              {/* Range Badge */}
              <div className="bg-white bg-opacity-20 backdrop-blur px-3 md:px-4 py-2 rounded-xl hover:bg-opacity-30 transition-all text-center min-w-fit">
                <p className="text-xs opacity-75 font-medium">Range</p>
                <p className="text-sm md:text-base font-semibold">{minMultiplier}-{maxMultiplier}</p>
              </div>
            </div>

            {/* Right: Settings Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                title="Settings"
                aria-label="Open settings"
              >
                <span className="text-2xl">⚙️</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Grid Layout: Visual Left, Input Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
          {/* Visual Representation - Left */}
          <div className="flex justify-center md:justify-end">
            <VisualGrid
              rows={currentExercise.factor1}
              cols={currentExercise.factor2}
              theme={currentTheme}
            />
          </div>

          {/* Input Section - Right */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <p className="text-gray-600 text-sm md:text-base mb-4 font-semibold text-center">Fill in the numbers:</p>

            {/* Input Container - Vertical Layout */}
            <div className="flex flex-col items-center gap-3">
              {/* Row 1: Factor1 × Factor2 */}
              <div className="flex items-center justify-center gap-2">
                <InputField
                  ref={factor1InputRef}
                  value={userInputs.factor1}
                  onChange={(val) => handleInputChange('factor1', val)}
                  placeholder="?"
                  error={errors.factor1}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    setFocusedInput('factor1');
                    lastFocusedInputRef.current = 'factor1';
                  }}
                  onBlur={() => setFocusedInput(null)}
                  minValue={minMultiplier}
                  maxValue={maxMultiplier}
                />
                <span className="text-2xl md:text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
                  ×
                </span>
                <InputField
                  value={userInputs.factor2}
                  onChange={(val) => handleInputChange('factor2', val)}
                  placeholder="?"
                  error={errors.factor2}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    setFocusedInput('factor2');
                    lastFocusedInputRef.current = 'factor2';
                  }}
                  onBlur={() => setFocusedInput(null)}
                  minValue={minMultiplier}
                  maxValue={maxMultiplier}
                />
              </div>

              {/* Row 2: Equals */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl md:text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
                  =
                </span>
              </div>

              {/* Row 3: Result */}
              <div className="flex items-center justify-center gap-2">
                <InputField
                  value={userInputs.result}
                  onChange={(val) => handleInputChange('result', val)}
                  placeholder="?"
                  error={errors.result}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    setFocusedInput('result');
                    lastFocusedInputRef.current = 'result';
                  }}
                  onBlur={() => setFocusedInput(null)}
                  minValue={minMultiplier * minMultiplier}
                  maxValue={maxMultiplier * maxMultiplier}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="mt-4 px-8 py-2 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95 w-full"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                }}
              >
                ✓ Check
              </button>

              {/* Hint */}
              <p className="text-gray-500 text-xs md:text-sm mt-3 font-medium text-center">
                💡 Count groups and items!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Feedback Modal */}
      {feedback && (
        <Feedback
          isCorrect={feedback.isCorrect}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          minMultiplier={minMultiplier}
          maxMultiplier={maxMultiplier}
          onMinMultiplierChange={setMinMultiplier}
          onMaxMultiplierChange={setMaxMultiplier}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Game Over Screen */}
      {isGameFinished && (
        <GameOverScreen
          score={score}
          totalExercises={totalExercises}
          onPlayAgain={playAgain}
        />
      )}

      {/* Custom Numeric Keypad */}
      <NumericKeypad
        isVisible={focusedInput !== null && !isGameFinished}
        onNumberClick={handleKeypadNumber}
        onBackspace={handleKeypadBackspace}
        onClear={handleKeypadClear}
      />
    </div>
  );
}
