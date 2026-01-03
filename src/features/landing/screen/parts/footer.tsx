/**
 * Landing Page Footer
 */

import { FaGamepad } from '@icons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaGamepad className="text-white" />
            </div>
            <span className="text-lg font-black text-gray-900">WordShot</span>
          </div>

          <p className="text-sm text-gray-500">© {year} WordShot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
