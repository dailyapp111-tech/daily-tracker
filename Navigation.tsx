import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';

export interface PriceHistory {
  date: string; // ISO date string when this price became effective
  price: number;
}

export interface Vendor {
  name: string;
  phone: string;
  address: string;
}

export interface Item {
  id: string;
  name: string;
  priceHistory: PriceHistory[];
  vendor?: Vendor;
}

export interface Delivery {
  delivered: boolean;
  adjustment: number; // Positive for Due, Negative for Surplus
}

export interface Note {
  id: string;
  date: string; // ISO date string
  content: string;
  type: 'daily' | 'monthly';
}

interface AppState {
  items: Item[];
  // Key: YYYY-MM-DD, Value: Record<itemId, Delivery>
  deliveries: Record<string, Record<string, Delivery>>;
  notes: Note[];
  isInitialized: boolean;
  
  // Actions
  initialize: (defaultItems: { name: string; price: number }[]) => void;
  addItem: (name: string, price: number) => void;
  deleteItem: (id: string) => void;
  updateItemPrice: (id: string, newPrice: number) => void;
  updateItemVendor: (id: string, vendor: Vendor) => void;
  toggleDelivery: (date: Date, itemId: string) => void;
  updateAdjustment: (date: Date, itemId: string, amount: number) => void;
  getDeliveryStatus: (date: Date, itemId: string) => boolean;
  getAdjustment: (date: Date, itemId: string) => number;
  
  // Note Actions
  addNote: (content: string, type: 'daily' | 'monthly', date: Date) => void;
  deleteNote: (id: string) => void;
  getNotesForDate: (date: Date, type: 'daily' | 'monthly') => Note[];
  
  resetAllData: () => void;

  // Complex Logic: Calculate total bill for a date range
  calculateBill: (startDate: Date, endDate: Date) => {
    total: number;
    subtotal: number;
    totalAdjustment: number;
    itemBreakdown: Record<string, { count: number; cost: number; adjustment: number }>;
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveries: {},
      notes: [],
      isInitialized: false,

      initialize: (defaultItems) => {
        const items: Item[] = defaultItems.map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          priceHistory: [{ date: format(new Date(), 'yyyy-MM-dd'), price: item.price }],
          vendor: { name: '', phone: '', address: '' },
        }));
        set({ items, isInitialized: true });
      },

      addItem: (name, price) => {
        const newItem: Item = {
          id: crypto.randomUUID(),
          name,
          priceHistory: [{ date: format(new Date(), 'yyyy-MM-dd'), price }],
          vendor: { name: '', phone: '', address: '' },
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      deleteItem: (id) => {
        set((state) => {
          const newDeliveries = { ...state.deliveries };
          // Clean up delivery records for this item
          Object.keys(newDeliveries).forEach((date) => {
            if (newDeliveries[date][id]) {
              const { [id]: _, ...rest } = newDeliveries[date];
              newDeliveries[date] = rest;
            }
          });
          return {
            items: state.items.filter((item) => item.id !== id),
            deliveries: newDeliveries,
          };
        });
      },

      updateItemPrice: (id, newPrice) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  priceHistory: [
                    ...item.priceHistory,
                    { date: format(new Date(), 'yyyy-MM-dd'), price: newPrice },
                  ],
                }
              : item
          ),
        }));
      },

      updateItemVendor: (id, vendor) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, vendor } : item
          ),
        }));
      },

      toggleDelivery: (date, itemId) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        set((state) => {
          const dayDeliveries = state.deliveries[dateKey] || {};
          const current = dayDeliveries[itemId] || { delivered: true, adjustment: 0 };
          
          return {
            deliveries: {
              ...state.deliveries,
              [dateKey]: {
                ...dayDeliveries,
                [itemId]: { ...current, delivered: !current.delivered },
              },
            },
          };
        });
      },

      updateAdjustment: (date, itemId, amount) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        set((state) => {
          const dayDeliveries = state.deliveries[dateKey] || {};
          const current = dayDeliveries[itemId] || { delivered: true, adjustment: 0 };
          
          return {
            deliveries: {
              ...state.deliveries,
              [dateKey]: {
                ...dayDeliveries,
                [itemId]: { ...current, adjustment: amount },
              },
            },
          };
        });
      },

      getDeliveryStatus: (date, itemId) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const delivery = get().deliveries[dateKey]?.[itemId];
        return delivery?.delivered ?? true;
      },

      getAdjustment: (date, itemId) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const delivery = get().deliveries[dateKey]?.[itemId];
        return delivery?.adjustment ?? 0;
      },

      addNote: (content, type, date) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          date: format(date, 'yyyy-MM-dd'),
          content,
          type,
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      getNotesForDate: (date, type) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return get().notes.filter((note) => note.date === dateKey && note.type === type);
      },

      resetAllData: () => {
        set({
          items: [],
          deliveries: {},
          notes: [],
          isInitialized: false,
        });
      },

      calculateBill: (startDate, endDate) => {
        const { items, deliveries } = get();
        let subtotal = 0;
        let totalAdjustment = 0;
        const itemBreakdown: Record<string, { count: number; cost: number; adjustment: number }> = {};

        // Initialize breakdown
        items.forEach(item => {
          itemBreakdown[item.id] = { count: 0, cost: 0, adjustment: 0 };
        });

        // Iterate through each day in range
        let currentDate = startOfDay(startDate);
        const lastDate = startOfDay(endDate);

        while (currentDate <= lastDate) {
          const dateKey = format(currentDate, 'yyyy-MM-dd');
          const dayDeliveries = deliveries[dateKey] || {};

          items.forEach((item) => {
            const delivery = dayDeliveries[item.id] || { delivered: true, adjustment: 0 };
            const isDelivered = delivery.delivered;
            const adjustment = delivery.adjustment;
            
            totalAdjustment += adjustment;
            if (itemBreakdown[item.id]) {
              itemBreakdown[item.id].adjustment += adjustment;
            }

            if (isDelivered) {
              const sortedHistory = [...item.priceHistory].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              const priceEntry = sortedHistory.find(
                (h) => startOfDay(parseISO(h.date)) <= currentDate
              );
              const price = priceEntry ? priceEntry.price : 0;

              subtotal += price;
              if (itemBreakdown[item.id]) {
                itemBreakdown[item.id].count += 1;
                itemBreakdown[item.id].cost += price;
              }
            }
          });

          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }

        return { 
          subtotal, 
          totalAdjustment, 
          total: subtotal + totalAdjustment,
          itemBreakdown 
        };
      },
    }),
    {
      name: 'household-purchase-tracker',
    }
  )
);
