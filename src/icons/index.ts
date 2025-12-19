/**
 * Icons Proxy Module
 *
 * This module re-exports all react-icons packages.
 * Import icons from @icons instead of react-icons directly.
 *
 * Usage:
 * import { FaHome, FaUser, MdDashboard } from '@icons';
 *
 * Benefits:
 * - Centralized icon imports
 * - Easy to swap icon libraries if needed
 * - Consistent import pattern across the app
 *
 * Note: Some icon packages (fa/fa6, hi/hi2, io/io5) have duplicate exports.
 * Use the newer versions (fa6, hi2, io5) or import from specific packages if needed.
 */

// Font Awesome Icons (use fa6 for latest, fa for legacy)
export * from 'react-icons/fa';

// Material Design Icons
export * from 'react-icons/md';

// Ionicons (use io5 for latest)
export * from 'react-icons/io5';

// Ant Design Icons
export * from 'react-icons/ai';

// Bootstrap Icons
export * from 'react-icons/bs';

// BoxIcons
export * from 'react-icons/bi';

// Feather Icons
export * from 'react-icons/fi';

// Game Icons
export * from 'react-icons/gi';

// Github Octicons
export * from 'react-icons/go';

// Grommet Icons
export * from 'react-icons/gr';

// HeroIcons (use hi2 for latest)
export * from 'react-icons/hi2';

// IcoMoon Free
export * from 'react-icons/im';

// Remix Icon
export * from 'react-icons/ri';

// Simple Icons
export * from 'react-icons/si';

// Typicons
export * from 'react-icons/ti';

// VS Code Icons
export * from 'react-icons/vsc';

// Weather Icons
export * from 'react-icons/wi';

// css.gg
export * from 'react-icons/cg';

// Tabler Icons
export * from 'react-icons/tb';

// Lucide Icons
export * from 'react-icons/lu';

// Circum Icons
export * from 'react-icons/ci';

// Phosphor Icons
export * from 'react-icons/pi';

// Radix Icons
export * from 'react-icons/rx';

// Flat Color Icons
export * from 'react-icons/fc';
