export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity?: number;
}

export interface FilterOptions {
  categories?: string[];
  priceRange?: [number, number];
  searchQuery?: string;
}