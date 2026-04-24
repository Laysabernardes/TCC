import { PageErrorState } from '../components/PageErrorState';

export default function NotFound() {
  return (
    <PageErrorState
      code="404"
      title="Página não encontrada"
      description="O endereço que você acessou não existe ou foi movido. Confira o link ou use o botão abaixo para retornar à página inicial da Usina Guará."
    />
  );
}
