/** Paleta "cartilha de balcão" — ver docs/DIAGNOSTICO_E_DIRECAO_DE_ARTE.md */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        papel: '#FAF8F5',
        folha: '#FFFDF9',
        areia: '#F1ECE3',
        tinta: '#1E3A5F',
        esmeralda: '#1B7F5A',
        terracota: '#C85A32',
        ambar: '#B7791F',
        grafite: '#2A2A2A',
      },
      fontFamily: {
        titulo: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
        corpo: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        selo: '3px 3px 0 0 #1E3A5F',
        seloVerde: '3px 3px 0 0 #1B7F5A',
        seloTerra: '3px 3px 0 0 #C85A32',
      },
      keyframes: {
        sobe: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: { sobe: 'sobe .35s ease-out both' },
    },
  },
  plugins: [],
};
