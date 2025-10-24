'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Edit, Trash2, Eye, Plus, Filter, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Event } from '@/types';
import { eventsStore } from '@/services/events';
import { AdminSidebar } from '@/components/AdminSidebar';


export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>(eventsStore.getAll());
  const [loading, setLoading] = useState(events.length === 0);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'sold_out'>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const statsY = useTransform(scrollYProgress, [0.2, 0.8], [50, -50]);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    const unsubscribe = eventsStore.subscribe((list) => {
      setEvents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailableTickets = (event: Event) => {
    return event.maxTickets - event.soldTickets;
  };


  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      eventsStore.remove(eventId);
    }
  };

  const handleEditEvent = (eventId: string) => {
    const event = eventsStore.getById(eventId);
    if (!event) return;
    setEditing({ ...event });
    setIsEditOpen(true);
  };

  const handleEditChange = (field: keyof Event, value: string | number) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value } as Event);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    // Basic validation
    if (!editing.title.trim()) return alert('Title is required');
    if (!editing.date.trim()) return alert('Date is required');
    if (!editing.time.trim()) return alert('Time is required');
    if (editing.price < 0) return alert('Price must be >= 0');
    if (editing.maxTickets <= 0) return alert('Max tickets must be > 0');

    eventsStore.update(editing.id, {
      title: editing.title,
      description: editing.description,
      date: editing.date,
      time: editing.time,
      venue: editing.venue,
      price: editing.price,
      image: editing.image,
      status: editing.status,
      maxTickets: editing.maxTickets,
    });
    setIsEditOpen(false);
    setEditing(null);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });


  const totalSales = useMemo(() => eventsStore.getTotalSales(), []);
  const totalTickets = useMemo(() => eventsStore.getTotalTicketsSold(), []);

  // Ultra-sophisticated animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1
    }
  };

  const headerVariants = {
    initial: { 
      opacity: 0, 
      y: -50,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 0.8,
        delay: 0.2
      }
    }
  };

  const statsVariants = {
    initial: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 20,
        mass: 0.8,
        delay: 0.4
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.9,
      rotateX: -10,
      filter: "blur(5px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      rotateX: 15
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-20 w-2 h-2 bg-[var(--text-quaternary)] rounded-full opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-1 h-1 bg-[var(--text-tertiary)] rounded-full opacity-30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.header 
        ref={headerRef}
        className="relative z-10 border-b border-[var(--border-ultra-light)]"
        variants={headerVariants}
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
          <div className="flex justify-between items-center py-8">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/admin">
                <motion.button
                  className="flex items-center space-x-3 text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-all duration-300 group"
                  whileHover={{ 
                    x: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <span className="font-semibold">Back to Dashboard</span>
                </motion.button>
              </Link>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <motion.h1 
                className="text-3xl font-bold text-[var(--text-primary)] gradient-text"
                whileHover={{ scale: 1.05 }}
              >
                Manage Events
              </motion.h1>
              
              <Link href="/admin/events/new">
                <motion.button
                  className="btn-primary px-6 py-3 flex items-center space-x-2 group"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <span className="font-semibold">New Event</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-70'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Edit Modal */}
        <AnimatePresence>
          {isEditOpen && editing && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="card-glass w-full max-w-2xl overflow-hidden"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="px-8 py-6 border-b border-[var(--border-ultra-light)] flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] gradient-text">Edit Event</h3>
                  <motion.button 
                    className="text-[var(--text-quaternary)] hover:text-[var(--text-primary)] transition-colors duration-300"
                    onClick={() => { setIsEditOpen(false); setEditing(null); }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>
                <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[var(--text-tertiary)] mb-2 font-semibold">Title</label>
                    <input 
                      className="w-full border border-[var(--border-medium)] rounded-lg p-3 bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all duration-300"
                      value={editing.title}
                      onChange={(e) => handleEditChange('title', e.target.value)} 
                    />
                  </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <input className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.category}
                    onChange={(e) => handleEditChange('category', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.date}
                    onChange={(e) => handleEditChange('date', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Time</label>
                  <input type="time" className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.time}
                    onChange={(e) => handleEditChange('time', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Venue</label>
                  <input className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.venue}
                    onChange={(e) => handleEditChange('venue', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea className="w-full border border-gray-300 rounded-md p-2" rows={4}
                    value={editing.description}
                    onChange={(e) => handleEditChange('description', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price (NPR)</label>
                  <input type="number" className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.price}
                    onChange={(e) => handleEditChange('price', Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Tickets</label>
                  <input type="number" className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.maxTickets}
                    onChange={(e) => handleEditChange('maxTickets', Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.status}
                    onChange={(e) => handleEditChange('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                  <input className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="/your-image.jpg"
                    value={editing.image || ''}
                    onChange={(e) => handleEditChange('image', e.target.value)} />
                </div>
              </div>
                <div className="px-8 py-6 border-t border-[var(--border-ultra-light)] flex items-center justify-end gap-4">
                  <motion.button 
                    className="btn-secondary px-6 py-3" 
                    onClick={() => { setIsEditOpen(false); setEditing(null); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    className="btn-primary px-6 py-3" 
                    onClick={handleSaveEdit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          ref={statsRef}
          className="mb-12"
          variants={statsVariants}
          style={{ y: statsY }}
        >
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {(['all', 'active', 'inactive', 'sold_out'] as const).map((status, index) => (
                <motion.button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    filter === status
                      ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] shadow-lg'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-ultra-light)]'
                  }`}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Filter className="h-4 w-4" />
                  <span>{status === 'all' ? 'All Events' : status.replace('_', ' ').toUpperCase()}</span>
                </motion.button>
              ))}
            </div>
            
            <motion.div 
              className="flex space-x-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div 
                className="text-center p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-ultra-light)]"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-[var(--text-quaternary)] mr-2" />
                  <p className="text-sm text-[var(--text-quaternary)] font-semibold">Total Sales</p>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">NPR {totalSales.toLocaleString()}</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-ultra-light)]"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-[var(--text-quaternary)] mr-2" />
                  <p className="text-sm text-[var(--text-quaternary)] font-semibold">Tickets Sold</p>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{totalTickets}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 border-4 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full"></div>
              <motion.div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[var(--text-secondary)] rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="card-interactive group"
                variants={itemVariants}
                whileHover={{ 
                  y: -15,
                  scale: 1.03,
                  rotateY: 5,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {event.image ? (
                  <div className="h-48 relative overflow-hidden">
                    <motion.div 
                      initial={{ scale: 1.0 }} 
                      whileHover={{ scale: 1.05 }} 
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 20 
                      }}
                      className="h-full w-full"
                    >
                      <Image src={event.image} alt={event.title} fill className="object-cover object-center" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-quaternary)] flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Calendar className="h-20 w-20 text-[var(--text-quaternary)]" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/60 via-transparent to-transparent"></div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <motion.span 
                      className="text-sm text-[var(--text-quaternary)] uppercase tracking-wider font-semibold"
                      whileHover={{ scale: 1.1 }}
                    >
                      {event.category}
                    </motion.span>
                    <motion.span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'active' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-medium)]' :
                        event.status === 'inactive' ? 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border border-[var(--border-light)]' :
                        'bg-[var(--bg-quaternary)] text-[var(--text-quaternary)] border border-[var(--border-ultra-light)]'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {event.status.replace('_', ' ')}
                    </motion.span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--text-secondary)] transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <p className="text-[var(--text-tertiary)] mb-6 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-[var(--text-tertiary)]">
                      <Calendar className="h-4 w-4 mr-3 text-[var(--text-quaternary)]" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-[var(--text-tertiary)]">
                      <Clock className="h-4 w-4 mr-3 text-[var(--text-quaternary)]" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-[var(--text-tertiary)]">
                      <MapPin className="h-4 w-4 mr-3 text-[var(--text-quaternary)]" />
                      {event.venue}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <motion.span 
                      className="text-2xl font-bold text-[var(--text-primary)]"
                      whileHover={{ scale: 1.1 }}
                    >
                      NPR {event.price}
                    </motion.span>
                    <span className="text-sm text-[var(--text-quaternary)] font-medium">
                      {getAvailableTickets(event)}/{event.maxTickets} tickets
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link href={`/events/${event.id}`}>
                      <motion.button
                        className="flex-1 btn-secondary py-3 px-4 flex items-center justify-center space-x-2 group"
                        whileHover={{ 
                          scale: 1.05,
                          transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                        whileTap={{ 
                          scale: 0.95,
                          transition: { type: "spring", stiffness: 400, damping: 25 }
                        }}
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold">View</span>
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      className="flex-1 btn-secondary py-3 px-4 flex items-center justify-center space-x-2 group"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <Edit className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-semibold">Edit</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 btn-secondary py-3 px-4 flex items-center justify-center space-x-2 group hover:bg-[var(--bg-quaternary)] hover:text-[var(--text-primary)]"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                    >
                      <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-semibold">Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Calendar className="h-20 w-20 text-[var(--text-quaternary)] mx-auto mb-6" />
            </motion.div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4 gradient-text">No events found</h3>
            <p className="text-[var(--text-tertiary)] mb-8 text-lg">
              {filter === 'all' 
                ? 'Create your first event to get started'
                : `No events with status "${filter}" found`
              }
            </p>
            <Link href="/admin/events/new">
              <motion.button
                className="btn-primary px-8 py-4 text-lg font-semibold"
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                Create New Event
              </motion.button>
            </Link>
          </motion.div>
        )}
        </div>
      </div>
    </motion.div>
  );
}
