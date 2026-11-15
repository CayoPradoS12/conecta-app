import { useEffect, useState } from 'react';
import { falar, parar, suportaFala } from '../lib/speech';
import { IcParar, IcVolume } from './Icons';

/** Lê um texto em português. Toque de novo para parar. */
export default function AudioButton({ texto, rotulo = 'Ouvir', className = '' }) {
  const [tocando, setTocando] = useState(false);
  useEffect(() => () => parar(), []);

  if (!suportaFala()) return null;

  const alternar = () => {
    if (tocando) {
      parar();
      setTocando(false);
    } else {
      setTocando(true);
      falar(texto, () => setTocando(false));
    }
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={tocando ? 'Parar áudio' : `${rotulo} em português`}
      className={`btn-claro !min-h-[48px] !px-4 ${className}`}
    >
      {tocando ? <IcParar /> : <IcVolume />}
      {tocando ? 'Parar' : rotulo}
    </button>
  );
}
