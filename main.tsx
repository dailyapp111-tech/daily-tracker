import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { startOfMonth, endOfMonth, format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, DollarSign, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const SummaryView: React.FC = () => {
  const { calculateBill, items } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const stats = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return calculateBill(start, end);
  }, [currentMonth, calculateBill]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Monthly Report</h2>
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
          <button onClick={prevMonth} className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
            <ChevronLeft size={20} />
          </button>
          <span className="px-3 text-sm font-bold text-gray-700 min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Total Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-2xl shadow-blue-200"
      >
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Bill</p>
          <h3 className="mt-1 text-5xl font-black tracking-tight">
            ₹{stats.total.toFixed(2)}
          </h3>
          
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-blue-500/50 pt-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-200">Subtotal</p>
              <p className="text-lg font-bold">₹{stats.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-200">Adjustments</p>
              <p className={cn(
                "text-lg font-bold",
                stats.totalAdjustment > 0 ? "text-red-300" : stats.totalAdjustment < 0 ? "text-green-300" : "text-blue-100"
              )}>
                {stats.totalAdjustment > 0 ? '+' : ''}₹{stats.totalAdjustment.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-blue-100 text-[10px] uppercase tracking-wider opacity-80">
            <TrendingUp size={12} />
            <span>Includes surplus/due adjustments</span>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-500 opacity-20" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-400 opacity-20" />
      </motion.div>

      {/* Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Item Breakdown</h4>
        <div className="grid gap-4">
          {items.map((item) => {
            const breakdown = stats.itemBreakdown[item.id] || { count: 0, cost: 0, adjustment: 0 };
            return (
              <div key={item.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                      <p className="text-xs text-gray-500">{breakdown.count} deliveries this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">₹{(breakdown.cost + breakdown.adjustment).toFixed(2)}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Total</p>
                  </div>
                </div>

                {/* Item Adjustment Detail */}
                {breakdown.adjustment !== 0 && (
                  <div className="flex justify-between items-center text-xs px-3 py-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">Monthly Adjustments</span>
                    <span className={cn(
                      "font-bold",
                      breakdown.adjustment > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {breakdown.adjustment > 0 ? '+' : ''}₹{breakdown.adjustment.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Vendor Info */}
                {item.vendor && (item.vendor.name || item.vendor.phone) && (
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Vendor Contact</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      {item.vendor.name && <span className="font-medium">{item.vendor.name}</span>}
                      {item.vendor.phone && <span className="text-blue-600">{item.vendor.phone}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {stats.total === 0 && (
        <div className="rounded-2xl bg-orange-50 p-6 text-center">
          <p className="text-sm font-medium text-orange-800">No deliveries recorded for this period.</p>
        </div>
      )}
    </div>
  );
};
