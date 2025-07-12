/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiSelect, {
  TypeInput,
  Textarea,
  Selection,
} from "../../components/inputs";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import usinaGuara from "../../assets/usinaGuara.webp";

const ProjectSchema = z.object({
  id: z.number().optional(),
  project_name: z.string().min(1, "Nome obrigatório"),
  project_slug: z.string().min(1, "Slug obrigatório"),
  project_about: z.string().optional(),
  project_people: z.array(z.string()),
});
type ProjectFormData = z.infer<typeof ProjectSchema>;

function AdmManagement() {
  const { register, setValue, getValues, watch, handleSubmit, reset } = useForm(
    {
      resolver: zodResolver(ProjectSchema),
    }
  );

  const [projectId, setProjectId] = useState<number | null>(null);

  // Endpoint Pegar Projetos
  const allProjects = [
    {
      id: 1,
      project_name: "Projeto 1",
      project_slug: "alpha",
      project_about: "Projeto top",
      project_people: ["2"],
    },
    {
      id: 2,
      project_name: "Projeto 2",
      project_slug: "beta",
      project_about: "Projeto massa",
      project_people: ["1"],
    },
  ];

  const allProjectsId = () => {
    return allProjects.map((p) => ({
      id: p.id,
      text: p.project_name,
    }));
  };

  // Endpoint Pegar Pessoas
  const people = [
    { id: "1", text: "Laysa" },
    { id: "2", text: "Lucas" },
    { id: "3", text: "Rogério" },
  ];

  const [action, setAction] = useState("");
  const [collection, setCollection] = useState("");

  const handleSelectProject = () => {
    const project = allProjects.find((p) => p.id === projectId);
    if (!project) return;

    setValue("id", project.id);
    setValue("project_name", project.project_name);
    setValue("project_slug", project.project_slug);
    setValue("project_about", project.project_about);
    setValue("project_people", project.project_people);
  };

  const handleSubmitForm = (data: ProjectFormData) => {
    if (action === "Create") {
      console.log(data);
    } else if (action === "Update") {
      console.log(data);
    } else if (action === "Delete") {
      console.log(data.id);
    } else {
      throw new Error();
    }
  };

  // Ao selecionar um projeto
  useEffect(() => {
    if (projectId) {
      handleSelectProject();
    }
  }, [projectId]);

  // Ao mudar a ação
  useEffect(() => {
    reset();
    setProjectId(null);
  }, [action]);

  return (
    <div
      id="hero"
      className="w-[100%] h-[100vh] flex flex-col items-center bg-dark-1"
    >
      <section className="w-[95%] h-200 max-h-150 flex flex-row bg-dark-2 rounded-lg mt-16 mb-16">
        <div className="hidden w-1/2 bg-dark-2 rounded-s-lg md:block">
          <img
            src={usinaGuara}
            alt="background Usina Guará"
            className="w-full h-full object-cover rounded-s-lg"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 ">
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="p-5 sm:p-15"
          >
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
            <div className="overflow-y-auto overflow-visible h-100 pr-5">
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
                onChange={(e) => setAction(e.target.value)}
                required={true}
              />
              {collection === "Project" &&
                (action === "Update" || action === "Delete") && (
                  <>
                    <Selection
                      id="project_id"
                      title="Selecione projeto"
                      placeholder="-"
                      icon={<FaGear />}
                      options={allProjectsId()}
                      onChange={(e) => setProjectId(Number(e.target.value))}
                      required={true}
                    />
                  </>
                )}
              {collection === "Project" &&
                (action === "Create" ||
                  (action === "Update" && projectId != null)) && (
                  <>
                    <TypeInput
                      id="project_name"
                      title="Nome Projeto"
                      type="text"
                      placeholder="Digite o nome"
                      icon={<FaGear />}
                      required={true}
                      {...register("project_name")}
                    />
                    <TypeInput
                      id="project_slug"
                      title="Nome para URL"
                      type="text"
                      placeholder="Digite um nome para URL"
                      icon={<FaGear />}
                      required={true}
                      {...register("project_slug")}
                    />
                    <MultiSelect
                      id="project_people"
                      name="project_people"
                      title="Integrantes"
                      placeholder="Selecione os integrantes"
                      icon={<FaGear />}
                      options={people}
                      required
                      value={watch("project_people")}
                      setValue={(value) => setValue("project_people", value)}
                    />
                    <Textarea
                      id="project_about"
                      title="Sobre o Projeto"
                      placeholder="Digite o nome"
                      icon={<FaGear />}
                      required={true}
                      {...register("project_about")}
                    />
                  </>
                )}
              {collection && action && (
                <button
                  type="submit"
                  className="w-full bg-red-2 text-1xl font-bold text-white text-center rounded-lg p-2 py-3 my-5 cursor-pointer transition hover:bg-red-1"
                >
                  Submeter
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdmManagement;
