import { useState } from 'react';
import TabBar from './components/TabBar';
import { IcCasa, IcEscudo, IcChave, IcLivro } from './components/Icons';
import Inicio from './screens/Inicio';
import Simulador from './screens/Simulador';
import Senhas from './screens/Senhas';
import Tradutor from './screens/Tradutor';
import Gestao from './screens/Gestao';
import { useProgresso } from './lib/store';
import { useCasos, useParticipante } from './lib/hooks';
import { parar } from './lib/speech';

const ABAS = [
  { id: 'inicio', rotulo: 'Início', Icone: IcCasa },
  { id: 'simulador', rotulo: 'Simulador', Icone: IcEscudo },
  { id: 'senhas', rotulo: 'Senhas', Icone: IcChave },
  { id: 'tradutor', rotulo: 'Tradutor', Icone: IcLivro },
];

export default function App() {
  const [aba, setAba] = useState('inicio');
  const [secao, setSecao] = useState(null);
  const [gestao, setGestao] = useState(false);
  const { progresso, registrar, limpar } = useProgresso();
  const { casos, recarregar } = useCasos();
  const { participante, criar, sair } = useParticipante();

  const ir = (destino, opcoes = {}) => {
    parar();
    setSecao(opcoes.secao || null);
    setGestao(false);
    setAba(destino);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <main className="mx-auto max-w-xl px-4 pt-4 pb-32 min-h-screen">
        {gestao ? (
          <Gestao onVoltar={() => ir('inicio')} recarregarCasos={recarregar} />
        ) : (
          <>
            {aba === 'inicio' && <Inicio progresso={progresso} casos={casos} ir={ir} abrirGestao={() => setGestao(true)} />}
            {aba === 'simulador' && (
              <Simulador casos={casos} participante={participante} criarParticipante={criar} sairParticipante={sair}
                progresso={progresso} registrar={registrar} limpar={limpar} />
            )}
            {aba === 'senhas' && <Senhas />}
            {aba === 'tradutor' && <Tradutor key={secao || 'glossario'} secaoInicial={secao} />}
          </>
        )}
      </main>
      <TabBar abas={ABAS} ativa={gestao ? '' : aba} onChange={ir} />
    </>
  );
}
