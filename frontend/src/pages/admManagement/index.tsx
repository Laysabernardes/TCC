/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MultiSelect, {
  TypeInput,
  Textarea,
  Selection,
} from "../../components/inputs";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import usinaGuara from "../../assets/usinaGuara.webp";

function AdmManagement() {
  const [form, setForm] = useState({
    // Projetos
    project_name: "",
    project_slug: "",
    project_about: "",
    project_people: [""],
    // Indexador para outras coleções
    project_id: "",
    // Perspectivas
    perspective_name: "",
    perspective_slug: "",
    perspective_order: 1,
    perspective_template: 1,
    perspective_content: [""],
    perspective_imgs: [""],
    perspective_editoria: [""],
    perspective_refs: [""],
    perspective_people: [],
    perspective_lastUpdate: "",
    // BlockTime
    blockTime_name: "",
    blockTime_order: 1,
    blockTime_content: "",
    blockTime_img: "",
    blockTime_lastUpdate: "",
    // Pessoas
    person_name: "",
    person_kind: "",
    person_description: [""],
    person_contact: "",
    person_img: "",
  });
  const [action, setAction] = useState("");
  const [collection, setCollection] = useState("");

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // APAGAR DEPOIS

  useEffect(() => {
    console.log(form);
  }, [form]);

  const people = [
    { id: "1", text: "Laysa" },
    { id: "2", text: "Lucas" },
    { id: "3", text: "Rogério" },
  ];

  //

  return (
    <div
      id="hero"
      className="w-[100%] h-[100vh] flex flex-col items-center bg-dark-1"
    >
      <section className="w-[95%] h-200 max-h-150 flex flex-row bg-dark-2 rounded-lg mt-16 mb-16">
        <div className="w-1/2 bg-dark-2 rounded-s-lg">
          <img
            src={usinaGuara}
            alt="background Usina Guará"
            className="w-full h-full object-cover rounded-s-lg"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <form action="" className="p-15">
            <div className="flex justify-between items-center pb-5">
              <h2 className="text-2xl font-bold text-light-3 flex gap-2 items-center">
                <FaGear className="h-5 w-5" />
                Formulário Administrador
              </h2>
              <div id="goback" className="w-max">
                <Link
                  to="/"
                  className="text-red-3 text-1xl cursor-pointer flex items-center gap-2 transition-all hover:text-red-2"
                >
                  Voltar pra home <RiArrowGoBackFill />
                </Link>
              </div>
            </div>
            <div className="overflow-y-auto overflow-visible h-100 pr-5">
              <Selection
                id="colection"
                name="colection"
                title="Selecione uma coleção"
                placeholder="Coleção"
                icon={<FaGear />}
                options={[
                  "Projeto",
                  "Perspectiva",
                  "Linha do Tempo",
                  "Pessoas",
                ]}
                onChange={(e) => setCollection(e.target.value)}
                required={true}
              />
              <Selection
                id="action"
                name="action"
                title="Selecione uma ação"
                placeholder="Ação"
                icon={<FaGear />}
                options={["Criar", "Atualizar", "Deletar"]}
                onChange={(e) => setAction(e.target.value)}
                required={true}
              />
              {collection === "Projeto" && action === "Criar" && (
                <>
                  <TypeInput
                    id="project_name"
                    name="project_name"
                    title="Nome Projeto"
                    type="text"
                    placeholder="Digite o nome"
                    icon={<FaGear />}
                    value={form.project_name}
                    onChange={handleChange}
                    required={true}
                  />
                  <TypeInput
                    id="project_slug"
                    name="project_slug"
                    title="Nome para URL"
                    type="text"
                    placeholder="Digite um nome para URL"
                    icon={<FaGear />}
                    value={form.project_slug}
                    onChange={handleChange}
                    required={true}
                  />
                  <MultiSelect
                    id="project_people"
                    name="project_people"
                    title="Integrantes"
                    placeholder="Selecione os integrantes"
                    icon={<FaGear />}
                    options={people}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    id="project_about"
                    name="project_about"
                    title="Sobre o Projeto"
                    placeholder="Digite o nome"
                    icon={<FaGear />}
                    value={form.project_about}
                    onChange={handleChange}
                    required={true}
                  />
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdmManagement;
