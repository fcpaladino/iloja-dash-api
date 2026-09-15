import {Request, Response} from "express";
import multer from "multer";
import {File as MulterFile} from "multer";
import AppError from "../../errors/AppError";
import {HandlerError} from "../../errors/HandlerError";
import {ProductAIAnalysisService} from "../../services/ai/ProductAIAnalysisService";
import {assertProductAIAnalysisRateLimit} from "../../services/ai/ProductAIAnalysisRateLimit";
import {AiCreditService} from "../../services/AiCreditService";

const MAX_IMAGES = 4;
const MAX_SIZE = 5 * 1024 * 1024;
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export const productAIUpload = multer({
  storage: multer.memoryStorage(),
  limits: {files: MAX_IMAGES, fileSize: MAX_SIZE},
  fileFilter: (_req, file, callback) => callback(null, allowed.has(file.mimetype)),
});

function matchesSignature(file: MulterFile) {
  const b = file.buffer;
  if (file.mimetype === "image/jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (file.mimetype === "image/png") return b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (file.mimetype === "image/webp") return b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP";
  return false;
}

export async function analyzeProductImages(req: Request, res: Response): Promise<Response> {
  try {
    const user = req.user as IReqUser;
    const files = (req.files as MulterFile[]) || [];
    if (!files.length) throw new AppError("Envie ao menos uma imagem do produto.", 400);
    if (files.length > MAX_IMAGES || files.some((file) => !allowed.has(file.mimetype) || !matchesSignature(file))) throw new AppError("Envie até 4 imagens JPEG, PNG ou WEBP válidas.", 400);
    assertProductAIAnalysisRateLimit(user.companyId, Number(user.id));
    const debit = await AiCreditService.consumeOneCredit(user.companyId, Number(user.id), "Análise de produto por imagem");
    try {
      const analysis = await new ProductAIAnalysisService().execute(user.companyId, Number(user.id), files.map((file) => ({buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname})));
      return res.json({data: analysis});
    } catch (error) {
      await AiCreditService.refund(debit.id, error instanceof Error ? error.message : "Falha na análise de produto");
      throw error;
    }
  } catch (error) {
    return HandlerError(error, res);
  }
}
