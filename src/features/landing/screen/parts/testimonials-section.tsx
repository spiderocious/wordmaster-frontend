/**
 * Testimonials Section - Player Reviews
 */

import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from '@icons';
import { forwardRef } from 'react';

const testimonials = [
  {
    quote:
      'This game is surprisingly addictive! I play it during my coffee break every single day. It keeps my brain sharp.',
    author: 'Sarah Jenkins',
    role: 'Played 200+ games',
    initials: 'SJ',
    delay: 0.1,
  },
  {
    quote:
      "The 'Animals' category is brutal but so fun. Finally, a game that makes me think instead of just tap.",
    author: 'Mike T.',
    role: 'Played 500+ games',
    initials: 'MT',
    delay: 0.2,
  },
  {
    quote:
      'Love the clean design and how fast it loads. Perfect for killing time while waiting for my train.',
    author: 'Emily R.',
    role: 'Casual Gamer',
    initials: 'ER',
    delay: 0.3,
  },
];

export const TestimonialsSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="bg-white py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2"
          >
            Loved by Players
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900"
          >
            Don't Just Take Our Word for It
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mt-4"
          >
            See what our community has to say about their daily brain training
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonial.delay }}
              className="bg-gray-50 rounded-3xl p-8 relative"
            >
              <div className="absolute top-8 right-8 text-gray-200">
                <FaQuoteLeft className="text-4xl" />
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-black text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 text-gray-600">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="text-lg">
              Over <span className="font-black text-gray-900">50,000</span> players are already
              enjoying WordShot.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';
