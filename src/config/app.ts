import "../bootstrap";

export default {
  nameApp: 'ERP ADMIN',
  env: process.env.NODE_ENV || 'prod',
  backUrl: process.env.BACKEND_URL,
  frontUrl: process.env.FRONTEND_URL,
  apiPublicUrl: process.env.API_PUBLIC_URL || process.env.BACKEND_URL,
  iaServiceUrl: process.env.IA_SERVICE_DIRECT_URL || process.env.IA_SERVICE_URL,
  iaServiceApiKey: process.env.IA_SERVICE_API_TOKEN || process.env.IA_SERVICE_API_KEY,
  iaServiceTimeoutMs: Number(process.env.IA_SERVICE_TIMEOUT_MS || 30000),
  asaasApiUrl: process.env.ASAAS_API_URL || 'https://api.asaas.com/v3',
  asaasApiKey: process.env.ASAAS_API_KEY_PROD || process.env.ASAAS_API_KEY,
  asaasWebhookToken: process.env.ASAAS_WEBHOOK_TOKEN,
  asaasCheckoutExpiresMinutes: Number(process.env.ASAAS_CHECKOUT_EXPIRES_MINUTES || 60),
  waChatApiUrl: process.env.WACHAT_API_URL || 'https://api.wachat.me/api/v1',
  waChatApiToken: process.env.WACHAT_API_TOKEN,

  tokenCrypto: 'icdF93+zC4ZhL4rWwydClM9HNuMgfiMZa8OxUU0onrbxKol4r5ateyA6OoLEisf0',
};
