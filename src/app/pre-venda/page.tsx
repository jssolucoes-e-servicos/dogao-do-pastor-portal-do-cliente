import { PreSaleForm } from '@/components/pre-sale';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import { Fragment } from 'react';

export default function Home() {
  return (
    <Fragment>
      <main className="flex mt-0 min-h-screen flex-col items-center justify-center  p-6 sm:p-24 bg-gray-50">
        <header className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex mb-8">
          <Image
            src="/assets/images/dogao-do-pastor.svg"
            alt="Dogão do Pastor Logo"

            width={150}
            height={12}
            priority
          />
        </header>

        <div className="relative flex place-items-center flex-col">
          <h1 className="text-3xl font-bold text-center mb-2">Pré-Venda</h1>
          <p className="text-center text-gray-600 mb-4">
            Peça agora seu Dogão antecipado para retirada no balcão, entrega, ou doação.
          </p>
          <PreSaleForm />
        </div>

        <footer className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex mt-8">
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-gray-500">Um projeto da</span>
            <a
              href="https://igrejavivaemcelulas.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-gray-500">
                <span className="hover:text-gray-700">Igreja Viva em Células</span>
              </span>
            </a>
          </div>
        </footer>
      </main>
      <Toaster />
    </Fragment>
  );
}

<Toaster />

