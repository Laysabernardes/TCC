import { Link } from 'react-router-dom';
import type { PerspectiveResponseType } from '../components/FormPerspective/perspective.types';
import { ContentBlockRenderer } from '../components/ContentBlockRenderer/index'; // Assumindo que o renderizador está aqui

interface PerspectiveDetailViewProps {
  perspective: PerspectiveResponseType;
  otherPerspectives: PerspectiveResponseType[];
}

export function PerspectiveDetailView({ perspective, otherPerspectives }: PerspectiveDetailViewProps) {
  return (
    <article className="bg-gray-900 text-gray-200">
      {/* Seção do Banner */}
      <header 
        className="relative w-full h-[60vh] flex items-center justify-center text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${perspective.banner})` }}
      >
        <div className="p-4">
          <p className="text-lg mb-2">Projeto</p>
          <h1 className="text-4xl md:text-6xl font-bold">{perspective.projectId.title}</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Navegação entre Perspectivas */}
        <nav className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12 border-b-2 border-red-600 pb-6">
          {otherPerspectives.map(p => (
            <Link 
              key={p._id} 
              to={`/perspectivas/${p.slug}`}
              className={`px-4 py-2 text-sm rounded-md transition font-semibold ${p.slug === perspective.slug 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            >
              Pers. {p.order}
            </Link>
          ))}
        </nav>

        {/* Renderizador do Conteúdo em Blocos */}
        <ContentBlockRenderer blocks={perspective.contentBlocks} />
      </div>

      {/* Seção CTA (Call to Action) */}
      <section className="bg-red-700 text-white text-center py-12 px-4">
        <h2 className="text-3xl font-bold mb-2">#manguazalvivo</h2>
        <p className="max-w-2xl mx-auto mb-6">Urbanização da Vila Esperança - Preservando ecossistemas enquanto desenvolvemos comunidades.</p>
        <button className="bg-white text-red-700 font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition">
          Apoiar Campanha
        </button>
      </section>
    </article>
  );
}