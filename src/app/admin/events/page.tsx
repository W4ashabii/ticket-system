'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Edit, Trash2, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Event } from '@/types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
    date: '2024-03-15',
    time: '09:00',
    venue: 'Convention Center, Kathmandu',
    price: 2500,
    maxTickets: 500,
    soldTickets: 320,
    category: 'Technology',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Music Festival',
    description: 'Experience the best of local and international music in this spectacular festival.',
    date: '2024-04-20',
    time: '18:00',
    venue: 'Tundikhel Ground, Kathmandu',
    price: 1500,
    maxTickets: 2000,
    soldTickets: 1200,
    category: 'Music',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    title: 'Art Exhibition',
    description: 'Contemporary art exhibition featuring works from emerging and established artists.',
    date: '2024-03-25',
    time: '10:00',
    venue: 'Nepal Art Gallery, Patan',
    price: 500,
    maxTickets: 200,
    soldTickets: 180,
    category: 'Art',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>(() => {
    return JSON.parse(localStorage.getItem("events") || "null") || mockEvents;
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'sold_out'>('all');

  useEffect(() => {
    setTimeout(() => {
      const storedEvents =JSON.parse(localStorage.getItem("events") || "null");
      if (!storedEvents) {
        localStorage.setItem("events", JSON.stringify(mockEvents));
        setEvents(mockEvents);
      } else {
        setEvents(storedEvents);
      }
      setLoading(false);
    }, 1000)

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
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    }
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.header 
        className="border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <motion.button
                  className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
                  whileHover={{ x: -5 }}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-gray-400" />
                </div>
                
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      className="flex-1 bg-blue-100 text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
