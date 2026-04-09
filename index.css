import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, ArrowRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const SetupView: React.FC = () => {
  const { initialize } = useStore();
  const [items, setItems] = useState([
    { name: '', price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { name: '', price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'name' | 'price', value: string | number) => {
    const newItems = [...items];
    if (field === 'price') {
      newItems[index].price = Number(value);
    } else {
      newItems[index].name = String(value);
    }
    setItems(newItems);
  };

  const handleStart = () => {
    const validItems = items.filter(i => i.name.trim() !== '');
    if (validItems.length > 0) {
      initialize(validItems);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-100">
            <Home size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome to HomeTrack</h1>
          <p className="mt-2 text-gray-500">Let's set up your daily household items and their unit prices.</p>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  placeholder="Item name (e.g. Milk)"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="w-24 space-y-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={item.price || ''}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-6 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}

          <button
            onClick={addItem}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            <Plus size={18} />
            Add Another Item
          </button>
        </div>

        <div className="mt-12">
          <button
            onClick={handleStart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-xl shadow-blue-200 transition-all active:scale-95 hover:bg-blue-700"
          >
            Start Tracking
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
