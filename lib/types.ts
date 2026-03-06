// Core type definitions for the art portfolio application

export interface Artwork {
  id: string;
  title: string;
  category: 'Still Photos' | 'Portraits' | 'Landscapes';
  imagePath: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface ArtworkData {
  artworks: Artwork[];
}

export type CategoryFilter = 'All' | 'Still Photos' | 'Portraits' | 'Landscapes';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
