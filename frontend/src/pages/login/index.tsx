import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div>
        <h1 className="text-red-500 text-3xl font-bold">Login</h1>
        <Link to="/guara-adm">
          <button className="p-5 bg-red-300 text-2xl mt-4 cursor-pointer">
            Logar
          </button>
        </Link>
      </div>
    </>
  );
}

export default Login;
