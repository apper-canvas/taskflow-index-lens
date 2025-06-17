import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label,
  error,
  type = 'text',
  placeholder,
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

  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${error ? 'border-error' : 'border-gray-300'}
    ${error ? 'focus:ring-error/50 focus:border-error' : ''}
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
      
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        placeholder={!label ? placeholder : ''}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      
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

Input.displayName = 'Input';

export default Input;