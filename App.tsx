import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const DailyChecklist: React.FC = () => {
  const { items, toggleDelivery, getDeliveryStatus, updateAdjustment, getAdjustment } = useStore();
  const today = new Date();

  return (
    <div className="space-y-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Deliveries</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <CalendarIcon size={14} />
            {format(today, 'EEEE, MMMM do')}
          </p>
        </div>
      </header>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const isDelivered = getDeliveryStatus(today, item.id);
            const adjustment = getAdjustment(today, item.id);
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border p-6 transition-all duration-300",
                  isDelivered 
                    ? "border-blue-100 bg-blue-50/30 shadow-sm" 
                    : "border-gray-100 bg-white"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-xl font-bold transition-colors",
                      isDelivered ? "text-blue-900" : "text-gray-900"
                    )}>
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ₹{item.priceHistory[item.priceHistory.length - 1].price.toFixed(2)} / unit
                    </span>
                  </div>

                  <button
                    onClick={() => toggleDelivery(today, item.id)}
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 active:scale-90",
                      isDelivered 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {isDelivered ? <Check size={28} strokeWidth={3} /> : <X size={28} strokeWidth={3} />}
                  </button>
                </div>

                {/* Adjustment Input */}
                <div className="mt-4 pt-4 border-t border-gray-100/50">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Surplus / Due (₹)
                    </label>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={adjustment || ''}
                        onChange={(e) => updateAdjustment(today, item.id, Number(e.target.value))}
                        className={cn(
                          "w-full rounded-xl border border-gray-200 bg-white/50 py-2 pl-6 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                          adjustment > 0 ? "text-red-600 font-bold" : adjustment < 0 ? "text-green-600 font-bold" : "text-gray-600"
                        )}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 italic">
                    {adjustment > 0 ? "User owes extra (Due)" : adjustment < 0 ? "User has credit (Surplus)" : "No adjustments for today"}
                  </p>
                </div>
                
                {/* Visual indicator of delivery status */}
                <div className={cn(
                  "absolute bottom-0 left-0 h-1.5 transition-all duration-500",
                  isDelivered ? "w-full bg-blue-600" : "w-0 bg-gray-200"
                )} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <div className="mb-4 rounded-full bg-gray-50 p-4">
              <X size={32} />
            </div>
            <p>No items configured yet.</p>
          </div>
        )}
      </div>
      
      <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
        <p>Tip: Items are checked by default. Tap the checkmark to mark as "Not Delivered" for today.</p>
      </div>
    </div>
  );
};
