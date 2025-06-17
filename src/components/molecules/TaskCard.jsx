import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import PriorityPill from '@/components/atoms/PriorityPill';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';

const TaskCard = ({ task, onUpdate, onDelete, categories = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isCompleting, setIsCompleting] = useState(false);

  const category = categories.find(c => c.Id === task.categoryId);
  const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !task.completed;
  const isDueToday = dueDate && isToday(dueDate);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      onUpdate?.(updatedTask);
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    
    try {
      const updatedTask = await taskService.update(task.Id, { title: editTitle.trim() });
      onUpdate?.(updatedTask);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
      setEditTitle(task.title); // Reset on error
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        onDelete?.(task.Id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    },
    completed: {
      scale: 0.98,
      opacity: 0.6,
      transition: { duration: 0.4 }
    }
  };

  const checkboxVariants = {
    completed: { 
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg border border-gray-200 p-4 space-y-3 max-w-full overflow-hidden ${
        task.completed ? 'task-complete' : ''
      } ${isOverdue ? 'border-l-4 border-l-error' : ''}`}
      variants={cardVariants}
      initial="initial"
      animate={task.completed ? 'completed' : 'animate'}
      whileHover={!task.completed ? 'hover' : {}}
      layout
    >
      <div className="flex items-start space-x-3 min-w-0">
        <motion.div
          variants={checkboxVariants}
          animate={isCompleting ? 'completed' : 'initial'}
        >
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            size="md"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          ) : (
            <h3
              className={`font-medium text-gray-900 break-words cursor-pointer hover:text-primary transition-colors ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}

          <div className="flex items-center space-x-3 mt-2 flex-wrap">
            <PriorityPill priority={task.priority} size="xs" />
            
            {category && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs text-gray-500 truncate">
                  {category.name}
                </span>
              </div>
            )}

            {dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${
                isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-gray-500'
              }`}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>
                  {isToday(dueDate) ? 'Today' : format(dueDate, 'MMM d')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-error"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;