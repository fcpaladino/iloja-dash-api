import axios from "axios";
import app from "../config/app";
import AppError from "../errors/AppError";

const generate = async (task: string, prompt: string, schema: Record<string, unknown>) => {
  if (!app.iaServiceUrl || !app.iaServiceApiKey) throw new AppError("A integração com o ia-service não está configurada.", 503);
  const endpoint = app.iaServiceUrl.endsWith("/generate/direct") ? app.iaServiceUrl : `${app.iaServiceUrl}/generate/direct`;
  try {
    const response = await axios.post(endpoint, {task, prompt, systemPrompt: `Você é um redator profissional em português do Brasil. Retorne exclusivamente JSON válido seguindo este formato: ${JSON.stringify(schema)}. Não invente fatos.`, provider: "local", model: "llama", temperature: 0.45, maxOutputTokens: 900, cache: false, metadata: {locale: "pt-BR"}}, {headers: {Authorization: `Bearer ${app.iaServiceApiKey}`}, timeout: app.iaServiceTimeoutMs});
    const raw = String(response.data?.text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    try { return JSON.parse(raw); } catch { throw new AppError("A IA retornou um formato inválido. Tente novamente.", 502); }
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (axios.isAxiosError(error) && error.response?.data?.message) throw new AppError(error.response.data.message, 502);
    throw new AppError("Não foi possível conectar ao ia-service.", 502);
  }
};

export const generateProductDescription = (name: string) => generate("product_description", name, {description: "Descrição comercial do produto em 3 parágrafos"});
export const generateProductSeo = (name: string) => generate("product_seo", name, {seoTitle: "Título SEO", seoDescription: "Descrição SEO", seoKeywords: "Palavras-chave separadas por vírgula"});
export const generateCompanySeo = (name: string) => generate("website_seo", name, {seoTitle: "Título SEO com até 60 caracteres", seoDescription: "Descrição SEO com 140 a 160 caracteres", seoKeywords: "Palavras-chave separadas por vírgula"});
