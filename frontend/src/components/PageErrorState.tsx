import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export type PageErrorStateProps = {
  title: string;
  description: string;
  /** Ex.: 404 — exibido como destaque visual */
  code?: string;
};

/**
 * Estado de erro amigável (projeto indisponível, falha de API, etc.) com navegação de volta ao site.
 */
export function PageErrorState({
  title,
  description,
  code,
}: PageErrorStateProps) {
  return (
    <>
      <Header />
      <main className="h-max w-full bg-gray-900 px-5 py-16 text-gray-200">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          {code && (
            <p
              className="mb-3 font-mono text-5xl font-bold text-red-600/90 sm:text-6xl"
              aria-hidden
            >
              {code}
            </p>
          )}
          <h1 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mb-10 text-base leading-relaxed text-gray-400">
            {description}
          </p>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="rounded-lg bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Voltar à página inicial
            </Link>
            <button
              type="button"
              onClick={() =>
                window.history.length > 1
                  ? window.history.back()
                  : (window.location.hash = "#/")
              }
              className="rounded-lg border border-gray-600 bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-700"
            >
              Página anterior
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
