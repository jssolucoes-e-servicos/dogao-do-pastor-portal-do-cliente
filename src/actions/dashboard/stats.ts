//import { getMongoInstance } from "@/lib/mongo";


export async function getDashboardStats() {
  // Você pode adaptar para GET se preferir, mas Server Actions costuma usar POST
  try {
   /*  const db = await getMongoInstance();

    const customers = await db.collection("clients").find({}).sort({ createdAt: -1 }).toArray();
    const vouchers = await db.collection("vouchers").find({}).toArray();
    //const editions = await db.collection("editions").find({}).toArray();
    //const voucherUsage = await db.collection("voucher_usage").find({}).toArray();
    //const sales = await db.collection("sales").find({}).toArray();
    const dogs = await db.collection("sale_items").find({}).toArray();
    const activeEdition = await db.collection("editions").findOne({ active: true });

    const countedSales = await db
      .collection("sale_items")
      .find({ countInSales: { $ne: true } })
      .toArray();

    const totalSoldCount = countedSales.reduce((sum, sale) => {
      // Buscar itens da venda que contam
      return sum + (sale.quantity || 1);
    }, 0);
 */
    return {
      vouchers: [],//vouchers.map((v) => ({ code: v.code, used: v.used })),
      customers: 0,//customers.length,
      sales: 0,//dogs.length,
      usedVouchers: 0,//vouchers.filter((v) => v.used).length,
      availableDogs: 0,//sactiveEdition ? activeEdition.limiteEdicao - dogs.length : 0,
    };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return {
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}