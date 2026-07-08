import CarouselViewer from "../components/products/CarouselViewer";
import BrandSection from "../components/products/BrandSection";
import { categoryOptions } from "../constants/categories";

export default function Home() {
  // Extract all unique brands from category options
  const allBrands = Array.from(
    new Set(categoryOptions.flatMap((cat) => cat.brands))
  ).sort();

  return (
    <div className="container mt-4 pb-5">
      <CarouselViewer />
      
      {allBrands.map((brandName) => (
        <BrandSection key={brandName} brandName={brandName} />
      ))}
    </div>
  );
}