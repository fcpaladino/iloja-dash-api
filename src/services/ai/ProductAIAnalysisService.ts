import {Op} from "sequelize";
import Category from "../../models/Category";
import Group from "../../models/Group";
import SubGroup from "../../models/SubGroup";
import Brand from "../../models/Brand";
import ProductField from "../../models/ProductField";
import Variant from "../../models/Variant";
import {createAIProvider} from "./index";
import {AIProvider, ProductAIAnalysis, ProductAnalysisContext, ProductImageInput} from "./ProductAIProvider";

const MAX_TEXT = 5000;
const trim = (value: unknown, max = MAX_TEXT) => typeof value === "string" ? value.trim().slice(0, max) || null : null;
const list = (value: unknown, max = 20) => Array.isArray(value) ? value.filter((item) => typeof item === "string").map((item) => item.trim().slice(0, 120)).filter(Boolean).slice(0, max) : [];

export class ProductAIAnalysisService {
  constructor(private readonly provider: AIProvider = createAIProvider()) {}

  async execute(companyId: number, userId: number, images: ProductImageInput[]) {
    const [categories, groups, subgroups, brands, attributes, variants] = await Promise.all([
      Category.findAll({where: {companyId, active: true}, attributes: ["id", "name"], order: [["name", "ASC"]]}),
      Group.findAll({where: {companyId, active: true}, attributes: ["id", "name"], order: [["name", "ASC"]]}),
      SubGroup.findAll({where: {companyId, active: true}, attributes: ["id", "groupId", "name"], order: [["name", "ASC"]]}),
      Brand.findAll({where: {companyId, active: true}, attributes: ["id", "name"], order: [["name", "ASC"]]}),
      ProductField.findAll({where: {companyId, active: true}, attributes: ["name", "type", "options"], order: [["order", "ASC"]]}),
      Variant.findAll({where: {companyId, active: true, registerModel: {[Op.in]: ["Product", "product"]}}, attributes: ["name"], limit: 100}),
    ]);
    const context: ProductAnalysisContext = {categories: categories.map((i) => ({id: i.id, name: i.name})), groups: groups.map((i) => ({id: i.id, name: i.name})), subgroups: subgroups.map((i) => ({id: i.id, groupId: i.groupId, name: i.name})), brands: brands.map((i) => ({id: i.id, name: i.name})), attributes: attributes.map((i) => ({name: i.name, type: i.type, options: i.options})), variantTypes: variants.map((i) => ({name: i.name}))};
    const startedAt = Date.now();
    try {
      const result = await this.provider.analyzeProductImages(images, context);
      const valid = (id: unknown, allowed: Array<{id: number}>) => { const numeric = Number(id); return Number.isInteger(numeric) && allowed.some((item) => item.id === numeric) ? numeric : null; };
      const normalized: ProductAIAnalysis = {
        title: trim(result?.title, 180), shortDescription: trim(result?.shortDescription, 300), description: trim(result?.description),
        categoryId: valid(result?.categoryId, context.categories), groupId: valid(result?.groupId, context.groups), subgroupId: valid(result?.subgroupId, context.subgroups),
        brand: trim(result?.brand, 120), brandId: valid(result?.brandId, context.brands), colors: list(result?.colors), materials: list(result?.materials), tags: list(result?.tags),
        condition: result?.condition === "new" || result?.condition === "used" ? result.condition : null,
        attributes: Array.isArray(result?.attributes) ? result.attributes.filter((item) => item && typeof item.name === "string" && typeof item.value === "string").slice(0, 30).map((item) => ({name: item.name.trim().slice(0, 100), value: item.value.trim().slice(0, 300), source: item.source === "observed" ? "observed" : "suggested" as any})) : [],
        variants: Array.isArray(result?.variants) ? result.variants.filter((item) => item && typeof item.name === "string").slice(0, 10).map((item) => ({name: item.name.trim().slice(0, 100), options: list(item.options, 20), source: item.source === "observed" ? "observed" : "suggested" as any})) : [],
        seo: {title: trim(result?.seo?.title, 70), description: trim(result?.seo?.description, 170), keywords: list(result?.seo?.keywords), slug: trim(result?.seo?.slug, 160)},
        confidence: {title: Math.max(0, Math.min(1, Number(result?.confidence?.title) || 0)), category: Math.max(0, Math.min(1, Number(result?.confidence?.category) || 0)), brand: Math.max(0, Math.min(1, Number(result?.confidence?.brand) || 0)), attributes: Math.max(0, Math.min(1, Number(result?.confidence?.attributes) || 0))},
        warnings: list(result?.warnings, 20),
      };
      const usage = (this.provider as any).lastUsage || {};
      console.info(JSON.stringify({event: "product_ai_analysis", companyId, userId, provider: process.env.AI_PROVIDER || "openai", model: usage.model || process.env.OPENAI_PRODUCT_MODEL || "gpt-4o-mini", images: images.length, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, totalTokens: usage.totalTokens, durationMs: Date.now() - startedAt, status: "success", createdAt: new Date().toISOString()}));
      return normalized;
    } catch (error) {
      console.error(JSON.stringify({event: "product_ai_analysis", companyId, userId, provider: process.env.AI_PROVIDER || "openai", images: images.length, durationMs: Date.now() - startedAt, status: "error", error: error instanceof Error ? error.message : "unknown", createdAt: new Date().toISOString()}));
      throw error;
    }
  }
}
