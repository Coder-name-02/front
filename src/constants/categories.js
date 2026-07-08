export const categoryOptions = [
  { id: "1", label: "Phone", brands: ["Hawei", "Apple"] },
  { id: "2", label: "Computer", brands: ["Acer", "HP"] },
  { id: "3", label: "Others", brands: ["Remax", "Samsung"] },
];

export function getBrandsForCategory(categoryId) {
  if (!categoryId) return [];
  return categoryOptions.find((c) => c.id === categoryId)?.brands || [];
}
