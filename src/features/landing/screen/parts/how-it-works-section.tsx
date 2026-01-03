/**
 * How It Works Section - 3 Simple Steps
 */

import { motion } from 'framer-motion';
import { FaGamepad } from '@icons';
import { forwardRef } from 'react';

interface HowItWorksSectionProps {
  onPlayNowClick: () => void;
}

export const HowItWorksSection = forwardRef<HTMLElement, HowItWorksSectionProps>(
  ({ onPlayNowClick }, ref) => {
    return (
      <section ref={ref} className="bg-gray-50 py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2"
            >
              How it Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-gray-900"
            >
              Get Started in 3 Simple Steps
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto"
            >
              No learning curve. Jump right in and start playing!
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg">
                  1
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-gray-900 mb-3">Get Your Letter</h3>
                <p className="text-lg text-gray-600">
                  Spin the wheel to receive a random alphabet letter. Will it be an easy 'S' or a
                  tricky 'Q'?
                </p>
              </div>
              <div className="flex-shrink-0 w-64 h-48 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-100">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                    <span className="text-6xl font-black text-gray-900">A</span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Random Letter</p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-8"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg">
                  2
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-3xl font-black text-gray-900 mb-3">See the Category</h3>
                <p className="text-lg text-gray-600">
                  A random category appears instantly. Think fast—Animals, Countries, or maybe Pizza
                  Toppings!
                </p>
              </div>
              <div className="flex-shrink-0 w-64 h-48 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-100">
                <div className="text-center">
                  <div className="inline-block bg-blue-100 rounded-full p-3 mb-3">
                    <FaGamepad className="text-4xl text-blue-600" />
                  </div>
                  <p className="text-xl font-black text-gray-900">Countries</p>
                  <div className="w-16 h-1 bg-gray-200 rounded mx-auto mt-2"></div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg">
                  3
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-gray-900 mb-3">Beat the Timer</h3>
                <p className="text-lg text-gray-600">
                  Type your answer before the time runs out. The faster you answer, the higher your
                  score.
                </p>
              </div>
              <div className="flex-shrink-0 w-64 h-48 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-100">
                <div className="text-center w-full px-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-500">TIME LEFT</span>
                    <span className="text-sm font-black text-blue-600">0:08</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <input
                    type="text"
                    value="I"
                    readOnly
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-lg font-bold text-gray-900"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button
              onClick={onPlayNowClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-lg text-lg transition-colors shadow-lg inline-flex items-center gap-2"
            >
              Start Playing
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>
    );
  }
);

HowItWorksSection.displayName = 'HowItWorksSection';
