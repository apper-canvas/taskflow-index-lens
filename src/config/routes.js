import TaskList from '@/components/pages/TaskList';
import Categories from '@/components/pages/Categories';
import Archive from '@/components/pages/Archive';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'All Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TaskList
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'FolderOpen',
    component: Categories
  },
  archive: {
    id: 'archive',
    label: 'Completed',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
};

export const routeArray = Object.values(routes);
export default routes;