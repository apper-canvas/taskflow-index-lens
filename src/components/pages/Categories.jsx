import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import EmptyState from '@/components/organisms/EmptyState';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import { categoryService, taskService } from '@/services';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    color: '#5B4FE5',
    icon: 'Folder'
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      setCategories(categoriesData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', color: '#5B4FE5', icon: 'Folder' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.Id, formData);
        setCategories(prev => prev.map(cat => 
          cat.Id === updated.Id ? updated : cat
        ));
        toast.success('Category updated successfully!');
      } else {
        const created = await categoryService.create(formData);
        setCategories(prev => [...prev, created]);
        toast.success('Category created successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.delete(categoryId);
        setCategories(prev => prev.filter(cat => cat.Id !== categoryId));
        toast.success('Category deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

const getTaskCount = (categoryId) => {
    return tasks.filter(task => task.category_id === categoryId).length;
  };

  const colorOptions = [
    { value: '#5B4FE5', label: 'Purple' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#EF4444', label: 'Red' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#8B5CF6', label: 'Violet' },
    { value: '#F97316', label: 'Orange' },
    { value: '#06B6D4', label: 'Cyan' }
  ];

  const iconOptions = [
    { value: 'Folder', label: 'Folder' },
    { value: 'Briefcase', label: 'Briefcase' },
    { value: 'Code', label: 'Code' },
    { value: 'Heart', label: 'Heart' },
    { value: 'DollarSign', label: 'Dollar Sign' },
    { value: 'Home', label: 'Home' },
    { value: 'Book', label: 'Book' },
    { value: 'Target', label: 'Target' }
  ];

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your tasks</p>
        </div>
        <LoadingState count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your tasks</p>
        </div>
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          icon={<ApperIcon name="Plus" className="w-4 h-4" />}
        >
          Add Category
        </Button>
      </div>

      {/* Category Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm"
          >
            <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  options={colorOptions}
                />

                <Select
                  label="Icon"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  options={iconOptions}
                />
              </div>

              {/* Preview */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  <ApperIcon name={formData.icon} className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  {formData.name || 'Category Preview'}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!formData.name.trim()}
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category to organize your tasks better"
          actionLabel="Create Category"
          onAction={() => setShowForm(true)}
          icon="FolderOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {categories.map((category) => (
              <motion.div
                key={category.Id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      <ApperIcon name={category.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {category.name}
</h3>
                      <p className="text-sm text-gray-500">
                        {getTaskCount(category.Id)} tasks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="p-1.5"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.Id)}
                      className="p-1.5 text-gray-400 hover:text-error"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: category.color,
                      width: `${Math.min((getTaskCount(category.Id) / Math.max(tasks.length, 1)) * 100, 100)}%`
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Categories;