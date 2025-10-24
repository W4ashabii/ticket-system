'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Edit, Trash2, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import { eventsStore } from '@/services/events';

const mockEvents: Event[] = [];

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>(eventsStore.getAll());
  const [loading, setLoading] = useState(events.length === 0);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'sold_out'>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);

  useEffect(() => {
    const unsubscribe = eventsStore.subscribe((list) => {
      setEvents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'sold_out':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        mass: 0.7
      }
    }
  };

  const totalSales = useMemo(() => eventsStore.getTotalSales(), [events]);
  const totalTickets = useMemo(() => eventsStore.getTotalTicketsSold(), [events]);

  return (
    <div className="min-h-screen bg-white">
      <motion.header 
        className="border-b border-gray-200"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 18,
          mass: 0.8
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <motion.button
                  className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
                  whileHover={{ 
                    x: -5,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </motion.button>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-black">Manage Events</h1>
              <Link href="/admin/events/new">
                <motion.button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>New Event</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Edit Modal */}
        {isEditOpen && editing && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                mass: 0.8
              }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">Edit Event</h3>
                <button className="text-gray-500 hover:text-black" onClick={() => { setIsEditOpen(false); setEditing(null); }}>✕</button>
              </div>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input className="w-full border border-gray-300 rounded-md p-2"
                    value={editing.title}
                    onChange={(e) => handleEditChange('title', e.target.value)} />
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
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200" onClick={() => { setIsEditOpen(false); setEditing(null); }}>Cancel</button>
                <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800" onClick={handleSaveEdit}>Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.2
          }}
        >
          <div className="flex space-x-4 items-center justify-between">
            <div className="flex space-x-4">
            {(['all', 'active', 'inactive', 'sold_out'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Events' : status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Sales</p>
                <p className="text-lg font-semibold">NPR {totalSales.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Tickets Sold</p>
                <p className="text-lg font-semibold">{totalTickets}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 will-change-transform"
                variants={itemVariants}
                whileHover={{ 
                  y: -6,
                  scale: 1.02,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }
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
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 uppercase tracking-wide">
                      {event.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-black">
                      NPR {event.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getAvailableTickets(event)}/{event.maxTickets} tickets
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/events/${event.id}`}>
                      <motion.button
                        className="flex-1 bg-gray-100 text-black py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                        whileHover={{ 
                          scale: 1.05,
                          transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                        whileTap={{ 
                          scale: 0.95,
                          transition: { type: "spring", stiffness: 400, damping: 25 }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      className="flex-1 bg-blue-100 text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
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
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15
            }}
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-black mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Create your first event to get started'
                : `No events with status "${filter}" found`
              }
            </p>
            <Link href="/admin/events/new">
              <motion.button
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
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
  );
}
