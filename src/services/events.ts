import { Event } from '@/types';
import seedEvents from '@/data/events.json';

type Subscriber = (events: Event[]) => void;

class EventsStore {
  private events: Event[] = [];
  private subscribers: Set<Subscriber> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('events');
      if (raw) {
        this.events = JSON.parse(raw) as Event[];
      } else {
        this.events = (seedEvents as Event[]);
        this.persist();
      }
    } else {
      this.events = (seedEvents as Event[]);
    }
  }

  subscribe(fn: Subscriber) {
    this.subscribers.add(fn);
    fn(this.events);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private notify() {
    for (const fn of this.subscribers) fn(this.events);
  }

  private persist() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('events', JSON.stringify(this.events));
    }
  }

  getAll(): Event[] {
    return [...this.events];
  }

  getById(id: string): Event | undefined {
    return this.events.find((e) => e.id === id);
  }

  add(event: Omit<Event, 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    this.events = [
      ...this.events,
      { ...event, createdAt: now, updatedAt: now },
    ];
    this.persist();
    this.notify();
  }

  update(id: string, updates: Partial<Event>) {
    this.events = this.events.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    this.persist();
    this.notify();
  }

  remove(id: string) {
    this.events = this.events.filter((e) => e.id !== id);
    this.persist();
    this.notify();
  }

  // Analytics
  getTotalSales(): number {
    return this.events.reduce((sum, e) => sum + e.soldTickets * e.price, 0);
  }

  getTotalTicketsSold(): number {
    return this.events.reduce((sum, e) => sum + e.soldTickets, 0);
  }
}

export const eventsStore = new EventsStore();

