import { Link } from "react-router-dom";

function AdmManagement() {
  return (
    <>
      <div>
        <h1 className="text-red-500 text-3xl font-bold">Gerenciar</h1>
        <Link to="/">
          <button className="p-5 bg-red-300 text-2xl mt-4 cursor-pointer">
            Voltar pra home
          </button>
        </Link>
      </div>
    </>
  );
}

export default AdmManagement;
