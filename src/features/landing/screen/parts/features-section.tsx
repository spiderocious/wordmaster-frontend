/**
 * Features Section - Why Play WordShot
 */

import { FaCog, FaClock, FaUsers } from '@icons';
import { forwardRef } from 'react';

const features = [
  {
    icon: FaCog,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Sharpen Your Mind',
    description:
      "Test your vocabulary and quick thinking with timed challenges across multiple categories. It's like a gym workout for your brain.",
  },
  {
    icon: FaClock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Race Against Time',
    description:
      'Think fast! You only have seconds to find the right word before the buzzer sounds. Can you handle the pressure?',
  },
  {
    icon: FaUsers,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Compete with Friends',
    description:
      'Create private rooms or join global lobbies to prove who is the ultimate wordsmith. Climb the ranks and earn bragging rights.',
  },
];

export const FeaturesSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="bg-gray-50 py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
            Why Play WordShot
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Everything You Need in a Word Game
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fast-paced, challenging, and endlessly fun. Discover why millions of players are
            addicted to the ultimate word challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`inline-block ${feature.iconBg} rounded-full p-4 mb-6`}>
                  <Icon className={`text-4xl ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
