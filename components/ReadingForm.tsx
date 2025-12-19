'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingFormProps {
  onSubmit: (data: { year: number; month: number; day: number; hour: number }) => void;
}

export default function ReadingForm({ onSubmit }: ReadingFormProps) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('12');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (year && month && day) {
      onSubmit({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour),
      });
    }
  };

  const getHourLabel = (h: number) => {
    const hourNames = [
      '子時 (23-01)', '丑時 (01-03)', '丑時 (01-03)', '寅時 (03-05)',
      '寅時 (03-05)', '卯時 (05-07)', '卯時 (05-07)', '辰時 (07-09)',
      '辰時 (07-09)', '巳時 (09-11)', '巳時 (09-11)', '午時 (11-13)',
      '午時 (11-13)', '未時 (13-15)', '未時 (13-15)', '申時 (15-17)',
      '申時 (15-17)', '酉時 (17-19)', '酉時 (17-19)', '戌時 (19-21)',
      '戌時 (19-21)', '亥時 (21-23)', '亥時 (21-23)', '子時 (23-01)',
    ];
    return `${h.toString().padStart(2, '0')}:00 - ${hourNames[h]}`;
  };

  return (
    <div className="oracle-card p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="font-serif-kr text-4xl gold-glow mb-2">算命</h2>
        <p className="text-palja-gold-light opacity-70 tracking-wider text-sm">
          Enter your birth data to reveal your PALJA
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Birth Date */}
        <div>
          <label className="block text-palja-gold-light mb-2 text-sm tracking-wider">
            BIRTH DATE 生日
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="oracle-select"
              required
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="oracle-select"
              required
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="oracle-select"
              required
            >
              <option value="">Day</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}日</option>
              ))}
            </select>
          </div>
        </div>

        {/* Birth Hour */}
        <div>
          <label className="block text-palja-gold-light mb-2 text-sm tracking-wider">
            BIRTH HOUR 時辰 <span className="opacity-50">(optional)</span>
          </label>
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="oracle-select"
          >
            {hours.map((h) => (
              <option key={h} value={h}>{getHourLabel(h)}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="btn-oracle w-full text-lg py-4 mt-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          REVEAL MY PALJA 🔮
        </motion.button>
      </form>

      <p className="text-center text-palja-gold opacity-40 text-xs mt-6 tracking-wider">
        The Oracle sees all. Enter truthfully.
      </p>
    </div>
  );
}
