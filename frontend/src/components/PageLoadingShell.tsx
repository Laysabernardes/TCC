import Header from './Header';
import Footer from './Footer';
import LoadingOverlay from './LoadingOverlay';

/** Header + área de conteúdo com spinner + Footer — navegação do site permanece acessível. */
export function PageLoadingShell() {
  return (
    <>
      <Header />
      <main className="w-full bg-gray-900">
        <LoadingOverlay minHeightClass="min-h-[52vh]" />
      </main>
      <Footer />
    </>
  );
}
