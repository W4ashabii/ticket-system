'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Ticket, 
  Eye,
  BarChart3,
  Activity,
  Plus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { eventsStore } from '@/services/events';
import { Event } from '@/types';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = eventsStore.subscribe((list) => {
      setEvents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalSales = events.reduce((sum, e) => sum + e.soldTickets * e.price, 0);
  const totalTickets = events.reduce((sum, e) => sum + e.soldTickets, 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.maxTickets, 0);
  const occupancyRate = totalCapacity > 0 ? (totalTickets / totalCapacity) * 100 : 0;

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Events',
      value: activeEvents,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Sales',
      value: `NPR ${totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Tickets Sold',
      value: totalTickets.toLocaleString(),
      icon: Ticket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const recentEvents = events.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-[var(--text-tertiary)]">
          Here&apos;s what&apos;s happening with your events today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="card-elevated p-6"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <motion.span 
                  className={`text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.change}
                </motion.span>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                  {stat.value}
                </h3>
                <p className="text-[var(--text-tertiary)] text-sm">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupancy Rate */}
        <motion.div 
          className="card-elevated p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Occupancy Rate
            </h3>
            <BarChart3 className="w-5 h-5 text-[var(--text-quaternary)]" />
          </div>
          
          <div className="text-center">
            <motion.div
              className="text-4xl font-bold text-[var(--text-primary)] mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.8
              }}
            >
              {occupancyRate.toFixed(1)}%
            </motion.div>
            <p className="text-[var(--text-tertiary)]">
              Average event occupancy
            </p>
            
            <div className="mt-6 w-full bg-[var(--bg-secondary)] rounded-full h-3">
              <motion.div
                className="bg-[var(--accent-primary)] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${occupancyRate}%` }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut",
                  delay: 1
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div 
          className="card-elevated p-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Recent Events
            </h3>
            <Eye className="w-5 h-5 text-[var(--text-quaternary)]" />
          </div>
          
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">
                    {event.title}
                  </h4>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {event.soldTickets}/{event.maxTickets} tickets sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--text-primary)]">
                    NPR {event.price}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="card-elevated p-6"
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300 text-left group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-6 h-6 text-[var(--text-primary)] mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
              Create Event
            </h4>
            <p className="text-sm text-[var(--text-tertiary)]">
              Add a new event to your platform
            </p>
          </motion.button>
          
          <motion.button
            className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300 text-left group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-6 h-6 text-[var(--text-primary)] mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
              Manage Events
            </h4>
            <p className="text-sm text-[var(--text-tertiary)]">
              View and edit existing events
            </p>
          </motion.button>
          
          <motion.button
            className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300 text-left group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="w-6 h-6 text-[var(--text-primary)] mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
              View Analytics
            </h4>
            <p className="text-sm text-[var(--text-tertiary)]">
              Check detailed performance metrics
            </p>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}