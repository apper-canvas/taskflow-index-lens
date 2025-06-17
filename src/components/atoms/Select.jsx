import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };
  
  const handleChange = (e) => {
    setHasValue(e.target.value);
    props.onChange?.(e);
  };

  const selectClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    appearance-none bg-white cursor-pointer
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'border-gray-300'}
    ${className}
  `;

  const labelVariants = {
    default: { 
      y: 0, 
      scale: 1, 
      color: error ? '#EF4444' : '#6B7280' 
    },
    focused: { 
      y: -28, 
      scale: 0.875, 
      color: error ? '#EF4444' : '#5B4FE5' 
    }
  };

  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <motion.label
          className="absolute left-4 top-3 pointer-events-none font-medium z-10 bg-white px-1"
          variants={labelVariants}
          animate={shouldFloat ? 'focused' : 'default'}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        >
          <option value="">{!label ? placeholder : ''}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;