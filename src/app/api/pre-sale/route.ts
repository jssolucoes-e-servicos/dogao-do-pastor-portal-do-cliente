import { IPreOrderRequest } from '@/interfaces';
import { NextResponse } from 'next/server';

// Pega a URL da sua API NestJS do arquivo de variáveis de ambiente.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const body: IPreOrderRequest = await request.json();

    // Faz uma requisição POST para a sua nova API NestJS
    const response = await fetch(`${API_URL}/pre-sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao chamar a API do backend:', errorData);
      return NextResponse.json(
        { error: 'Erro ao processar pedido no backend.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Retorna a URL de pagamento que o backend enviou
    return NextResponse.json({ paymentUrl: data.paymentUrl }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}