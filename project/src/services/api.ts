import axios from 'axios';
import { Product } from '../types';

// Using FakeStoreAPI but we'll modify the prices to be more realistic
const API_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Helper to make prices more realistic
const adjustPrice = (originalPrice: number): number => {
  // Convert API prices to more realistic values
  // Electronics: $199-999
  // Jewelry: $99-599
  // Clothing: $29-149
  
  let basePrice = originalPrice;
  
  if (basePrice < 30) {
    basePrice = basePrice * 3 + 29;
  } else if (basePrice < 100) {
    basePrice = basePrice * 2 + 49;
  } else {
    basePrice = basePrice * 1.5 + 99;
  }
  
  // Round to .99
  return Math.floor(basePrice) + 0.99;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    // Adjust prices to be more realistic
    return response.data.map((product: Product) => ({
      ...product,
      price: adjustPrice(product.price)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`);
    return {
      ...response.data,
      price: adjustPrice(response.data.price)
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data.map((product: Product) => ({
      ...product,
      price: adjustPrice(product.price)
    }));
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw new Error(`Failed to fetch products in category ${category}`);
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Simple auth simulation since FakeStoreAPI doesn't have real auth
export const loginUser = async (email: string, password: string) => {
  try {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Basic validation
    if (!email || !password) {
      throw new Error('Please provide both email and password');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // In a real app, this would be an actual API call
    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
      user: {
        id: Math.floor(Math.random() * 1000),
        name: email.split('@')[0], // Use part of email as name
        email,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic validation
    if (!name || !email || !password) {
      throw new Error('Please fill in all fields');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    // In a real app, this would check if email exists, etc.
    return {
      user: {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
      },
      token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};