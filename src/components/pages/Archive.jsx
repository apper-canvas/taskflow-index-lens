import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/organisms/EmptyState';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import { taskService, categoryService } from '@/services';

const Archive = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allTasks, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      const completed = allTasks.filter(task => task.completed);
      setCompletedTasks(completed);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load completed tasks');
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = [...completedTasks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query)
      );
    }

    // Sort by completion date (most recent first)
return filtered.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [completedTasks, searchQuery]);

  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.completed) {
      setCompletedTasks(prev => prev.map(task =>
        task.Id === updatedTask.Id ? updatedTask : task
      ));
    } else {
      // Task was uncompleted, remove from archive
      setCompletedTasks(prev => prev.filter(task => task.Id !== updatedTask.Id));
      toast.info('Task moved back to active list');
    }
  };

  const handleTaskDelete = (taskId) => {
    setCompletedTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all completed tasks? This action cannot be undone.')) {
      try {
        await Promise.all(
          completedTasks.map(task => taskService.delete(task.Id))
        );
        setCompletedTasks([]);
        toast.success('All completed tasks deleted successfully');
      } catch (error) {
        toast.error('Failed to delete completed tasks');
      }
    }
  };

  // Group tasks by completion date
  const groupedTasks = useMemo(() => {
    const groups = {};
    
filteredTasks.forEach(task => {
      const date = format(parseISO(task.created_at), 'yyyy-MM-dd');
      const displayDate = format(parseISO(task.created_at), 'MMMM d, yyyy');
      
      if (!groups[date]) {
        groups[date] = {
          displayDate,
          tasks: []
        };
      }
      groups[date].tasks.push(task);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredTasks]);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Your accomplishments</p>
        </div>
        <LoadingState count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Your accomplishments</p>
        </div>
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Completed Tasks
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} completed
            </p>
          </div>

          {completedTasks.length > 0 && (
            <Button
              variant="outline"
              size="md"
              onClick={handleClearAll}
              icon={<ApperIcon name="Trash2" className="w-4 h-4" />}
              className="text-error border-error hover:bg-error hover:text-white"
            >
              Clear All
            </Button>
          )}
        </div>

        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search completed tasks..."
        />
      </div>

      <div className="p-6">
        {filteredTasks.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No completed tasks found" : "No completed tasks yet"}
            description={
              searchQuery
                ? "Try adjusting your search to find completed tasks"
                : "Complete some tasks to see them here and celebrate your achievements!"
            }
            actionLabel="View All Tasks"
            onAction={() => window.history.back()}
            icon="Archive"
          />
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {groupedTasks.map(([dateKey, group]) => (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-display font-semibold text-gray-900">
                      {group.displayDate}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {group.tasks.map((task) => (
                        <motion.div
                          key={task.Id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TaskCard
                            task={task}
                            categories={categories}
                            onUpdate={handleTaskUpdate}
                            onDelete={handleTaskDelete}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Celebration Animation for Achievement */}
        {completedTasks.length > 0 && (
          <motion.div
            className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-4xl mb-3"
            >
              🎉
            </motion.div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              Great Job!
            </h3>
            <p className="text-gray-600">
              You've completed {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}. 
              Keep up the excellent work!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Archive;