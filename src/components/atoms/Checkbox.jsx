import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const checkboxVariants = {
    checked: { 
      scale: 1.1,
      backgroundColor: '#5B4FE5',
      borderColor: '#5B4FE5'
    },
    unchecked: { 
      scale: 1,
      backgroundColor: '#ffffff',
      borderColor: '#D1D5DB'
    }
  };

  const checkmarkVariants = {
    checked: { 
      opacity: 1, 
      pathLength: 1,
      transition: { duration: 0.2, delay: 0.1 }
    },
    unchecked: { 
      opacity: 0, 
      pathLength: 0,
      transition: { duration: 0.1 }
    }
  };

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <motion.div
          className={`${sizes[size]} border-2 rounded flex items-center justify-center transition-all duration-200 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          variants={checkboxVariants}
          animate={checked ? 'checked' : 'unchecked'}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            variants={checkmarkVariants}
            animate={checked ? 'checked' : 'unchecked'}
          >
            <ApperIcon 
              name="Check" 
              className={`${iconSizes[size]} text-white`}
            />
          </motion.div>
        </motion.div>
        
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...props}
        />
      </div>
      
      {label && (
        <span className={`ml-3 text-sm font-medium ${
          disabled ? 'text-gray-400' : 'text-gray-700'
        }`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;