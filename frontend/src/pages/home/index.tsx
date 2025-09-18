import { Link } from "react-router-dom";
import usinaGuara from "../../assets/usinaGuara.webp"; 
import { FaSignInAlt } from "react-icons/fa";

function Home() {
  return (
    <div
      id="hero"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-dark-1 p-4"
    >
      <section className="w-full max-w-4xl flex flex-row bg-dark-2 rounded-lg shadow-lg overflow-hidden">
        
        <div className="hidden md:flex w-1/2">
          <img
            src={usinaGuara}
            alt="Imagem da Usina Guará"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-light-3">
              Plataforma Usina Guará
            </h1>
          </div>

          <Link to="/login">
            <button
              className="w-full flex items-center justify-center gap-3 bg-red-2 text-lg font-bold text-white text-center rounded-lg p-3 mt-5 cursor-pointer transition-transform duration-200 hover:bg-red-1 hover:scale-105"
            >
              <span>Fazer Login</span>
              <FaSignInAlt />
            </button>
          </Link>
        </div>

      </section>
    </div>
  );
}

export default Home;