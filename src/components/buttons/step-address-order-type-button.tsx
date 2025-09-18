//components/buttons/step-address-order-type-button.tsx
'use client';
import { Button } from "@/components/ui/button";
import { IStepAddressOrderType } from "@/interfaces";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function StepAddressOrderTypeButton({ deliveryOption, setDeliveryOption, type }: IStepAddressOrderType) {
  const handleLabel = () => {
    switch (type) {
      case 'delivery':
        return 'Quero receber'
      case 'donate':
        return 'Pode doar'
      case 'pickup':
        return 'Vou buscar'
      default:
        break;
    }
  }

  return (
    <Button
      type="button"
      onClick={() => setDeliveryOption(type)}
      className={cn(
        "flex flex-col items-center justify-center p-4 h-auto w-full flex-1",
        deliveryOption === type ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black'
      )}
    >
      <Image
        src={'/assets/images/hot-dog.svg'}
        alt={'Dogão para receber'}
        width={60}
        height={60}
      />
      <span className="mt-2 text-center text-sm md:text-base whitespace-nowrap">{handleLabel()}</span>
    </Button>
  );
}