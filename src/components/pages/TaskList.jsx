import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { parseISO, isPast, isToday } from 'date-fns';
import TaskListHeader from '@/components/organisms/TaskListHeader';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/organisms/EmptyState';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import TaskForm from '@/components/molecules/TaskForm';
import { taskService, categoryService } from '@/services';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (filters.priority?.length > 0) {
      filtered = filtered.filter(task =>
        filters.priority.includes(task.priority)
      );
    }

    // Status filter
    if (filters.status?.length > 0) {
      filtered = filtered.filter(task => {
        return filters.status.some(status => {
          switch (status) {
            case 'completed':
              return task.completed;
            case 'pending':
              return !task.completed;
            case 'overdue':
              return !task.completed && task.dueDate && isPast(parseISO(task.dueDate));
            default:
              return false;
          }
        });
      });
    }

    // Category filter
    if (filters.category?.length > 0) {
      filtered = filtered.filter(task =>
        filters.category.includes(task.categoryId?.toString())
      );
    }

    // Sort by completed status and creation date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, searchQuery, filters]);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task =>
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleTaskSave = (savedTask) => {
    if (tasks.find(task => task.Id === savedTask.Id)) {
      handleTaskUpdate(savedTask);
    } else {
      setTasks(prev => [savedTask, ...prev]);
    }
    setShowTaskForm(false);
    loadData(); // Refresh to ensure consistency
  };

  const listVariants = {
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
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <TaskListHeader 
          title="All Tasks"
          onSearch={setSearchQuery}
          onAddTask={() => setShowTaskForm(true)}
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          taskCount={0}
        />
        <div className="p-6">
          <LoadingState count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto">
        <TaskListHeader 
          title="All Tasks"
          onSearch={setSearchQuery}
          onAddTask={() => setShowTaskForm(true)}
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          taskCount={0}
        />
        <div className="p-6">
          <ErrorState 
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <TaskListHeader 
        title="All Tasks"
        onSearch={setSearchQuery}
        onAddTask={() => setShowTaskForm(true)}
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        taskCount={filteredTasks.length}
      />

      <div className="p-6">
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm"
          >
            <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Create New Task
            </h2>
            <TaskForm
              onSave={handleTaskSave}
              onCancel={() => setShowTaskForm(false)}
            />
          </motion.div>
        )}

        {filteredTasks.length === 0 ? (
          <EmptyState
            title={searchQuery || Object.keys(filters).length > 0 ? "No tasks found" : "No tasks yet"}
            description={
              searchQuery || Object.keys(filters).length > 0
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Create your first task to get started with TaskFlow"
            }
            actionLabel="Add Your First Task"
            onAction={() => setShowTaskForm(true)}
          />
        ) : (
          <motion.div
            className="space-y-4"
            variants={listVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.Id}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskList;