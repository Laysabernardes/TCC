import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PerspectiveService } from '../features/perpectives/components/perspective.service';
import type { PerspectiveResponseType } from '../features/perpectives/components/FormPerspective/perspective.types';
import { PerspectiveDetailView } from '../features/perpectives/components/PerspectiveDetailView';
import { PageLoadingShell } from '../components/PageLoadingShell';
import { PageErrorState } from '../components/PageErrorState';

export default function PerspectiveDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [perspective, setPerspective] = useState<PerspectiveResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) {
      setIsLoading(false);
      setError("Endereço inválido: falta o identificador do conteúdo na URL.");
      return;
    };

    async function loadInitialPerspective() {
      setIsLoading(true);
      setError(null);
      setPerspective(null);

      try {
        const perspectiveData = await PerspectiveService.getBySlug(slug as string);
        if (perspectiveData) {
          setPerspective(perspectiveData);
        } else {
          throw new Error("Perspective not found.");
        }
      } catch (err) {
        setError("Não foi possível obter os dados desta perspectiva. Verifique sua conexão ou tente novamente mais tarde.");
        setIsLoading(false);
      }
    }
    loadInitialPerspective();
  }, [slug]);

  useEffect(() => {
    if (!perspective) return;

    async function loadOtherPerspectives() {
      try {
        const projectId = perspective?.project?._id;
        if (!projectId) {
          console.error("projectId not found in perspective.");
          return;
        }
      } catch (err) {
        console.error("Falha ao carregar outras perspectivas:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOtherPerspectives();
  }, [perspective]);

  if (isLoading) {
    return <PageLoadingShell />;
  }
  if (error) {
    return (
      <PageErrorState
        title="Não foi possível carregar esta perspectiva"
        description={error}
      />
    );
  }
  if (!perspective) {
    return (
      <PageErrorState
        title="Perspectiva não encontrada"
        description="O capítulo ou conteúdo solicitado não está disponível. Você pode voltar ao início ou abrir outro projeto."
      />
    );
  }

  return <PerspectiveDetailView perspective={perspective}/>;
}