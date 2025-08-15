import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeInput, Textarea, Selection, MultiSelect } from "../inputs";
import { FaGear } from "react-icons/fa6";
import { PerspectiveService } from "../../service/perspective.service";

export const FormPerspectiveData = z.object({
  _id: z.string().optional(),
  project_id: z.string(),
  perspective_title: z.string().min(1, "Nome obrigatório"),
  perspective_slug: z.string().min(1, "Slug obrigatório"),
  perspective_order: z.number().optional(),
  perspective_content: z.array(z.string()).optional(),
  perspective_imgs: z.array(z.string()).optional(),
  perspective_refs: z.array(z.string()).optional(),
  perspective_people: z.array(z.string()).optional(),
});

export function FormPerspective({ action }: { action: string }) {
  let token = localStorage.getItem("authToken");
  if (!token) {
    alert("perdeu token");
    token = "";
  }

  const { register, setValue, watch, reset } = useForm({
    resolver: zodResolver(FormPerspectiveData),
  });
  // const [allPerspectives, setAllPerspectives] = useState<any>(null);
  const [perspectiveId, setPerspectiveId] = useState<string | null>(null);

  //Endpoint pra pegar pessoas
  const people = [
    { id: "1", text: "Laysa" },
    { id: "2", text: "Lucas" },
    { id: "3", text: "Rogério" },
  ];

  // Endpoint Pegar Perspectivas
  const allPerspectives = [
    {
      id: "1",
      project_id: "1",
      perspective_title: "Perspectiva 1",
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
      perspective_title: "Perspectiva 2",
      perspective_slug: "",
      perspective_order: 2,
      perspective_template: 1,
      perspective_content: ["def", "456"],
      perspective_imgs: [],
      perspective_editoria: ["Usina", "Guará"],
      perspective_refs: ["https://abc", "https://123"],
      perspective_people: ["1", "2"],
    },
  ];

  const handleSelectPerspective = () => {
    const perspective = allPerspectives.find((p) => p.id === perspectiveId);
    if (!perspective) return;

    setValue("_id", perspective.id);
    setValue("project_id", perspective.project_id);
    setValue("perspective_title", perspective.perspective_title);
    setValue("perspective_slug", perspective.perspective_slug);
    setValue("perspective_order", perspective.perspective_order);
    setValue("perspective_content", perspective.perspective_content);
    setValue("perspective_imgs", perspective.perspective_imgs);
    setValue("perspective_refs", perspective.perspective_refs);
    setValue("perspective_people", perspective.perspective_people);
  };

  const resolveIds = (data: any[], text: string) => {
    return data.map((d) => ({
      id: d._id,
      text: d[text],
    }));
  };

  // Ao selecionar uma perspectiva
  useEffect(() => {
    if (perspectiveId) {
      handleSelectPerspective();
    }
  }, [perspectiveId]);

  // Ao trocar action
  useEffect(() => {
    setPerspectiveId(null);
    reset();
  }, [action]);

  //On init (REATIVAR COM BUSCA NO BANCO DE DADOS)
  // useEffect(() => {
  //   try {
  //     getAllPerspectives();
  //   } catch (e) {
  //     console.log("erro ao buscar clientes");
  //   }
  // }, []);

  return (
    <>
      {(action === "Update" || action === "Delete") && allPerspectives && (
        <Selection
          id="perspective_id"
          title="Selecione uma Perspectiva"
          placeholder="-"
          icon={<FaGear />}
          options={resolveIds(allPerspectives, "perspective_title")}
          onChange={(e) => setPerspectiveId(e.target.value)}
          value={perspectiveId ?? "-"}
          required={true}
        />
      )}
      {(action === "Create" || action === "Update") && allPerspectives && (
        <>
          <TypeInput
            id="perspective_title"
            title="Nome da Perspectiva"
            type="text"
            placeholder="Digite o nome"
            icon={<FaGear />}
            required={true}
            {...register("perspective_title")}
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
          <MultiSelect
            id="perspective_people"
            name="perspective_people"
            title="Integrantes"
            placeholder="Selecione os integrantes"
            icon={<FaGear />}
            options={people}
            required
            value={watch("perspective_people")}
            setValue={(value) => setValue("perspective_people", value)}
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
      )}
    </>
  );
}
