import AppError from "./AppError";

export const HandlerError = (err, res)=> {
  console.error('Erro interno:', err);

  if (err.name === 'ValidationError') {
    const errors = {};
    err.inner.forEach((e) => {
      if (!errors[e.path]) {
        errors[e.path] = e.message;
      }
    });

    return res.status(400).json({ errors });
  }

  // Erro de autenticação (exemplo manual)
  if (err.code === 'UNAUTHORIZED') {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Erro de permissão (exemplo manual)
  if (err.code === 'FORBIDDEN') {
    return res.status(403).json({ error: 'Você não tem permissão para esta ação' });
  }

  // Recurso não encontrado
  if (err.code === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso não encontrado' });
  }

  if(err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
  }
  if (err?.code === 'LIMIT_FILE_SIZE' || err?.code === 'LIMIT_FILE_COUNT' || err?.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Envie até 4 imagens JPEG, PNG ou WEBP de no máximo 5 MB cada.' });
  }

  return res.status(500).json({ error: 'Erro interno do servidor' });
}
