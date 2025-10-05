import { findPreInitialOrder, findPreOrder } from "@/actions/pre-orders/find";
import { OrderStatsEnum, PreOrderStepEnum } from "@/enums";
import { PreOrderFindFullResponse, PreOrderFindInitialResponse } from "@/interfaces";
import { redirect } from "next/navigation";

interface RedirectStepsHelperProps {
  presaleId:string;
  page: string;
}

export async function RedirectStepsHelper({presaleId, page}: RedirectStepsHelperProps): Promise<PreOrderFindFullResponse> {
  const preorder = await findPreOrder(presaleId) ;
  if (!preorder) { redirect('/off-line')};
  processRedirects(presaleId,preorder.status,preorder.step, page);
  return preorder
} 

export async function RedirectInitialStepsHelper({presaleId, page}: RedirectStepsHelperProps):Promise<PreOrderFindInitialResponse> {
  const preorder =   await findPreInitialOrder(presaleId);
  if (!preorder) { redirect('/off-line')};
  processRedirects(presaleId,preorder.status,preorder.step, page);
  return preorder
}

function processRedirects(presaleId:string,status:string,step:string, page:string){
  if (status === OrderStatsEnum.digitation){
      if (step !== page){
        console.log('step !== page');
        switch (step) {
        case PreOrderStepEnum.customer:
          redirect(`/pre-venda/${presaleId}`);
        case PreOrderStepEnum.order:
          redirect(`/pre-venda/${presaleId}/pedido`);
        case PreOrderStepEnum.delivery:
          redirect(`/pre-venda/${presaleId}/endereco`);
        case PreOrderStepEnum.payment:
          redirect(`/pre-venda/${presaleId}/pagamento`);
        case PreOrderStepEnum.pix:
          redirect(`/pre-venda/${presaleId}/pagamento/pix`);
        case PreOrderStepEnum.card:
          redirect(`/pre-venda/${presaleId}/pagamento/cartao`);
        case PreOrderStepEnum.tanks:
          redirect(`/pre-venda/${presaleId}/obrigado`);
        default:
          break;
      } 
    }
  } else {
    if (status === OrderStatsEnum.pending_payment) {
       if (step !== page){
        switch (step) {
          case PreOrderStepEnum.payment:
            redirect(`/pre-venda/${presaleId}/pagamento`);
          case PreOrderStepEnum.pix:
            redirect(`/pre-venda/${presaleId}/pagamento/pix`);
          case PreOrderStepEnum.card:
            redirect(`/pre-venda/${presaleId}/pagamento/cartao`);
          case PreOrderStepEnum.tanks:
            redirect(`/pre-venda/${presaleId}/obrigado`);
          default:
            break;
        }
      }
    } else if (status === OrderStatsEnum.payd) {
       if (step !== page){
        redirect(`/pre-venda/${presaleId}/obrigado`);
       }
    } else {
      redirect(`/acompanhar-pedido/${presaleId}`);
    }
  }
}