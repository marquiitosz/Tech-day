import React, { useEffect } from 'react';
import type { ArtigoEmpreendedorismo } from '../../data/artigosEmpreendedorismo';

interface ArtigoModalProps {
  artigo: ArtigoEmpreendedorismo | null;
  onFechar: () => void;
}

export const ArtigoModal: React.FC<ArtigoModalProps> = ({ artigo, onFechar }) => {
  useEffect(() => {
    function tratarKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    if (artigo) {
      window.addEventListener('keydown', tratarKeyDown);
    }
    return () => window.removeEventListener('keydown', tratarKeyDown);
  }, [artigo, onFechar]);

  if (!artigo) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-artigo-modal"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8 relative">
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar artigo"
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg transition cursor-pointer"
        >
          ✕
        </button>

        <header className="space-y-3 pr-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {artigo.categoria}
            </span>
            <span className="text-slate-400">{artigo.tempoLeitura}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{artigo.data}</span>
          </div>

          <h2 id="titulo-artigo-modal" className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {artigo.titulo}
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed italic">
            {artigo.resumo}
          </p>
        </header>

        <div className="space-y-6 text-slate-200 text-sm md:text-base leading-relaxed">
          {artigo.secoes.map((secao, idx) => (
            <section key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-indigo-200">
                {secao.subtitulo}
              </h3>
              {secao.paragrafos.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-300">
                  {p}
                </p>
              ))}
              {secao.pontosChave && secao.pontosChave.length > 0 && (
                <ul className="list-disc list-inside bg-slate-800/50 p-4 rounded-xl space-y-1.5 border border-slate-700/60 text-sm text-slate-200">
                  {secao.pontosChave.map((pt, ptIdx) => (
                    <li key={ptIdx}>{pt}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Conclusão Prática
          </h4>
          <p className="text-sm text-indigo-200 font-medium">
            {artigo.conclusaoPratica}
          </p>
        </div>

        {artigo.avisoLegal && (
          <p className="text-xs text-slate-500 italic border-t border-slate-800/80 pt-3">
            * {artigo.avisoLegal}
          </p>
        )}

        <footer className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onFechar}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            Concluir Leitura
          </button>
        </footer>
      </div>
    </div>
  );
};
