import { motion } from 'framer-motion';

const PriorityPill = ({ priority, size = 'sm', className = '' }) => {
  const priorities = {
    high: {
      label: 'High',
      color: 'bg-priority-high text-white',
      dotColor: 'bg-red-600'
    },
    medium: {
      label: 'Medium', 
      color: 'bg-priority-medium text-white',
      dotColor: 'bg-amber-600'
    },
    low: {
      label: 'Low',
      color: 'bg-priority-low text-white',
      dotColor: 'bg-green-600'
    }
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const config = priorities[priority] || priorities.medium;

  return (
    <motion.span
      className={`inline-flex items-center space-x-1.5 rounded-full font-medium ${config.color} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </motion.span>
  );
};

export default PriorityPill;