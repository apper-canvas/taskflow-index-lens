import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your tasks. Please try again.",
  onRetry,
  className = ''
}) => {
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.3 }
    },
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6"
        variants={iconVariants}
        animate={["animate", "shake"]}
      >
        <ApperIcon name="AlertCircle" className="w-10 h-10 text-error" />
      </motion.div>

      <motion.h3
        className="text-xl font-display font-semibold text-gray-900 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="text-gray-500 mb-8 max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {message}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onRetry}
            icon={<ApperIcon name="RefreshCw" className="w-5 h-5" />}
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;