export type ProductImageInput = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

export type ProductAnalysisContext = {
  categories: Array<{ id: number; name: string }>;
  groups: Array<{ id: number; name: string }>;
  subgroups: Array<{ id: number; groupId: number; name: string }>;
  brands: Array<{ id: number; name: string }>;
  attributes: Array<{ name: string; type: string; options?: unknown }>;
  variantTypes: Array<{ name: string }>;
};

export type ProductAIAnalysis = {
  title: string | null;
  shortDescription: string | null;
  description: string | null;
  categoryId: number | null;
  groupId: number | null;
  subgroupId: number | null;
  brand: string | null;
  brandId?: number | null;
  colors: string[];
  materials: string[];
  tags: string[];
  condition: "new" | "used" | null;
  attributes: Array<{ name: string; value: string; source: "observed" | "suggested" }>;
  variants: Array<{ name: string; options: string[]; source: "observed" | "suggested" }>;
  seo: { title: string | null; description: string | null; keywords: string[]; slug: string | null };
  confidence: { title: number; category: number; brand: number; attributes: number };
  warnings: string[];
};

export interface AIProvider {
  analyzeProductImages(images: ProductImageInput[], context: ProductAnalysisContext): Promise<ProductAIAnalysis>;
}
