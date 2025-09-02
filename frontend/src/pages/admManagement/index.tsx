/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Selection } from "../../components/inputs";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import usinaGuara from "../../assets/usinaGuara.webp";

import { FormProject } from "../../components/formProject";
import { FormPerspective } from "../../components/formPerspective";

function AdmManagement() {
  const [action, setAction] = useState("");
  const [collection, setCollection] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  let token = localStorage.getItem("authToken");

  if (!token) {
    setFeedback({
      type: "error",
      message: "perdeu token de acesso!",
    });
    token = "";
  }

  // Obter feedback
  useEffect(() => {
    const feedback = document.getElementById("feedback");
    feedback?.classList.remove("fade_out");
    setTimeout(() => {
      feedback?.classList.add("fade_out");
    }, 5000);
  }, [feedback]);

  // Ao mudar a collection
  useEffect(() => {
    setAction("-");
  }, [collection]);

  return (
    <div
      id="hero"
      className="w-[100%] h-[100vh] flex flex-col items-center bg-dark-1"
    >
      <section className="w-[95%] h-200 max-h-150 flex flex-row bg-dark-2 rounded-lg mt-16 mb-16">
        <div className="hidden w-1/3 bg-dark-2 rounded-s-lg md:block">
          <img
            src={usinaGuara}
            alt="background Usina Guará"
            className="w-full h-full object-cover rounded-s-lg"
          />
        </div>
        <div className="flex flex-col w-full md:w-2/3">
          <div className="p-10 h-full">
            <div className="flex justify-between items-start gap-5 pb-5 flex-col-reverse sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold text-light-3 flex gap-2 items-center">
                <FaGear className="h-7 w-7 sm:h-5 w-5*" />
                Formulário Administrador
              </h2>
              <div id="goback" className="w-max">
                <Link
                  to="/"
                  className="text-red-3 text-1xl cursor-pointer flex items-center gap-2 transition-all hover:text-red-2"
                >
                  Voltar <RiArrowGoBackFill />
                </Link>
              </div>
            </div>

            <div className="overflow-y-auto overflow-visible h-110 sm:h-120 pr-5">
              <div
                id="feedback"
                className={`p-3 my-4 rounded-lg text-white text-center transition ${
                  feedback?.type === "success"
                    ? "bg-green-500/80"
                    : "bg-red-500/80"
                }`}
              >
                {feedback?.message}
              </div>

              <Selection
                id="colection"
                title="Selecione uma coleção"
                placeholder="-"
                icon={<FaGear />}
                options={[
                  { id: "Project", text: "Projeto" },
                  { id: "Perspective", text: "Perspectiva" },
                  { id: "Timeline", text: "Linha do Tempo" },
                  { id: "People", text: "Pessoas" },
                ]}
                onChange={(e) => setCollection(e.target.value)}
                required={true}
              />
              <Selection
                id="action"
                title="Selecione uma ação"
                placeholder="-"
                icon={<FaGear />}
                options={[
                  { id: "Create", text: "Criar" },
                  { id: "Update", text: "Atualizar" },
                  { id: "Delete", text: "Deletar" },
                ]}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required={true}
              />
              {/* Formulário caso action = Create ou Update */}
              {collection === "Project" ? (
                <FormProject
                  token={token}
                  action={action}
                  setFeedback={setFeedback}
                />
              ) : collection === "Perspective" ? (
                <FormPerspective action={action} />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdmManagement;
