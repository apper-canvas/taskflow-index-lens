import { motion } from 'framer-motion';

const LoadingState = ({ count = 3, className = '' }) => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4"
          variants={itemVariants}
        >
          <div className="flex items-start space-x-3">
            {/* Checkbox skeleton */}
            <div className="w-5 h-5 bg-gray-200 rounded border flex-shrink-0 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Title skeleton */}
              <div className="h-5 bg-gray-200 rounded-md w-3/4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                />
              </div>

              {/* Metadata skeleton */}
              <div className="flex items-center space-x-3">
                {/* Priority pill */}
                <div className="h-5 w-16 bg-gray-200 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                  />
                </div>

                {/* Category */}
                <div className="h-4 w-20 bg-gray-200 rounded relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                  />
                </div>

                {/* Due date */}
                <div className="h-4 w-16 bg-gray-200 rounded relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex space-x-1 flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingState;