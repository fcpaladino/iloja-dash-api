import axios from 'axios';
import app from '../config/app';

const SendWhatsapp = async({...props}) => {
  try {
    if (!app.waChatApiToken) {
      console.error('WACHAT_API_TOKEN não configurado.');
      return { success: false, message: 'Serviço de WhatsApp não configurado.' };
    }

    const to = String(props.to || '').replace(/\D/g, '');
    if (app.env === 'dev') console.info(`[Wachat] enviando código para ${to}`);

    await axios.post(
      `${app.waChatApiUrl.replace(/\/$/, '')}/message/sendText`,
      { phone: to, text: String(props.message || '') },
      {
        headers: {
          Authorization: `Bearer ${app.waChatApiToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    );

    return { success: true };

  } catch (error) {
    const providerError = error?.response?.data?.data?.find?.((item) => item?.error)?.error
      || error?.response?.data?.message
      || error?.message;
    console.error('Falha ao enviar WhatsApp pelo Wachat:', error?.response?.data || error?.message || error);
    return { success: false, message: providerError || 'Não foi possível enviar o código pelo WhatsApp.' };
  }
};

export default SendWhatsapp;
