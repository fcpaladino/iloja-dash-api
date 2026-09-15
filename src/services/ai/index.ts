import AppError from "../../errors/AppError";
import OpenAIProvider from "./OpenAIProvider";
import {AIProvider} from "./ProductAIProvider";

export function createAIProvider(): AIProvider {
  const provider = String(process.env.AI_PROVIDER || "openai").toLowerCase();
  if (provider === "openai") return new OpenAIProvider();
  throw new AppError(`Provedor de IA não suportado: ${provider}.`, 503);
}
