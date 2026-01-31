import app from "../config/app";
import crypto from "crypto";

export const getIp = (req) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
  if (ip === "::1" || ip === "127.0.0.1") {
    // ip = "127.0.0.1"; // Converte para IPv4
    ip = '177.70.206.69';
  }
  return ip;
};


export function codeName(text: string){
  if(!text) return "";
  let searchText = String(text).trim();
  searchText = searchText.replace(/[&]/g, ' ');
  searchText = searchText.replace(/[-]/g, '');
  searchText = searchText.replace('+', '');
  searchText = searchText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[!@#$%^*(),.?":{}|<>]/g, '');
  return searchText;
}


export const getPrimaryLanguage = (req: Request): string => {
  const langHeader = req.headers["accept-language"];
  return langHeader ? langHeader.split(",")[0].split(";")[0] : "en"; // Default para 'en' se não houver cabeçalho
};

export const getOSName = (platform: string | undefined): string => {
  if (!platform) return "Desconhecido";

  // Normaliza os principais sistemas operacionais
  if (platform.includes("Windows")) return "Windows";
  if (platform.includes("Mac")) return "macOS";
  if (platform.includes("Linux")) return "Linux";
  if (platform.includes("Android")) return "Android";
  if (platform.includes("iOS") || platform.includes("iPhone")) return "iOS";

  return platform; // Retorna como está se não for reconhecido
};

export function logDev(...args) {
  if (app.env === "dev" || app.env === "homologacao") {
    console.log(''); console.log(...args); console.log('');
  }
}

export function getFLNames(name: string) {
  // Verifica se o nome completo está presente
  if (!name) {
    return { firstname: '', lastname: '' };
  }

  // Divide o nome completo em partes usando o espaço em branco como separador
  const partesNome = name.split(' ');

  // Verifica se há pelo menos um nome e um sobrenome
  if (partesNome.length < 2) {
    return { firstname: name, lastname: '' };
  }

  // O primeiro elemento do array é o primeiro nome
  const nome = partesNome[0];

  // Os últimos elementos do array são os sobrenomes
  const sobrenome = partesNome.slice(1).join(' '); // Junta os sobrenomes em uma string

  return { firstname: nome, lastname: sobrenome };
}

export function gerarHashEmail(email: string) {
  const timestamp = Date.now();
  return crypto.createHash('md5').update(`${timestamp}${email.toLowerCase().trim()}`).digest('hex');
}

export function createUsernameByEmail(email: string) {
  if(!email) return "";
  return email.toLowerCase().trim().split('@')[0];
}
