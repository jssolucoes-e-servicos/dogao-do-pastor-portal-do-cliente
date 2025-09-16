export interface IHotDogCustomizer {
  initialRemovedIngredients?: string[];
  onIngredientsChange: (removedIngredients: string[]) => void;
}
