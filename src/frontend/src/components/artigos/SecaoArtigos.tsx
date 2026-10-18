import React, { useState } from 'react';
import { ARTIGOS_EMPREENDEDORISMO } from '../../data/artigosEmpreendedorismo';
import type { ArtigoEmpreendedorismo } from '../../data/artigosEmpreendedorismo';
import { ArtigoCard } from './ArtigoCard';
import { ArtigoModal } from './ArtigoModal';

const CATEGORIAS_ARTIGOS = ['Todas', 'Início de Negócio', 'MEI & Legalização', 'Finanças', 'Marketing'];

export const SecaoArtigos: React.FC = () => {
  const [categoria, setCategoria] = useState<string>('Todas');
  const [busca, setBusca] = useState<string>('');
  const [artigoAtivo, setArtigoAtivo] = useState<ArtigoEmpreendedorismo | null>(null);

  const artigosFiltrados = ARTIGOS_EMPREENDEDORISMO.filter((art) => {
    const bateCat = categoria === 'Todas' || art.categoria === categoria;
    const termo = busca.toLowerCase();
    const bateBusca = art.titulo.toLowerCase().includes(termo) || art.resumo.toLowerCase().includes(termo);
    return bateCat && bateBusca;
  });

  return (
    <section className="mt-12 pt-10 border-t border-slate-800/80 space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Artigos & Guias Especializados
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Dicas Práticas para o seu Dia a Dia
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Aprofunde seu conhecimento com artigos estruturados sobre os principais pilares do empreendedorismo moderno.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS_ARTIGOS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoria(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                categoria === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar nos artigos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {artigosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigosFiltrados.map((artigo) => (
            <ArtigoCard 
              key={artigo.id} 
              artigo={artigo} 
              onSelecionar={setArtigoAtivo} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">
          Nenhum artigo encontrado para o filtro aplicado.
        </div>
      )}

      <ArtigoModal 
        artigo={artigoAtivo} 
        onFechar={() => setArtigoAtivo(null)} 
      />
    </section>
  );
};
