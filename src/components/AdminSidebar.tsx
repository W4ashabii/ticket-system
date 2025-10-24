'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Ticket,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: Calendar,
      description: 'Manage events'
    },
    {
      name: 'Create Event',
      href: '/admin/events/new',
      icon: Plus,
      description: 'Add new event'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Reports and insights'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'User management'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System settings'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    })
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-ultra-light)]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-[var(--bg-overlay)] z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed left-0 top-0 h-full bg-[var(--bg-elevated)] border-r border-[var(--border-ultra-light)] z-50
          ${isCollapsed ? 'lg:w-20' : 'lg:w-70'}
          ${isMobileMenuOpen ? 'w-70' : 'w-0 lg:w-auto'}
          overflow-hidden transition-all duration-300
        `}
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-ultra-light)]">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Ticket className="h-8 w-8 text-[var(--text-primary)]" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)] gradient-text">
                      TicketHub
                    </h1>
                    <p className="text-xs text-[var(--text-quaternary)]">Admin Panel</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={onToggle}
                  className="hidden lg:block p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="h-4 w-4 text-[var(--text-primary)]" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`
                        flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-lg' 
                          : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                        }
                      `}
                      whileHover={{ 
                        scale: 1.02,
                        x: 4,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                      </motion.div>
                      
                      {!isCollapsed && (
                        <motion.div
                          className="flex-1 min-w-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <p className="font-semibold truncate">{item.name}</p>
                          <p className="text-xs opacity-70 truncate">{item.description}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border-ultra-light)]">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-300 group"
              whileHover={{ 
                scale: 1.02,
                x: 4,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-5 w-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              {!isCollapsed && (
                <motion.span
                  className="font-semibold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
