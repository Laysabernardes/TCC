import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TypeInput,
  Textarea,
  Selection,
  MultiSelect,
} from "../../components/inputs";
import { FaGear } from "react-icons/fa6";
import { ProjectService } from "../../service/project.service";
import { PeopleService } from "../../service/people.service";
import type ProjectRequest from "../../dto/request/projectRequest";
import type ProjectResponse from "../../dto/response/projectResponse";
import type PeopleRequest from "../../dto/request/peopleRequest";
import type PeopleResponse from "../../dto/response/peopleResponse";

const FormProjectData = z.object({
  _id: z.string().optional(),
  project_title: z.string(),
  project_subtitle: z.string().optional(),
  project_slug: z.string(),
  project_about_html: z.string().optional(),
  project_team: z.array(z.string()).optional(),
  project_status: z.string(),
  isCarrossel: z.boolean(),
  orderCarrossel: z.number().optional(),
  banner: z.string().optional(),
  extraURL: z.string().optional(),
});

export function FormProject({
  token,
  action,
  setFeedback,
}: {
  token: string;
  action: string;
  setFeedback: (feedback: {
    type: "success" | "error";
    message: string;
  }) => void;
}) {
  const { register, setValue, watch, reset, getValues } = useForm({
    resolver: zodResolver(FormProjectData),
    defaultValues: {
      isCarrossel: false,
      project_status: "draft",
    },
  });

  const [projectId, setProjectId] = useState<string | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectResponse[]>();
  const [allPeople, setAllPeople] = useState<PeopleResponse[]>();

  //Endpoint pra pegar pessoas
  const getAllPeople = async () => {
    try {
      const response = await PeopleService.getAllPeople(token);
      setAllPeople(response);
    } catch (e) {
      console.log(e);
    }
  };

  // Endpoint Pegar Projetos
  const getAllProjects = async () => {
    try {
      const response = await ProjectService.getAllProjects(token);
      setAllProjects(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectProject = () => {
    const project: ProjectRequest = allProjects?.find(
      (p: ProjectResponse) => p._id === projectId
    )!;
    if (!project) return;
    setValue("_id", project._id);
    setValue("project_title", project.project_title);
    setValue("project_subtitle", project.project_subtitle);
    setValue("project_slug", project.project_slug);
    setValue("project_about_html", project.project_about_html);
    setValue("project_team", project.project_team);
    setValue("project_status", project.project_status);
    setValue("isCarrossel", project.isCarrossel);
    setValue("orderCarrossel", project.orderCarrossel);
    setValue("banner", project.banner);
    setValue("extraURL", project.extraURL);
  };

  const resolveIds = (data: any[], text: string) => {
    return data.map((d) => ({
      id: d._id,
      text: d[text],
    }));
  };

  const handleSubmitProjectForm = async () => {
    const data = getValues();
    const projectData: ProjectRequest = {
      project_title: data.project_title,
      project_subtitle: data.project_subtitle,
      project_slug: data.project_slug,
      project_about_html: data.project_about_html,
      project_team: data.project_team,
      project_status: data.project_status,
      isCarrossel: data.isCarrossel,
      orderCarrossel: data.orderCarrossel,
      banner: data.banner,
      extraURL: data.extraURL,
    };

    try {
      if (action === "Create") {
        await ProjectService.createProject(token, projectData);
        setFeedback({
          type: "success",
          message: "Projeto criado com sucesso!",
        });
      } else if (action === "Update" && projectId != "-") {
        await ProjectService.updateProject(token, projectData, data._id);
        setFeedback({
          type: "success",
          message: "Projeto atualizado com sucesso!",
        });
      } else if (action === "Delete" && projectId != "-") {
        await ProjectService.deleteProject(token, data._id);
        setFeedback({
          type: "success",
          message: "Projeto deletado com sucesso!",
        });
      } else {
        setFeedback({ type: "error", message: "Erro: Ação desconhecida." });
      }
      getAllProjects();
      reset();
    } catch (e: any) {
      console.log(e);
      setFeedback({
        type: "error",
        message:
          "Erro ao executar a ação no projeto: " + e.response.data.message,
      });
    }
  };

  // Ao selecionar um projeto
  useEffect(() => {
    if (projectId) {
      handleSelectProject();
    }
  }, [projectId]);

  // Ao trocar orderCarrossel
  useEffect(() => {
    if (!watch("isCarrossel")) {
      setValue("orderCarrossel", undefined);
    }
  }, [watch("isCarrossel"), setValue]);

  // Ao trocar action
  useEffect(() => {
    setProjectId(null);
    reset();
  }, [action]);

  //OnInit
  useEffect(() => {
    try {
      getAllProjects();
    } catch (e) {
      setFeedback({
        type: "error",
        message: "Erro ao buscar projetos",
      });
    }
    try {
      getAllPeople();
    } catch (e) {
      setFeedback({
        type: "error",
        message: "Erro ao buscar pessoas",
      });
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitProjectForm();
      }}
    >
      {(action === "Update" || action === "Delete") && allProjects && (
        <Selection
          id="project_id"
          title="Selecione um Projeto"
          placeholder="-"
          icon={<FaGear />}
          options={resolveIds(allProjects, "project_title")}
          onChange={(e) => setProjectId(e.target.value)}
          value={projectId ?? "-"}
          required={true}
        />
      )}
      {(action === "Create" || action === "Update") && allProjects && (
        <>
          <TypeInput
            id="project_title"
            title="Título Projeto"
            type="text"
            placeholder="Digite o título"
            icon={<FaGear />}
            required={true}
            {...register("project_title")}
          />
          <TypeInput
            id="project_subtitle"
            title="Subtítulo Projeto"
            type="text"
            placeholder="Digite o subtítulo"
            icon={<FaGear />}
            required={false}
            {...register("project_subtitle")}
          />
          <Selection
            id="status"
            title="Status"
            placeholder="-"
            icon={<FaGear />}
            nullOption={false}
            options={[
              { id: "draft", text: "Rascunho" },
              { id: "published", text: "Público" },
            ]}
            {...register("project_status")}
            required={true}
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
          <TypeInput
            id="extraURL"
            title="URL Extra Carrossel"
            type="text"
            placeholder="Cole um link"
            icon={<FaGear />}
            required={false}
            {...register("extraURL")}
          />
          <TypeInput
            id="banner"
            title="Banner"
            type="text"
            placeholder="Cole um link"
            icon={<FaGear />}
            required={false}
            {...register("banner")}
          />
          <MultiSelect
            id="project_team"
            name="project_team"
            title="Integrantes"
            placeholder="Selecione os integrantes"
            icon={<FaGear />}
            options={resolveIds(allPeople!, "name")}
            required
            value={watch("project_team")}
            setValue={(value) => setValue("project_team", value)}
          />
          <Selection
            id="isCarrossel"
            title="Exibir Carrossel?"
            placeholder="-"
            icon={<FaGear />}
            nullOption={false}
            options={[
              { id: "false", text: "Não" },
              { id: "true", text: "Sim" },
            ]}
            required={false}
            onChange={(e) => setValue("isCarrossel", e.target.value === "true")}
            value={watch("isCarrossel") ? "true" : "false"}
          />
          {watch("isCarrossel") && (
            <>
              <Selection
                id="orderCarrossel"
                title="Ordem de aparição"
                placeholder="-"
                icon={<FaGear />}
                options={[
                  { id: 1, text: "1°" },
                  { id: 2, text: "2°" },
                  // USAR O GET ALL CARROSSEL ACTIVE ORDER
                ]}
                required={true}
                value={watch("isCarrossel") ? "true" : undefined}
                {...register("orderCarrossel")}
              />
            </>
          )}
          <Textarea
            id="project_about_html"
            title="Sobre o Projeto"
            placeholder="Digite o conteúdo"
            icon={<FaGear />}
            required={false}
            {...register("project_about_html")}
          />
        </>
      )}
      {action != "-" && (
        <button
          type="submit"
          className="w-full bg-red-2 text-1xl font-bold text-white text-center rounded-lg p-2 py-3 my-5 cursor-pointer transition hover:bg-red-1"
        >
          Submeter
        </button>
      )}
    </form>
  );
}
