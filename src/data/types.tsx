import type { StaticImageData } from "next/image";

export type ProductType = {
  categoryId: number | string;
  categoryName: string;
  brandId: string | number;
  brandName: string;
  productId: string | number;
  productName: string;
  coverImage: StaticImageData | string;
  rating: number;
  sellingPrice: number;
  justIn: boolean;
  sizeL: boolean;
  sizeM: boolean;
  sizeS: boolean;
  sizeXl: boolean;
  sizeXs: boolean;
  sizeXxl: boolean;
  sizeXxxl: boolean;
  subscriptionValidityDays: number;
};

export type BlogData = {
  sectionOne: {
    title: string;
    paragraph1: string;
    points: string[];
    paragraph2: string;
  };
  sectionTwo: {
    title: string;
    description: string;
    midImage: string;
  };
  sectionThree: {
    title: string;
    description: string;
  };
  sectionFour: {
    title: string;
    description: string;
    points: string[];
  };
  quote: string;
  sectionFive: {
    title: string;
    description: string;
  }[];
};

export type BlogType = {
  title: string;
  brief: string;
  date: string;
  coverImage: string;
  blogData: BlogData;
  tag: "Style" | "Fitting" | "General";
  slug: string;
};
