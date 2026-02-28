import { motion } from 'motion/react';
import { ChevronRight, CreditCard, Map as MapIcon, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ReactNode } from 'react';

type RowProps =
  | {
      icon: ReactNode;
      label: string;
      value: boolean;
      onClick: () => void;
      color?: string;
      bg?: string;
      type?: 'toggle';
    }
  | {
      icon: ReactNode;
      label: string;
      value?: string;
      onClick: () => void;
      color?: string;
      bg?: string;
      type: 'link';
    };

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp();

  const SettingRow = ({
    icon,
    label,
    value,
    onClick,
    color = 'text-blue-500',
    bg = 'bg-blue-50',
    type = 'toggle',
  }: RowProps) => (
    <motion.div
      layout
      className={`border-b last:border-0 ${settings.darkMode ? 'border-slate-800' : 'border-slate-50'}`}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 sm:p-5 transition-colors ${
          settings.darkMode ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>{icon}</div>
          <div className="text-left">
            <p className={`font-bold ${settings.darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{label}</p>
            {typeof value === 'string' && (
              <p className={`text-xs font-medium ${settings.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {value}
              </p>
            )}
          </div>
        </div>

        {type === 'toggle' ? (
          <div
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
              value ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <motion.div animate={{ x: value ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-300" />
        )}
      </button>
    </motion.div>
  );

  return (
    <div
      className={`flex flex-col h-dvh overflow-y-auto pb-[calc(8rem+env(safe-area-inset-bottom))] px-4 sm:px-6 pt-[calc(2.75rem+env(safe-area-inset-top))] sm:pt-12 transition-colors duration-300 ${
        settings.darkMode ? 'bg-slate-950' : 'bg-slate-50/50'
      }`}
    >
      <header className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your preferences</p>
        </motion.div>
      </header>

      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2 mb-3">Preferences</h2>
        <div
          className={`rounded-[32px] overflow-hidden border shadow-sm transition-colors ${
            settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <SettingRow
            icon={<Moon className="w-5 h-5" />}
            label="Dark Mode"
            value={settings.darkMode}
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            color="text-indigo-500"
            bg="bg-indigo-50 dark:bg-indigo-500/10"
          />
          <SettingRow
            icon={<MapIcon className="w-5 h-5" />}
            label="Distance Units"
            value={settings.units.toUpperCase()}
            onClick={() => updateSettings({ units: settings.units === 'km' ? 'miles' : 'km' })}
            type="link"
            color="text-amber-500"
            bg="bg-amber-50 dark:bg-amber-500/10"
          />
          <SettingRow
            icon={<CreditCard className="w-5 h-5" />}
            label="Currency"
            value={settings.currency}
            onClick={() => {
              const currencies: Array<'INR' | 'USD' | 'EUR'> = ['INR', 'USD', 'EUR'];
              const next = currencies[(currencies.indexOf(settings.currency) + 1) % currencies.length];
              updateSettings({ currency: next });
            }}
            type="link"
            color="text-emerald-500"
            bg="bg-emerald-50 dark:bg-emerald-500/10"
          />
        </div>
      </section>

      <footer className="mt-auto pt-10">
        <p className={`text-center text-xs font-semibold ${settings.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Developed by <span className={`${settings.darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Runtime Error</span>
        </p>
      </footer>
    </div>
  );
}
