/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useStore } from './store/useStore';
import { SetupView } from './components/SetupView';
import { DailyChecklist } from './components/DailyChecklist';
import { SummaryView } from './components/SummaryView';
import { SettingsView } from './components/SettingsView';
import { NotesView } from './components/NotesView';
import { Navigation } from './components/Navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { isInitialized } = useStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'summary' | 'settings' | 'notes'>('daily');

  if (!isInitialized) {
    return <SetupView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyChecklist />;
      case 'notes':
        return <NotesView />;
      case 'summary':
        return <SummaryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DailyChecklist />;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Top Status Bar Spacer (Safe Area) */}
      <div className="h-safe-top" />
      
      <main className="mx-auto max-w-md px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
