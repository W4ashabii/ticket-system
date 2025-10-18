'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, ArrowLeft, User, Phone, Mail, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Event } from '@/types';
import { initializeEsewaPayment, prepareEsewaPayment } from '@/services/esewa';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations. This event will showcase the latest trends in artificial intelligence, blockchain technology, and sustainable tech solutions. Network with professionals from leading tech companies and discover new opportunities in the digital landscape.',
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

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  quantity: number;
}

export default function EventDetails() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    quantity: 1
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const foundEvent = mockEvents.find(e => e.id === params.id);
      setEvent(foundEvent || null);
      setLoading(false);
    }, 1000);
  }, [params.id]);

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      alert('Payment successful! You will receive a confirmation email shortly.');
      setShowBookingForm(false);
    }, 3000);
  };

  const handleEsewaPayment = async () => {
    if (!event) return;
    
    setProcessing(true);
    
    try {
      const totalAmount = event.price * bookingForm.quantity;
      const productCode = `EVENT-${event.id}`;
      
      const paymentRequest = await prepareEsewaPayment(
        totalAmount,
        productCode
      );
      
      const result = await initializeEsewaPayment(paymentRequest);
      
      if (result.status === 'success') {
        console.log('Payment initialized successfully');
      } else {
        alert('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Event not found</h1>
          <Link href="/">
            <motion.button
              className="bg-black text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events</span>
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Ticket className="h-8 w-8 text-black" />
                <h1 className="text-2xl font-bold text-black">TicketHub</h1>
              </motion.div>
            </Link>
            <Link href="/">
              <motion.button
                className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Events</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-8">
              <Calendar className="h-24 w-24 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              <div>
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {event.category}
                </span>
                <h1 className="text-4xl font-bold text-black mt-2">
                  {event.title}
                </h1>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span className="text-lg">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span className="text-lg">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span className="text-lg">{event.venue}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-black">
                    NPR {event.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getAvailableTickets(event)} tickets available
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-50 rounded-lg p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!showBookingForm ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Book Your Tickets
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Price per ticket</span>
                    <span className="font-semibold">NPR {event.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Available tickets</span>
                    <span className="font-semibold">{getAvailableTickets(event)}</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-black text-white py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors btn-hover"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Booking
                </motion.button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">
                  Complete Your Booking
                </h2>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        value={bookingForm.quantity}
                        onChange={(e) => setBookingForm({...bookingForm, quantity: parseInt(e.target.value)})}
                      >
                        {Array.from({ length: Math.min(10, getAvailableTickets(event)) }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} ticket{i + 1 > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">NPR {event.price * bookingForm.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Service charge</span>
                      <span className="font-semibold">NPR 0</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>NPR {event.price * bookingForm.quantity}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      type="button"
                      onClick={handleEsewaPayment}
                      disabled={processing}
                      className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors btn-hover flex items-center justify-center space-x-2 disabled:opacity-50"
                      whileHover={{ scale: processing ? 1 : 1.02 }}
                      whileTap={{ scale: processing ? 1 : 0.98 }}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>{processing ? 'Processing...' : 'Pay with eSewa'}</span>
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="w-full bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
