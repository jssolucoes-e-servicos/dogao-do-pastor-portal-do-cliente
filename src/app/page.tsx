import { LANDING_PAGE_MEDIA } from '@/constants/landing-page';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-orange-600 text-white py-24 md:py-36 text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down">
            Pré-venda do Dogão: Ganhe uma Pernoite em Gramado!
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 animate-fade-in-up">
            Participe da nossa pré-venda e concorra a uma viagem incrível para Gramado, RS!
          </p>
          <a href="/pre-venda">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Participar da Pré-venda
            </Button>
          </a>
        </div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* Media Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Momentos Inesquecíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LANDING_PAGE_MEDIA.videos.map((video, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105">
                <video src={video.url} controls className="w-full h-auto"></video>
                <p className="p-4 text-center font-semibold">{video.description}</p>
              </div>
            ))}
            {LANDING_PAGE_MEDIA.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105">
                <img src={image.url} alt={image.description} className="w-full h-auto object-cover" />
                <p className="p-4 text-center font-semibold">{image.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="bg-orange-100 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Regras da Campanha
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <ul className="list-disc list-inside space-y-4 text-lg text-gray-700">
              <li>
                A campanha é válida para todas as compras realizadas através do botão &quot;Participar da Pré-venda&quot; nesta página.
              </li>
              <li>
                Cada pedido confirmado gera um número da sorte para o sorteio.
              </li>
              <li>
                O sorteio será realizado ao vivo no dia <strong>15/11/2025</strong>, em nossas redes sociais.
              </li>
              <li>
                O prêmio inclui uma pernoite para duas pessoas em um hotel selecionado em Gramado, RS.
              </li>
              <li>
                Confira o regulamento completo no nosso site para mais detalhes.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 px-4">
        <p>© 2025 Dogão do Pastor. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
