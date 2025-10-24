'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import { eventsStore } from '@/services/events';

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

export default function Home() {
  const [events, setEvents] = useState<Event[]>(eventsStore.getAll());
  const [loading, setLoading] = useState(events.length === 0);

  useEffect(() => {
    const unsubscribe = eventsStore.subscribe((list) => {
      setEvents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableTickets = (event: Event) => {
    return event.maxTickets - event.soldTickets;
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.header 
        className="border-b border-gray-200"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 120, 
          damping: 20,
          mass: 0.8
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Ticket className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold text-black">TicketHub</h1>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-black hover:text-gray-600 transition-colors">
                Events
              </Link>
              <Link href="/admin" className="text-black hover:text-gray-600 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      <motion.section 
        className="py-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 80, 
          damping: 20,
          mass: 1,
          delay: 0.2
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-black mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              delay: 0.4
            }}
          >
            Discover Amazing Events
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 15,
              delay: 0.6
            }}
          >
            Book tickets for the best events in town with our seamless eSewa integration
          </motion.p>
        </div>
      </motion.section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h3 
            className="text-3xl font-bold text-black text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15
            }}
            viewport={{ once: true }}
          >
            Upcoming Events
          </motion.h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 will-change-transform"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }
                  }}
                >
                  {event.image ? (
                    <div className="h-52 relative overflow-hidden">
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
                      <span className="text-sm text-gray-500">
                        {getAvailableTickets(event)} tickets left
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      {event.title}
                    </h4>
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
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-black">
                        NPR {event.price}
                      </span>
                      <Link href={`/events/${event.id}`}>
                        <motion.button
                          className="bg-black text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors btn-hover"
                          whileHover={{ 
                            scale: 1.05,
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                          }}
                          whileTap={{ 
                            scale: 0.95,
                            transition: { type: "spring", stiffness: 400, damping: 25 }
                          }}
                        >
                          <span>Book Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <motion.footer 
        className="bg-black text-white py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 80, 
          damping: 20
        }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Ticket className="h-6 w-6" />
              <span className="text-lg font-bold">TicketHub</span>
            </div>
            <p className="text-gray-400">
              © 2024 TicketHub. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
