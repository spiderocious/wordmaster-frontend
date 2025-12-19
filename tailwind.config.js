/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1371ec',
        success: '#2ECC71',
        warning: '#F1C40F',
        error: '#E74C3C',
        'surface-dark': '#111a22',
        'background-dark': '#101922',
      },
      boxShadow: {
        'token-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'token-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'token-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'token-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'token-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      zIndex: {
        dropdown: '1000',
        modal: '1100',
        toast: '1200',
        tooltip: '1300',
      },
    },
  },
  plugins: [],
}
