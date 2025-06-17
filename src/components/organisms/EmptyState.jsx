import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = "No tasks yet",
  description = "Create your first task to get started with TaskFlow",
  actionLabel = "Add Your First Task",
  onAction,
  icon = "CheckSquare",
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
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6"
        variants={iconVariants}
        animate={["animate", "float"]}
      >
        <ApperIcon name={icon} className="w-10 h-10 text-white" />
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
        {description}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onAction}
            icon={<ApperIcon name="Plus" className="w-5 h-5" />}
            className="shadow-lg"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-secondary/30 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 3
          }}
        />
      </div>
    </motion.div>
  );
};

export default EmptyState;