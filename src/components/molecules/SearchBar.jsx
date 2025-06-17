import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch?.(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  const containerVariants = {
    focused: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blurred: { 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`relative max-w-md ${className}`}
      variants={containerVariants}
      animate={isFocused ? 'focused' : 'blurred'}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-primary' : 'text-gray-400'
            }`} 
          />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200 bg-white
            ${isFocused ? 'shadow-sm' : ''}
          `}
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;