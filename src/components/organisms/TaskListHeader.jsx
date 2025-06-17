import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';

const TaskListHeader = ({ 
  title = "All Tasks",
  onSearch,
  onAddTask,
  filters,
  onFilterChange,
  categories = [],
  taskCount = 0
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(filters || {}).some(filterArray => 
    Array.isArray(filterArray) && filterArray.length > 0
  );

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              icon={<ApperIcon name="Filter" className="w-4 h-4" />}
              className={hasActiveFilters ? 'border-primary text-primary' : ''}
            >
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={onAddTask}
              icon={<ApperIcon name="Plus" className="w-4 h-4" />}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search tasks..."
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={false}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <FilterBar
          activeFilters={filters || {}}
          onFilterChange={onFilterChange}
          categories={categories}
        />
      </motion.div>
    </div>
  );
};

export default TaskListHeader;