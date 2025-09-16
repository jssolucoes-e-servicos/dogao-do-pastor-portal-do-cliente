import { PreSaleForm } from '@/components/pre-sale';
import { Toaster } from '@/components/ui/toaster';

export default function PreVendaPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-lg">
        <PreSaleForm />
      </div>
      <Toaster />
    </main>
  );
}
