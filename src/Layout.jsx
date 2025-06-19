import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';
import SearchBar from '@/components/molecules/SearchBar';
import QuickAddButton from '@/components/atoms/QuickAddButton';
import ProgressRing from '@/components/atoms/ProgressRing';
import { taskService } from '@/services';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const allTasks = await taskService.getAll();
        setTasks(allTasks);
        setCompletedCount(allTasks.filter(task => task.completed).length);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, [location.pathname]);

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-surface border-b border-gray-200 z-40">
        <div className="h-full px-4 flex items-center justify-between max-w-full">
          <div className="flex items-center space-x-4 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-gray-900 truncate">
                TaskFlow
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <ProgressRing percentage={completionRate} size={32} />
            <QuickAddButton />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-gray-200 flex-col z-40">
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {Object.values(routes).map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon
                        name={route.icon}
                        className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      />
                      <span className="font-medium">{route.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Today's Progress</p>
              <div className="flex items-center justify-center space-x-2">
                <ProgressRing percentage={completionRate} size={48} />
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-900">{completionRate}%</p>
                  <p className="text-xs text-gray-500">{completedCount} of {totalTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={backdropVariants}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-gray-200 z-50 md:hidden flex flex-col"
              >
                <div className="h-16 px-4 flex items-center border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-display font-bold text-gray-900">
                      TaskFlow
                    </h1>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {Object.values(routes).map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <ApperIcon
                              name={route.icon}
                              className={`w-5 h-5 ${
                                isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                              }`}
                            />
                            <span className="font-medium">{route.label}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </nav>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Today's Progress</p>
                    <div className="flex items-center justify-center space-x-2">
                      <ProgressRing percentage={completionRate} size={48} />
                      <div className="text-left">
                        <p className="text-lg font-bold text-gray-900">{completionRate}%</p>
                        <p className="text-xs text-gray-500">{completedCount} of {totalTasks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;