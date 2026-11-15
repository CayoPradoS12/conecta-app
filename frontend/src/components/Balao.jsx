/** Simula a tela do celular com a mensagem do caso. Trechos [[assim]] são sublinhados ao revelar. */
function Texto({ texto, revelar }) {
  return texto.split(/(\[\[.*?\]\])/g).map((parte, i) => {
    if (parte.startsWith('[[')) {
      const conteudo = parte.slice(2, -2);
      return revelar ? <span key={i} className="grifo text-terracota">{conteudo}</span> : <span key={i}>{conteudo}</span>;
    }
    return <span key={i}>{parte}</span>;
  });
}

export default function Balao({ caso, revelar }) {
  const ehImagem = (m) => m.startsWith('[Imagem');
  return (
    <figure className="rounded-2xl border-2 border-tinta overflow-hidden bg-areia" aria-label="Mensagem recebida">
      <figcaption className="azulejo text-papel px-4 py-2 flex items-center justify-between gap-2">
        <span className="font-titulo font-bold text-sm truncate">{caso.remetente}</span>
        <span className="selo border-papel/60 text-papel/90 shrink-0">{caso.canal}</span>
      </figcaption>
      <div className="p-3 space-y-2">
        {caso.mensagens.map((m, i) =>
          ehImagem(m) ? (
            <div key={i} className="max-w-[85%] rounded-xl border-2 border-dashed border-tinta/40 bg-folha px-3 py-6 text-center text-sm text-tinta/70">
              {m.replace(/^\[Imagem: |\]$/g, '')}
            </div>
          ) : (
            <p key={i} className="max-w-[92%] rounded-2xl rounded-tl-sm bg-folha border border-tinta/20 px-3 py-2 text-[1.05rem] leading-snug animate-sobe" style={{ animationDelay: `${i * 90}ms` }}>
              <Texto texto={m} revelar={revelar} />
            </p>
          )
        )}
      </div>
    </figure>
  );
}
