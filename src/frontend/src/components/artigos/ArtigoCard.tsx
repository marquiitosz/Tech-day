import React from 'react';
import type { ArtigoEmpreendedorismo } from '../../data/artigosEmpreendedorismo';

interface ArtigoCardProps {
  artigo: ArtigoEmpreendedorismo;
  onSelecionar: (artigo: ArtigoEmpreendedorismo) => void;
}

export const ArtigoCard: React.FC<ArtigoCardProps> = ({ artigo, onSelecionar }) => {
  return (
    <article className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 transition duration-200 hover:-translate-y-1 shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {artigo.categoria}
          </span>
          <span className="text-slate-400">{artigo.tempoLeitura}</span>
        </div>

        <h3 
          onClick={() => onSelecionar(artigo)}
          className="text-lg font-bold text-white leading-snug hover:text-indigo-300 transition cursor-pointer"
        >
          {artigo.titulo}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed">
          {artigo.resumo}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Publicado em {artigo.data}</span>
        <button
          type="button"
          onClick={() => onSelecionar(artigo)}
          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          Ler artigo &rarr;
        </button>
      </div>
    </article>
  );
};
