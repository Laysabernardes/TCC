/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formService, type ProjectRequest } from "../../service/formService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TypeInput,
  Textarea,
  Selection,
  MultiSelect,
} from "../../components/inputs";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import usinaGuara from "../../assets/usinaGuara.webp";

// Função de normalização para o Zod
function normalizeDelimitedText(input: string): string[] {
  return input
    .split(/[\n;,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

const FormSchema = z.object({
  // Reutilizaveis
  _id: z.string().optional(),
  project_id: z.string().optional(),

  // Project
  project_name: z.string().optional(),
  project_slug: z.string().optional(),
  project_about_html: z.string().optional(),
  project_team: z.array(z.string()).optional(),

  // Perspective
  perspective_name: z.string().min(1, "Nome obrigatório").optional(),
  perspective_slug: z.string().min(1, "Slug obrigatório").optional(),
  perspective_order: z.number().optional(),
  perspective_template: z.number().optional(),
  perspective_content: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      typeof val === "string" ? normalizeDelimitedText(val) : val
    )
    .refine((val) => val.length > 0, {
      message: "Conteúdo é obrigatório",
    })
    .optional(),
  perspective_imgs: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      typeof val === "string" ? normalizeDelimitedText(val) : val
    )
    .optional(),
  perspective_editoria: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      typeof val === "string" ? normalizeDelimitedText(val) : val
    )
    .refine((val) => val.length > 0, {
      message: "Digite ao menos uma editoria",
    })
    .optional(),
  perspective_refs: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      typeof val === "string" ? normalizeDelimitedText(val) : val
    )
    .refine((val) => val.length > 0, {
      message: "Digite ao menos uma referência",
    })
    .optional(),
  perspective_people: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof FormSchema>;

function AdmManagement() {
  const { register, setValue, watch, handleSubmit, reset, getValues } = useForm(
    {
      resolver: zodResolver(FormSchema),
    }
  );
  const [allProjects, setAllProjects] = useState<any>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [perspectiveId, setPerspectiveId] = useState<string | null>(null);
  let token = localStorage.getItem("authToken");
  if (!token) {
    alert("perdeu token");
    token = "";
  }

  // Endpoint Pegar Projetos
  const getAllProjects = async () => {
    try {
      const response = await formService.getAllProjects(token);
      setAllProjects(response);
    } catch (e) {
      console.log(e);
    }
  };

  // OnInit
  useEffect(() => {
    getAllProjects();
  }, []);

  // Endpoint Pegar Perspectivas
  const allPerspectives = [
    {
      id: "1",
      project_id: "1",
      perspective_name: "Perspectiva 1",
      perspective_slug: "",
      perspective_order: 1,
      perspective_template: 1,
      perspective_content: ["Abc", "123"],
      perspective_imgs: [".png", ".jpeg"],
      perspective_editoria: ["Usina", "Guará"],
      perspective_refs: ["https://abc", "https://123"],
      perspective_people: ["1"],
    },
    {
      id: "2",
      project_id: "1",
      perspective_name: "Perspectiva 2",
      perspective_slug: "",
      perspective_order: 2,
      perspective_template: 1,
      perspective_content: ["def", "456"],
      perspective_imgs: [null],
      perspective_editoria: ["Usina", "Guará"],
      perspective_refs: ["https://abc", "https://123"],
      perspective_people: ["1", "2"],
    },
  ];

  // Endpoint Pegar Pessoas
  const people = [
    { id: "1", text: "Laysa" },
    { id: "2", text: "Lucas" },
    { id: "3", text: "Rogério" },
  ];

  const [action, setAction] = useState("");
  const [collection, setCollection] = useState("");

  const resolveIds = (data: any[], text: string) => {
    return data.map((d) => ({
      id: d._id,
      text: d[text],
    }));
  };

  const handleSelectCollection = (c: string) => {
    if (c === "Project" && allProjects != null) {
      const project = allProjects.find((p: any) => p._id === projectId);
      if (!project) return;

      setValue("_id", project.id);
      setValue("project_name", project.project_name);
      setValue("project_slug", project.project_slug);
      setValue("project_about_html", project.project_about_html);
      setValue("project_team", project.project_team);
      console.log(project);
    } else if (c === "Perspective") {
      const perspective = allPerspectives.find((p) => p.id === perspectiveId);
      if (!perspective) return;

      setValue("_id", perspective.id);
      setValue("project_id", perspective.project_id);
      setValue("perspective_name", perspective.perspective_name);
      setValue("perspective_slug", perspective.perspective_slug);
      setValue("perspective_order", perspective.perspective_order);
      setValue("perspective_template", perspective.perspective_template);
      setValue("perspective_content", perspective.perspective_content);
      setValue(
        "perspective_imgs",
        perspective.perspective_imgs?.filter(
          (img): img is string => img !== null
        )
      );
      setValue("perspective_editoria", perspective.perspective_editoria);
      setValue("perspective_refs", perspective.perspective_refs);
      setValue("perspective_people", perspective.perspective_people);
    } else {
      return;
    }
  };

  const handleSubmitForm = async (data: FormData) => {
    if (collection === "Project") {
      const projectData: ProjectRequest = {
        _id: data._id,
        project_name: data.project_name,
        project_slug: data.project_slug,
        project_about_html: data.project_about_html,
        project_team: data.project_team,
      };

      if (projectData === undefined) {
        return;
      }

      if (action === "Create") {
        try {
          const response = formService.createProject(token, projectData);
          alert("Projeto Criado");
          console.log(response);
        } catch (e) {
          console.log(e);
        }
      } else if (action === "Update") {
        try {
          const response = formService.updateProject(token, projectData);
          alert("Projeto Criado");
          console.log(response);
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          const response = formService.deleteProject(token, projectData._id);
          alert("Projeto Criado");
          console.log(response);
        } catch (e) {
          console.log(e);
        }
      }
    } else if (collection === "Perspective") {
      const perspectiveData = {
        id: data._id,
        project_id: data.project_id,
        perspective_name: data.perspective_name,
        perspective_slug: data.perspective_slug,
        perspective_order: data.perspective_order,
        perspective_template: data.perspective_template,
        perspective_content: data.perspective_content,
        perspective_imgs: data.perspective_imgs,
        perspective_editoria: data.perspective_editoria,
        perspective_refs: data.perspective_refs,
        perspective_people: data.perspective_people,
      };

      if (action === "Create") {
        console.log("createPerspective(perspectiveData)");
        console.log(perspectiveData);
      } else if (action === "Update") {
        console.log("updatePerspective(perspectiveData)");
        console.log(perspectiveData);
      } else {
        console.log("deletePerspective(perspectiveData.id)");
        console.log(perspectiveData.id);
      }
    }
  };

  const setNullToCollections = () => {
    setProjectId(null);
    setPerspectiveId(null);
    reset();
  };

  // Ao mudar a collection
  useEffect(() => {
    setAction("-");
    setNullToCollections();
  }, [collection]);

  // Ao mudar a ação
  useEffect(() => {
    setNullToCollections();
  }, [action]);

  // Ao selecionar um projeto
  useEffect(() => {
    if (projectId) {
      handleSelectCollection("Project");
      console.log(allProjects);
      console.log(projectId);
      console.log(getValues());
    }
  }, [projectId]);

  // Ao selecionar uma perspectiva
  useEffect(() => {
    if (perspectiveId) {
      handleSelectCollection("Perspective");
    }
  }, [perspectiveId]);

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
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required={true}
              />
              {/* Selection que cataloga a collection do banco */}
              {(action === "Update" || action === "Delete") && (
                <>
                  {collection === "Project" ? (
                    <Selection
                      id="project_id"
                      title="Selecione um Projeto"
                      placeholder="-"
                      icon={<FaGear />}
                      options={resolveIds(allProjects, "project_name")}
                      onChange={(e) => setProjectId(e.target.value)}
                      required={true}
                    />
                  ) : collection === "Perspective" ? (
                    <Selection
                      id="perspective_id"
                      title="Selecione uma Perspectiva"
                      placeholder="-"
                      icon={<FaGear />}
                      options={resolveIds(allPerspectives, "perspective_name")}
                      onChange={(e) => setPerspectiveId(e.target.value)}
                      required={true}
                    />
                  ) : null}
                </>
              )}
              {/* Formulário caso action = Create ou Update */}
              {(action === "Create" ||
                (action === "Update" &&
                  (projectId != null || perspectiveId != null))) && (
                <>
                  {collection === "Project" ? (
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
                        id="project_team"
                        name="project_team"
                        title="Integrantes"
                        placeholder="Selecione os integrantes"
                        icon={<FaGear />}
                        options={people}
                        required
                        value={watch("project_team")}
                        setValue={(value) => setValue("project_team", value)}
                      />
                      <Textarea
                        id="project_about_html"
                        title="Sobre o Projeto"
                        placeholder="Digite o nome"
                        icon={<FaGear />}
                        required={true}
                        {...register("project_about_html")}
                      />
                    </>
                  ) : collection === "Perspective" ? (
                    <>
                      <TypeInput
                        id="perspective_name"
                        title="Nome da Perspectiva"
                        type="text"
                        placeholder="Digite o nome"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_name")}
                      />
                      <TypeInput
                        id="perspective_slug"
                        title="Nome para URL"
                        type="text"
                        placeholder="Digite um nome para URL"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_slug")}
                      />
                      <TypeInput
                        id="perspective_order"
                        title="Ordem de aparição"
                        type="number"
                        placeholder="1"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_order", {
                          valueAsNumber: true,
                        })}
                      />
                      <TypeInput
                        id="perspective_template"
                        title="Template Design"
                        type="number"
                        placeholder="1"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_template", {
                          valueAsNumber: true,
                        })}
                      />
                      <Textarea
                        id="perspective_content"
                        title="Conteúdo"
                        placeholder="Digite o nome"
                        icon={<FaGear />}
                        required={false}
                        {...register("perspective_content")}
                      />
                      <TypeInput
                        id="perspective_imgs"
                        title="Imagens"
                        type="text"
                        placeholder="Links das imagens"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_imgs")}
                      />
                      <TypeInput
                        id="perspective_editoria"
                        title="Editoria"
                        type="text"
                        placeholder="Usina Guará, Outros"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_editoria")}
                      />
                      <MultiSelect
                        id="perspective_people"
                        name="perspective_people"
                        title="Integrantes"
                        placeholder="Selecione os integrantes"
                        icon={<FaGear />}
                        options={people}
                        required
                        value={watch("perspective_people")}
                        setValue={(value) =>
                          setValue("perspective_people", value)
                        }
                      />
                      <TypeInput
                        id="perspective_refs"
                        title="Referências"
                        type="text"
                        placeholder="Links das referências"
                        icon={<FaGear />}
                        required={true}
                        {...register("perspective_refs")}
                      />
                    </>
                  ) : null}
                </>
              )}
              {collection != "" && (action != "-" || action != "-") && (
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
