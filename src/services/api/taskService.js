import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(300);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      order: tasks.length
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      Id: tasks[index].Id // Prevent Id modification
    };
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  },

  async getCompleted() {
    await delay(250);
    return tasks.filter(t => t.completed).map(t => ({ ...t }));
  },

  async toggleComplete(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    task.completed = !task.completed;
    return { ...task };
  },

  async reorder(taskId, newOrder) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(taskId, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    task.order = newOrder;
    return { ...task };
  }
};

export default taskService;