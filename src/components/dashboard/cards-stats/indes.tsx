import { getDashboardStats } from "@/actions/dashboard/stats";
import { Clock, DollarSign, ShoppingBag, TrendingUp, Truck, Users } from "lucide-react";
import { Fragment } from "react";
import { DashboardCardContent } from "./card-content";

export async function CardsStats(){

    /* const res = await fetch(`/api/dashboard`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }) */
     const data = await getDashboardStats();
      //const data = await res.json()
      console.log(data)


      const viewData = {
        totalCustomers: data.customers,
        totalDeliveryPersons: 0,
        totalDogsSale: data.sales,
        queueProduction: 0,
        ammountValue: 0,
        queueFinished: 0,
      }



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