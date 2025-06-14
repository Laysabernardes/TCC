import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div>
        <h1 className="text-red-500 text-3xl font-bold">Usina Guará</h1>
        <Link to="/login">
          <button className="p-5 bg-red-300 text-2xl mt-4 cursor-pointer">
            Fazer login
          </button>
        </Link>
      </div>
    </>
  );
}

export default Home;
