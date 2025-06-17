import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilterBar = ({ 
  activeFilters, 
  onFilterChange, 
  categories = [],
  className = '' 
}) => {
  const priorityFilters = [
    { value: 'high', label: 'High Priority', color: 'bg-priority-high' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-priority-medium' },
    { value: 'low', label: 'Low Priority', color: 'bg-priority-low' }
  ];

  const statusFilters = [
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { value: 'overdue', label: 'Overdue', icon: 'AlertCircle' }
  ];

  const handleFilterToggle = (filterType, value) => {
    const currentFilters = activeFilters[filterType] || [];
    const isActive = currentFilters.includes(value);
    
    const newFilters = isActive
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange({
      ...activeFilters,
      [filterType]: newFilters
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(activeFilters).some(filters => 
    Array.isArray(filters) && filters.length > 0
  );

  const FilterPill = ({ isActive, onClick, children, className: pillClassName = '' }) => (
    <motion.button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${pillClassName}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );

  return (
    <div className={`bg-white border-b border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            icon={<ApperIcon name="X" className="w-4 h-4" />}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Priority Filters */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Priority</h4>
          <div className="flex flex-wrap gap-2">
            {priorityFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                isActive={activeFilters.priority?.includes(filter.value)}
                onClick={() => handleFilterToggle('priority', filter.value)}
              >
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2 h-2 rounded-full ${filter.color}`} />
                  <span>{filter.label}</span>
                </div>
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                isActive={activeFilters.status?.includes(filter.value)}
                onClick={() => handleFilterToggle('status', filter.value)}
              >
                <div className="flex items-center space-x-1.5">
                  <ApperIcon name={filter.icon} className="w-3 h-3" />
                  <span>{filter.label}</span>
                </div>
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <FilterPill
                  key={category.Id}
                  isActive={activeFilters.category?.includes(category.Id.toString())}
                  onClick={() => handleFilterToggle('category', category.Id.toString())}
                >
                  <div className="flex items-center space-x-1.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate max-w-20">{category.name}</span>
                  </div>
                </FilterPill>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;