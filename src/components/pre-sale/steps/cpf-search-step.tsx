import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CpfSearchStepProps {
  cpf: string;
  setCpf: (cpf: string) => void;
  isLoading: boolean;
  onCpfSearch: () => void;
}

const isValidCPF = (cpf: string): boolean => {
  if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    return false;
  }
  return true;
};

const CpfSearchStep: React.FC<CpfSearchStepProps> = ({ cpf, setCpf, isLoading, onCpfSearch }) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidCPF(cpf)) {
      onCpfSearch();
    } else {
      console.error('Por favor, digite um CPF válido.');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Inicie seu Pedido</h2>
      <div>
        <Label htmlFor="cpf">Seu CPF</Label>
        <Input
          id="cpf"
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite apenas números"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={isLoading}
      >
        {isLoading ? 'Buscando...' : 'Iniciar Pedido'}
      </Button>
    </form>
  );
};

export default CpfSearchStep;
