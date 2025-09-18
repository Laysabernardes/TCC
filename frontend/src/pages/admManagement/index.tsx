import { useEffect, useState } from "react";
import { Selection } from "../../components/inputs";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";

//import { FormProject } from "../../components/formProject/index";
import { FormPerspective } from "../../features/perpectives/components/FormPerspective/index";

// Tipos para garantir a consistência do nosso estado
type CollectionType = "Project" | "Perspective" | "Timeline" | "People" | "";
type ActionType = "Create" | "Update" | "Delete" | "";
type FeedbackType = { type: "success" | "error"; message: string };

export default function AdmManagement() {
  const [action, setAction] = useState<ActionType>("");
  const [collection, setCollection] = useState<CollectionType>("");
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);

  // Efeito para o feedback desaparecer após 5 segundos
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Efeito para resetar a ação quando a coleção muda
  useEffect(() => {
    setAction(""); // Reseta para o valor inicial vazio
  }, [collection]);
  
  // Função que será passada para os formulários filhos
  const handleFormSubmit = () => {
    setFeedback({ type: "success", message: "Operação concluída com sucesso!" });
    // Reseta as seleções para o estado inicial após a submissão
    setAction("");
    setCollection("");
  };

  return (
    <div
      id="hero"
      className="w-full min-h-screen flex flex-col items-center bg-dark-1 p-4"
    >
      <section className="w-full max-w-4xl bg-dark-2 rounded-lg my-16 shadow-lg">
        <div className="flex flex-col w-full">
          <div className="p-8 md:p-10 h-full">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-light-3 flex gap-3 items-center">
                <FaGear />
                Formulário Administrador
              </h2>
              <Link to="/" className="text-red-3 text-sm cursor-pointer flex items-center gap-2 transition-all hover:text-red-2">
                Voltar <RiArrowGoBackFill />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Componente de Feedback renderizado aqui */}
              {feedback && (
                <div
                  className={`p-3 rounded-lg text-white text-center transition-opacity duration-300 ${
                    feedback.type === "success" ? "bg-green-600/90" : "bg-red-600/90"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Selection
                  id="collection"
                  title="Selecione uma coleção"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value as CollectionType)}
                  options={[
                    { id: "Project", text: "Projetos" },
                    { id: "Perspective", text: "Perspectivas" },
                    // { id: "Timeline", text: "Linha do Tempo" },
                    // { id: "People", text: "Pessoas" },
                  ]}
                  required
                />
                <Selection
                  id="action"
                  title="Selecione uma ação"
                  value={action}
                  onChange={(e) => setAction(e.target.value as ActionType)}
                  options={[
                    { id: "Create", text: "Criar" },
                    { id: "Update", text: "Atualizar" },
                    { id: "Delete", text: "Deletar" },
                  ]}
                  required
                  disabled={!collection}
                />
              </div>
              <div className="mt-6 border-t border-gray-700 pt-6">
                {collection === "Project" && action ? (
                  <div className="p-4 border border-dashed border-gray-600 rounded-md">
                    <p className="text-gray-400 text-center">O formulário de Projetos será implementado aqui.</p>
                  </div>
                ) : collection === "Perspective" && action ? (
                  <FormPerspective 
                    action={action} 
                    onFormSubmit={handleFormSubmit}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}