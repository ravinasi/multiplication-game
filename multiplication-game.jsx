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

// Visual grid component
const VisualGrid = ({ rows, cols, theme }) => {
  return (
    <div className="flex justify-center gap-6 flex-wrap my-8 p-6 rounded-3xl" style={{ backgroundColor: theme.colors.bg }}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 p-5 rounded-2xl animate-fade-in"
          style={{
            backgroundColor: theme.colors.primary,
            opacity: 0.9,
            animation: `fadeInScale 0.6s ease-out ${rowIdx * 0.1}s both`,
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <span
              key={`${rowIdx}-${colIdx}`}
              className="text-4xl md:text-5xl animate-bounce"
              style={{
                animation: `bounce 2s ease-in-out ${rowIdx * 0.1 + colIdx * 0.05}s infinite`,
              }}
            >
              {theme.item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

// Input field component
const InputField = ({ value, onChange, placeholder, error, isResult }) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="number"
        min="1"
        max="12"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-20 md:w-24 px-4 py-3 text-xl md:text-2xl font-bold text-center rounded-xl border-3 transition-all duration-300 focus:outline-none focus:ring-4 ${
          error
            ? 'border-red-500 ring-red-300 bg-red-50 shake'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-300 bg-white'
        }`}
        style={error ? { animation: 'shake 0.5s' } : {}}
      />
    </div>
  );
};

// Feedback popup
const Feedback = ({ isCorrect, message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 1800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-6 rounded-2xl text-white text-2xl font-bold shadow-2xl z-50 animate-pulse ${
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

// Main Game Component
export default function MultiplicationGame() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userInputs, setUserInputs] = useState({ factor1: '', factor2: '', result: '' });
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [errors, setErrors] = useState({ factor1: false, factor2: false, result: false });
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);

  // Generate random multiplication exercise
  const generateExercise = useCallback(() => {
    const factor1 = Math.floor(Math.random() * 10) + 2;
    const factor2 = Math.floor(Math.random() * 10) + 2;
    const newTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

    setCurrentExercise({ factor1, factor2 });
    setCurrentTheme(newTheme);
    setUserInputs({ factor1: '', factor2: '', result: '' });
    setErrors({ factor1: false, factor2: false, result: false });
  }, []);

  // Initialize game
  useEffect(() => {
    generateExercise();
  }, [generateExercise]);

  // Handle input change
  const handleInputChange = (field, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      setUserInputs((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Validate and submit answer
  const handleSubmit = () => {
    const { factor1, factor2, result } = userInputs;
    const correctResult = currentExercise.factor1 * currentExercise.factor2;

    let newErrors = { factor1: false, factor2: false, result: false };

    // Validate inputs
    if (!factor1 || parseInt(factor1) !== currentExercise.factor1) {
      newErrors.factor1 = true;
    }
    if (!factor2 || parseInt(factor2) !== currentExercise.factor2) {
      newErrors.factor2 = true;
    }
    if (!result || parseInt(result) !== correctResult) {
      newErrors.result = true;
    }

    setErrors(newErrors);

    // Check if all correct
    if (!newErrors.factor1 && !newErrors.factor2 && !newErrors.result) {
      setFeedback({ isCorrect: true, message: 'Perfect! 🌟' });
      setScore((prev) => prev + 1);
      setTotalExercises((prev) => prev + 1);

      setTimeout(() => {
        generateExercise();
        setFeedback(null);
      }, 1800);
    } else {
      setFeedback({ isCorrect: false, message: 'Try again! 💪' });
      setTotalExercises((prev) => prev + 1);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const correctResult = currentExercise.factor1 * currentExercise.factor2;

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: currentTheme.colors.bg }}>
      {/* Styles */}
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

        .animate-fade-in {
          animation: fadeInScale 0.6s ease-out;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
            🎮 Multiplication Master
          </h1>
          <p className="text-center text-lg opacity-90">Learn multiplication the fun way!</p>

          {/* Score */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur">
              <p className="text-sm opacity-75">Score</p>
              <p className="text-3xl font-bold">{score}/{totalExercises}</p>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur">
              <p className="text-sm opacity-75">Theme</p>
              <p className="text-2xl">{currentTheme.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Visual Grid */}
        <VisualGrid
          rows={currentExercise.factor1}
          cols={currentExercise.factor2}
          theme={currentTheme}
        />

        {/* Question */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-lg mb-4">Fill in the missing numbers:</p>

          {/* Input Section */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 p-8 bg-white rounded-3xl shadow-2xl">
            {/* Factor 1 */}
            <InputField
              value={userInputs.factor1}
              onChange={(val) => handleInputChange('factor1', val)}
              placeholder="?"
              error={errors.factor1}
              onKeyPress={handleKeyPress}
            />

            {/* Multiplication symbol */}
            <span className="text-4xl md:text-5xl font-bold" style={{ color: currentTheme.colors.primary }}>
              ×
            </span>

            {/* Factor 2 */}
            <InputField
              value={userInputs.factor2}
              onChange={(val) => handleInputChange('factor2', val)}
              placeholder="?"
              error={errors.factor2}
              onKeyPress={handleKeyPress}
            />

            {/* Equals symbol */}
            <span className="text-4xl md:text-5xl font-bold" style={{ color: currentTheme.colors.primary }}>
              =
            </span>

            {/* Result */}
            <InputField
              value={userInputs.result}
              onChange={(val) => handleInputChange('result', val)}
              placeholder="?"
              error={errors.result}
              isResult={true}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-10 px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: currentTheme.colors.primary,
            }}
          >
            ✓ Check Answer
          </button>

          {/* Hint text */}
          <p className="text-gray-500 text-sm mt-6">
            💡 Hint: Count the groups and the items in each group!
          </p>
        </div>

        {/* Difficulty Info */}
        <div className="text-center text-gray-600 py-4">
          <p className="text-sm">Exercises generate numbers from 2 to 12</p>
        </div>
      </div>

      {/* Feedback Popup */}
      {feedback && (
        <Feedback
          isCorrect={feedback.isCorrect}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}
    </div>
  );
}
