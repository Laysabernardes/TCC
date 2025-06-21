import { useState } from "react";
import TypeInput from "../../components/inputs";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import usinaGuara from "../../assets/usinaGuara.webp";

function AdmManagement() {
  const [form, setForm] = useState({
    // Projetos
    project_name: "",
    project_slug: "",
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
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  return (
    <div
      id="hero"
      className="w-[100%] h-[100vh] flex flex-col items-center bg-dark-1"
    >
      <section className="w-[95%] h-200 flex flex-row bg-dark-2 rounded-lg my-16">
        <div className="w-1/2 bg-dark-2">
          <img
            src={usinaGuara}
            alt="background Usina Guará"
            className="w-full h-full object-cover rounded-s-lg"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <form action="" className="p-15">
            <div className="flex justify-between items-center">
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
            <TypeInput
              id="project_name"
              title="Nome Projeto"
              type="text"
              placeholder="Digite o nome"
              icon={<FaGear />}
              value={form.project_name}
              onChange={handleChange}
              required={true}
            />
            <TypeInput
              id="project_name"
              title="Nome Projeto"
              type="text"
              placeholder="Digite o nome"
              icon={<FaGear />}
              value={form.project_name}
              onChange={handleChange}
              required={true}
            />
            <TypeInput
              id="project_name"
              title="Nome Projeto"
              type="text"
              placeholder="Digite o nome"
              icon={<FaGear />}
              value={form.project_name}
              onChange={handleChange}
              required={true}
            />
            <TypeInput
              id="project_name"
              title="Nome Projeto"
              type="text"
              placeholder="Digite o nome"
              icon={<FaGear />}
              value={form.project_name}
              onChange={handleChange}
              required={true}
            />
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdmManagement;
