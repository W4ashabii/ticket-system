'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, ArrowRight, Sparkles, ChevronDown, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import { eventsStore } from '@/services/events';

export default function Home() {
  const [events, setEvents] = useState<Event[]>(eventsStore.getAll());
  const [loading, setLoading] = useState(events.length === 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });


  const eventsY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const unsubscribe = eventsStore.subscribe((list) => {
      setEvents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);


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

  const heroVariants = {
    initial: { 
      opacity: 0, 
      y: 100,
      scale: 0.9,
      rotateX: 15
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 25,
        mass: 1,
        delay: 0.4
      }
    }
  };

  const titleVariants = {
    initial: { 
      opacity: 0, 
      y: 50,
      rotateX: 20
    },
    animate: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 20,
        mass: 0.8,
        delay: 0.6
      }
    }
  };

  const subtitleVariants = {
    initial: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 0.8,
        delay: 0.8
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.8,
      rotateY: -15,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
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
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-20 w-2 h-2 bg-[var(--text-quaternary)] rounded-full opacity-30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-1 h-1 bg-[var(--text-tertiary)] rounded-full opacity-40"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-40 w-3 h-3 bg-[var(--text-secondary)] rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        ref={heroRef}
        className="sticky top-0 z-50 border-b border-[var(--border-ultra-light)] bg-[var(--bg-primary)] backdrop-blur-sm"
        variants={headerVariants}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-20 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] pt-2">
          <div className="flex justify-between items-center py-8">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.6, ease: "easeInOut" }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Ticket className="h-12 w-12 text-[var(--text-primary)]" />
              </motion.div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)] gradient-text">
                TicketHub
              </h1>
            </motion.div>
            
            <nav className="flex space-x-8">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/" className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--text-secondary)] font-semibold transition-all duration-300 group">
                  <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Events</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/admin" className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--text-secondary)] font-semibold transition-all duration-300 group">
                  <Star className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Admin</span>
                </Link>
              </motion.div>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative py-32 text-center bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]"
        variants={heroVariants}
        style={{ y: parallaxY }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="mb-8"
            variants={floatingVariants}
            animate="animate"
          >
            <Sparkles className="h-16 w-16 text-[var(--text-primary)] mx-auto mb-6" />
          </motion.div>
          
          <motion.h2 
            className="text-6xl md:text-8xl font-bold text-[var(--text-primary)] mb-8 leading-tight"
            variants={titleVariants}
          >
            <span className="gradient-text">Discover</span>
            <br />
            <span className="text-[var(--text-secondary)]">Amazing Events</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-[var(--text-tertiary)] mb-12 max-w-4xl mx-auto leading-relaxed"
            variants={subtitleVariants}
          >
            Your premium booking partner for extraordinary experiences with seamless eSewa integration
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-8 w-8 text-[var(--text-quaternary)]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section 
        ref={eventsRef}
        className="py-24 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]"
        style={{ y: eventsY }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl font-bold text-[var(--text-primary)] mb-6 gradient-text">
              Upcoming Events
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] mx-auto rounded-full"></div>
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="card-interactive group"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -20,
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
                    <div className="h-64 relative overflow-hidden">
                      <motion.div 
                        initial={{ scale: 1.0 }} 
                        whileHover={{ scale: 1.1 }} 
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 20 
                        }}
                        className="h-full w-full"
                      >
                        <Image src={event.image} alt={event.title} fill className="object-cover object-center" />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-quaternary)] flex items-center justify-center relative overflow-hidden">
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
                        className="text-sm text-[var(--text-tertiary)] font-medium"
                        whileHover={{ scale: 1.1 }}
                      >
                        {getAvailableTickets(event)} left
                      </motion.span>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--text-secondary)] transition-colors duration-300">
                      {event.title}
                    </h4>
                    
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
                    
                    <div className="flex items-center justify-between">
                      <motion.span 
                        className="text-3xl font-bold text-[var(--text-primary)]"
                        whileHover={{ scale: 1.1 }}
                      >
                        NPR {event.price}
                      </motion.span>
                      
                      <Link href={`/events/${event.id}`}>
                        <motion.button
                          className="btn-primary px-8 py-3 flex items-center space-x-2 group"
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
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] border-t border-[var(--border-ultra-light)] py-16"
        initial={{ opacity: 0, y: 50 }}
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
            <motion.div 
              className="flex items-center space-x-3 mb-6 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Ticket className="h-8 w-8 text-[var(--text-primary)]" />
              </motion.div>
              <span className="text-2xl font-bold text-[var(--text-primary)] gradient-text">TicketHub</span>
            </motion.div>
            
            <motion.p 
              className="text-[var(--text-tertiary)] text-center md:text-right"
              whileHover={{ scale: 1.02 }}
            >
              © 2024 TicketHub. All rights reserved.
            </motion.p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}