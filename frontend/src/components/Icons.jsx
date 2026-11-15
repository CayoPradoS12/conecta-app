const base = {
  width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
};
const I = (children) => (props) => <svg {...base} {...props}>{children}</svg>;

export const IcCasa = I(<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>);
export const IcEscudo = I(<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>);
export const IcChave = I(<><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9" /><path d="M16 7l3 3" /><path d="M14 9l2 2" /></>);
export const IcLivro = I(<><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" /><path d="M4 21V5" /><path d="M9 8h6" /></>);
export const IcVolume = I(<><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16.5 8.5a5 5 0 010 7" /><path d="M19 6a8.5 8.5 0 010 12" /></>);
export const IcParar = I(<><rect x="6" y="6" width="12" height="12" rx="2" /></>);
export const IcCheck = I(<path d="M5 12.5l4.5 4.5L19 7" />);
export const IcX = I(<><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>);
export const IcAlerta = I(<><path d="M12 3l10 18H2z" /><path d="M12 10v5" /><path d="M12 18.5v.01" /></>);
export const IcSeta = I(<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>);
export const IcVoltar = I(<><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>);
export const IcOlho = I(<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>);
export const IcOlhoFechado = I(<><path d="M3 3l18 18" /><path d="M10.6 6.1A9.5 9.5 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9" /><path d="M6.6 6.6A17 17 0 002 12s4 7 10 7c1.6 0 3-.4 4.3-1" /></>);
export const IcBusca = I(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>);
export const IcGrafico = I(<><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-8" /><path d="M22 20H2" /></>);
export const IcRecomecar = I(<><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.5" /><path d="M3 4v5h5" /></>);
