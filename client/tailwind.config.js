/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- CampusPulse Master Design System: Part 2 ---
        // Primary Brand Colors
        brand: {
          navy: '#172554',      // Midnight Navy
          deep: '#3730A3',      // Deep Indigo
          indigo: '#4F46E5',    // Royal Indigo
          bright: '#6366F1',    // Bright Indigo
          soft: '#EEF2FF',      // Soft Indigo
          pale: '#F5F7FF',      // Pale Indigo
        },
        primary: {
          50: '#F5F7FF',
          100: '#EEF2FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',       // Royal Indigo
          700: '#3730A3',       // Deep Indigo
          800: '#1E1B4B',
          900: '#172554',       // Midnight Navy
          DEFAULT: '#4F46E5',
        },
        // Backgrounds & Surfaces
        surface: {
          main: '#F7F8FC',        // Main Background
          secondary: '#F1F4FA',   // Secondary Background
          card: '#FFFFFF',        // Primary Surface
          subtle: '#F5F6FF',      // Subtle Indigo Surface
          dark: '#172554',        // Dark Feature Surface
        },
        page: '#F7F8FC',
        card: '#FFFFFF',
        // Text Hierarchy
        content: {
          primary: '#172033',     // Primary Text
          secondary: '#596579',   // Secondary Text
          muted: '#8993A5',       // Muted Text
          inverse: '#FFFFFF',     // Text on Dark Surfaces
        },
        // Accents
        accent: {
          teal: '#0F9D8A',
          tealSoft: '#E6F7F3',
          blue: '#3B82F6',
          blueSoft: '#EAF2FF',
          violet: '#8B5CF6',
          violetSoft: '#F2ECFF',
          amber: '#D97706',
          amberSoft: '#FFF4DB',
          rose: '#E11D48',
          roseSoft: '#FFF0F3',
        },
        // Borders
        border: {
          DEFAULT: '#E5E9F2',     // Standard Border
          strong: '#D5DCE8',      // Strong Border
        },
        // Status Colors
        status: {
          pending: '#D97706',
          pendingBg: '#FFF4DB',
          pendingBorder: '#FDE68A',
          inProgress: '#4F46E5',
          inProgressBg: '#EEF2FF',
          inProgressBorder: '#C7D2FE',
          resolved: '#0F9D8A',
          resolvedBg: '#E6F7F3',
          resolvedBorder: '#A7F3D0',
          rejected: '#E11D48',
          rejectedBg: '#FFF0F3',
          rejectedBorder: '#FECDD3',
          urgent: '#E11D48',
          urgentBg: '#FFF0F3',
          urgentBorder: '#FECDD3',
        },
        // Compatibility Aliases
        workspace: {
          ink: '#172033',
          textPrimary: '#172033',
          textSecondary: '#596579',
          textMuted: '#8993A5',
          sidebarBg: '#F1F4FA',
          indigo: '#4F46E5',
          softIndigo: '#EEF2FF',
          teal: '#0F9D8A',
          amber: '#D97706',
          mist: '#F7F8FC',
          canvas: '#F7F8FC',
          card: '#FFFFFF',
          border: '#E5E9F2',
        },
        issueStatus: {
          resolved: '#0F9D8A',
          resolvedBg: '#E6F7F3',
          pending: '#D97706',
          pendingBg: '#FFF4DB',
          inProgress: '#4F46E5',
          inProgressBg: '#EEF2FF',
          rejected: '#E11D48',
          rejectedBg: '#FFF0F3',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        dmsans: ['var(--font-dm-sans)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-sora)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', '-apple-system', 'sans-serif'],
        section: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'subtle': '10px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 16px rgba(23, 37, 84, 0.05)',
        'elevated': '0 12px 32px rgba(23, 37, 84, 0.09)',
        'modal': '0 24px 64px rgba(23, 37, 84, 0.16)',
        'card': '0 4px 16px rgba(23, 37, 84, 0.05)',
        'card-hover': '0 12px 32px rgba(23, 37, 84, 0.09)',
        'input-focus': '0 0 0 3px rgba(79, 70, 229, 0.15)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        'fast': '140ms',
        'standard': '220ms',
        'smooth': '320ms',
      },
    },
  },
  plugins: [],
}
