import axios from "axios";
import AppError from "../../errors/AppError";
import {AIProvider, ProductAIAnalysis, ProductAnalysisContext, ProductImageInput} from "./ProductAIProvider";

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "shortDescription", "description", "categoryId", "groupId", "subgroupId", "brand", "brandId", "colors", "materials", "tags", "condition", "attributes", "variants", "seo", "confidence", "warnings"],
  properties: {
    title: {type: ["string", "null"]}, shortDescription: {type: ["string", "null"]}, description: {type: ["string", "null"]},
    categoryId: {type: ["integer", "null"]}, groupId: {type: ["integer", "null"]}, subgroupId: {type: ["integer", "null"]},
    brand: {type: ["string", "null"]}, brandId: {type: ["integer", "null"]},
    colors: {type: "array", items: {type: "string"}}, materials: {type: "array", items: {type: "string"}}, tags: {type: "array", items: {type: "string"}},
    condition: {type: ["string", "null"], enum: ["new", "used", null]},
    attributes: {type: "array", items: {type: "object", additionalProperties: false, required: ["name", "value", "source"], properties: {name: {type: "string"}, value: {type: "string"}, source: {type: "string", enum: ["observed", "suggested"]}}}},
    variants: {type: "array", items: {type: "object", additionalProperties: false, required: ["name", "options", "source"], properties: {name: {type: "string"}, options: {type: "array", items: {type: "string"}}, source: {type: "string", enum: ["observed", "suggested"]}}}},
    seo: {type: "object", additionalProperties: false, required: ["title", "description", "keywords", "slug"], properties: {title: {type: ["string", "null"]}, description: {type: ["string", "null"]}, keywords: {type: "array", items: {type: "string"}}, slug: {type: ["string", "null"]}}},
    confidence: {type: "object", additionalProperties: false, required: ["title", "category", "brand", "attributes"], properties: {title: {type: "number"}, category: {type: "number"}, brand: {type: "number"}, attributes: {type: "number"}}},
    warnings: {type: "array", items: {type: "string"}},
  },
};

const systemPrompt = `Você analisa imagens de produtos para auxiliar um cadastro de catálogo em português do Brasil. Extraia apenas o que pode ser razoavelmente determinado pelas imagens, combinando todas como o MESMO produto. Não invente preço, marca, modelo, SKU, código de barras, peso, dimensões, material, tamanho ou estoque. Se não souber, use null ou []. Uma etiqueta legível é mais confiável que uma inferência visual. Diferencie observado de sugerido. Use somente IDs presentes no contexto; nunca invente IDs e nunca retorne um ID fora dele. Crie texto comercial sem inventar características técnicas. Preço não faz parte da resposta. Retorne exclusivamente o JSON solicitado.`;

function contextPrompt(context: ProductAnalysisContext) {
  return `Estruturas existentes da empresa (prefira-as):\n${JSON.stringify(context)}`;
}

export default class OpenAIProvider implements AIProvider {
  async analyzeProductImages(images: ProductImageInput[], context: ProductAnalysisContext): Promise<ProductAIAnalysis> {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_PRODUCT_MODEL || "gpt-4o-mini";
    if (!apiKey) throw new AppError("A análise por IA não está configurada.", 503);

    const content: any[] = [{type: "input_text", text: `${systemPrompt}\n\n${contextPrompt(context)}`}];
    images.forEach((image) => content.push({type: "input_image", image_url: `data:${image.mimetype};base64,${image.buffer.toString("base64")}`, detail: "low"}));
    try {
      const response = await axios.post("https://api.openai.com/v1/responses", {
        model,
        input: [{role: "user", content}],
        temperature: 0.2,
        text: {format: {type: "json_schema", name: "product_analysis", strict: true, schema: analysisSchema}},
      }, {headers: {Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json"}, timeout: Number(process.env.OPENAI_PRODUCT_TIMEOUT_MS || 45000)});
      const text = response.data?.output_text || response.data?.output?.flatMap((item: any) => item.content || []).find((item: any) => item.text)?.text;
      if (!text) throw new AppError("A IA não retornou uma análise válida.", 502);
      const usage = response.data?.usage || {};
      (this as any).lastUsage = {model, inputTokens: usage.input_tokens, outputTokens: usage.output_tokens, totalTokens: usage.total_tokens};
      return JSON.parse(String(text).replace(/^```json\s*/i, "").replace(/\s*```$/, ""));
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 429) throw new AppError("O serviço de análise está temporariamente sobrecarregado.", 429);
        if (status === 408 || error.code === "ECONNABORTED") throw new AppError("A análise demorou mais que o esperado.", 504);
      }
      throw new AppError("Não foi possível analisar o produto agora.", 502);
    }
  }
}
