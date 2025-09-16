import { isValidCPF } from '@/helpers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    /* const { searchParams } = new URL(request.url);
    const cpf = searchParams.get('cpf'); */
    const { cpf } = await request.json()
    if (!cpf) {
      return NextResponse.json({ message: 'CPF não informado.' }, { status: 400 });
    }

    // 1. Validar o CPF antes de fazer a requisição para a API
    if (!isValidCPF(cpf)) {
      return NextResponse.json({ message: 'CPF inválido.' }, { status: 400 });
    }

    // 2. Fazer a chamada para a nova API do backend NestJS
    const response = await fetch(`${API_URL}/customer/find-by-cpf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cpf }),
    });


    if (response.status === 404) {
      return NextResponse.json({ message: 'Cliente não encontrado.' }, { status: 404 });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao chamar a API do backend:', errorData);
      return NextResponse.json(
        { error: 'Erro ao buscar cliente no backend.' },
        { status: response.status }
      );
    }

    const customer = await response.json();
    console.log(customer);
    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}