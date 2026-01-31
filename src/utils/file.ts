import { promises as fs } from 'fs';
import path from 'path';

const file = async({caminho = '', dados, tipo = 'binario'}) => {

  try {

    let buffer: Buffer;

    if (tipo === 'binario') {
      if (!Buffer.isBuffer(dados)) {
        throw new Error('Esperado Buffer para tipo binario.');
      }
      buffer = dados;
    } else if (tipo === 'base64') {
      if (typeof dados !== 'string') {
        throw new Error('Esperado string para tipo base64.');
      }
      const base64Limpo = dados.replace(/^data:.+;base64,/, '');
      buffer = Buffer.from(base64Limpo, 'base64');
    } else {
      throw new Error('Tipo inválido.');
    }

    await fs.writeFile(caminho, buffer);

  } catch (e) {

  }

};

export const rename = async({caminhoAtual, novoNome}) => {
  try {
    const pasta = path.dirname(caminhoAtual);
    const novoCaminho = path.join(pasta, novoNome);

    await fs.rename(caminhoAtual, novoCaminho);
  } catch (error) {

  }
};

export const remove = async({caminho}) => {
  try {
    await fs.unlink(caminho);
    return true;
  } catch (error) {
    return false;
  }
};
