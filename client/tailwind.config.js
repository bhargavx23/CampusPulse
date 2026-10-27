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
          navy: '#203540',      // Midnight Navy
          deep: '#365363',
          indigo: '#48677A',
          bright: '#5B7D90',
          soft: '#EAF1F4',
          pale: '#F4F7F8',
        },
        primary: {
          50: '#F4F7F8',
          100: '#EAF1F4',
          200: '#D4E1E6',
          300: '#B8CBD3',
          400: '#91AAB6',
          500: '#6F8E9D',
          600: '#48677A',
          700: '#365363',
          800: '#2A424F',
          900: '#203540',
          DEFAULT: '#48677A',
        },
        // Backgrounds & Surfaces
        surface: {
          main: '#F6F7F5',
          secondary: '#EEF1EF',
          card: '#FFFFFF',        // Primary Surface
          subtle: '#F2F5F4',
          dark: '#203540',        // Dark Feature Surface
        },
        page: '#F6F7F5',
        card: '#FFFFFF',
        // Text Hierarchy
        content: {
          primary: '#202B33',
          secondary: '#5D6B73',
          muted: '#87939A',
          inverse: '#FFFFFF',     // Text on Dark Surfaces
        },
        // Accents
        accent: {
          teal: '#0F9D8A',
          tealSoft: '#E6F7F3',
          blue: '#48677A',
          blueSoft: '#EAF1F4',
          violet: '#8B5CF6',
          violetSoft: '#F2ECFF',
          amber: '#D97706',
          amberSoft: '#FFF4DB',
          rose: '#E11D48',
          roseSoft: '#FFF0F3',
        },
        // Borders
        border: {
          DEFAULT: '#E3E8E6',     // Standard Border
          strong: '#D2DAD6',      // Strong Border
        },
        // Status Colors
        status: {
          pending: '#D97706',
          pendingBg: '#FFF4DB',
          pendingBorder: '#FDE68A',
          inProgress: '#48677A',
          inProgressBg: '#EAF1F4',
          inProgressBorder: '#D4E1E6',
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
          ink: '#202B33',
          textPrimary: '#202B33',
          textSecondary: '#5D6B73',
          textMuted: '#87939A',
          sidebarBg: '#EEF1EF',
          indigo: '#48677A',
          softIndigo: '#EAF1F4',
          teal: '#0F9D8A',
          amber: '#D97706',
          mist: '#F6F7F5',
          canvas: '#F6F7F5',
          card: '#FFFFFF',
          border: '#E3E8E6',
        },
        issueStatus: {
          resolved: '#0F9D8A',
          resolvedBg: '#E6F7F3',
          pending: '#D97706',
          pendingBg: '#FFF4DB',
          inProgress: '#48677A',
          inProgressBg: '#EAF1F4',
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
        'soft': '0 3px 12px rgba(32, 53, 64, 0.045), 0 1px 2px rgba(32, 53, 64, 0.03)',
        'elevated': '0 16px 40px rgba(32, 53, 64, 0.09), 0 3px 8px rgba(32, 53, 64, 0.04)',
        'modal': '0 28px 72px rgba(32, 53, 64, 0.18)',
        'card': '0 3px 12px rgba(32, 53, 64, 0.045), 0 1px 2px rgba(32, 53, 64, 0.03)',
        'card-hover': '0 16px 40px rgba(32, 53, 64, 0.09), 0 3px 8px rgba(32, 53, 64, 0.04)',
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
