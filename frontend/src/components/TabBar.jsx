export default function TabBar({ abas, ativa, onChange }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 inset-x-0 z-20 bg-folha border-t-2 border-tinta pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto max-w-xl grid grid-cols-4">
        {abas.map(({ id, rotulo, Icone }) => {
          const on = ativa === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                aria-current={on ? 'page' : undefined}
                className={`w-full min-h-[64px] flex flex-col items-center justify-center gap-0.5 text-[0.85rem] font-titulo font-bold ${
                  on ? 'text-esmeralda' : 'text-tinta/70'
                }`}
              >
                <span className={`px-4 py-1 rounded-full transition-colors ${on ? 'bg-esmeralda/15' : ''}`}>
                  <Icone />
                </span>
                {rotulo}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
