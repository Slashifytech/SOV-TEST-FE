// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        primary: '#98090B',
        secondary: '#515151',
        inputText: '#B9BBBD',
        input: '#F2F5F7',
        heading: '#303031',
        sidebar: '#464255',
        body: '#6E7170',
        greyish: '#E8E8E8',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        slideIn: "slideIn 0.3s ease-in-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      }
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
      xxl: "1800px",
    },
  },
  plugins: [],
};
