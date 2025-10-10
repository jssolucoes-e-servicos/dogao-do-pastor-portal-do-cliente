"use client"
//import { getDashboardStats } from "@/actions/dashboard/stats";
import { Clock, DollarSign, ShoppingBag, TrendingUp, Truck, Users } from "lucide-react";
import { Fragment } from "react";
import useSWR from 'swr';
import { DashboardCardContent } from "./card-content";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Falha ao buscar os dados do dashboard.');
  }
  return res.json();
};

interface DashboardStats {
  counters: {
    vouchers: number;
    availableVouchers: number;
    customers: number;
    orders: number;
    sellers: number;
    usedVouchers: number;
    saleDogs:number;
    availableDogs: number;
  };
}

export function CardsStats(){
const { data, error, isLoading } = useSWR<DashboardStats>(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, fetcher);

 // Exibir estado de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Exibir estado de erro
  if (error) {
    return <div>Erro ao carregar os dados: {error.message}</div>;
  }

  // Se os dados não estiverem disponíveis, retorna uma mensagem (embora o 'isLoading' e 'error' já tratem a maioria dos casos)
  if (!data) {
    return <div>Nenhum dado disponível.</div>;
  }
  
  const viewData = {
    totalCustomers: data.counters.customers,
    totalDeliveryPersons: 0, // Como este dado não vem do backend, permanece 0
    totalDogsSale: data.counters.saleDogs, // Usar `saleDogs` do backend
    queueProduction: 0, // Mantido para futuras implementações
    ammountValue: 0, // Mantido para futuras implementações
    queueFinished: 0, // Mantido para futuras implementações
  };



    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <DashboardCardContent
                      title="Total Clientes"
                      value={viewData.totalCustomers}
                      icon={Users}
                      color="bg-blue-500"
                      href="/clientes"
                    />
                    <DashboardCardContent
                      title="Entregadores"
                      value={viewData.totalDeliveryPersons}
                      icon={Truck}
                      color="bg-green-500"
                      href="/entregadores"
                    />
                    <DashboardCardContent
                      title="Pedidos Hoje"
                      value={viewData.totalDogsSale}
                      icon={ShoppingBag}
                      color="bg-purple-500"
                      href="/pedidos"
                    />
                    <DashboardCardContent
                      title="Em produção"
                      value={viewData.queueProduction}
                      icon={Clock}
                      color="bg-orange-500"
                      badge="Urgente"
                      href="/filas/production"
                    />
                    <DashboardCardContent
                      title="Vendas Hoje"
                      value={`R$ ${viewData.ammountValue.toFixed(2)}`}
                      icon={DollarSign}
                      color="bg-emerald-500"
                      href="/relatorios"
                    />
                    <DashboardCardContent title="Entregues"
                      value={viewData.queueFinished} 
                      icon={TrendingUp} color="bg-indigo-500" />
                  </div>
        </Fragment>
    )
}