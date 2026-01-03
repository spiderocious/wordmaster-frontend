/**
 * Stats Section - WordShot by the Numbers
 */

import { motion } from 'framer-motion';
import { FaUsers, FaPencilAlt, FaStar, FaGamepad } from '@icons';

const stats = [
  {
    icon: FaUsers,
    value: '10K+',
    label: 'Active Players',
    delay: 0.5,
  },
  {
    icon: FaGamepad,
    value: '500+',
    label: 'Categories',
    delay: 0.6,
  },
  {
    icon: FaPencilAlt,
    value: '1M+',
    label: 'Words Found',
    delay: 0.7,
  },
  {
    icon: FaStar,
    value: '4.8/5',
    label: 'Player Rating',
    delay: 0.8,
  },
];

export function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20"
      >
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
            WordShot by the Numbers
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Join the fastest growing word community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                className="bg-white rounded-3xl shadow-lg p-10 text-center border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-xl"
              >
                <div className="inline-block bg-blue-100 rounded-full p-5 mb-6">
                  <Icon className="text-5xl text-blue-600" />
                </div>
                <div className="text-6xl font-black text-blue-600 mb-3">{stat.value}</div>
                <div className="text-gray-600 font-bold text-lg">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
