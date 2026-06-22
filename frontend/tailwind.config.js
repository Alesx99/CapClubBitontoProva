/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury CapClub Color Palette
        club: {
          bg: '#0B0B0C',        // Matte Deep Charcoal
          card: '#121214',      // Soft Dark Gray for cards
          accent: '#D4AF37',    // Primary Gold Champagne
          accentHover: '#C5A059', // Muted Luxury Gold
          text: '#E4E4E7',      // Platinum/Warm Gray
          muted: '#A1A1AA',     // Zinc Muted Text
          border: '#27272A',    // Subtle Border
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxurious: '0.15em',
      }
    },
  },
  plugins: [],
}
