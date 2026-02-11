const recuperarSenha = () => {
  return (`<!DOCTYPE html>
<html>
<head>
    <met a charset="UTF-8">
    <title>Recuperação de Senha</title>
</head>
<body>
    <p>Prezado(a) {nomeCliente} 👋,</p>

    <p>Recebemos uma solicitação para redefinir a senha da sua conta na plataforma ZapShow. Se você não fez essa solicitação, por favor, ignore este e-mail.</p>

    <p>CODIGO: <strong>{code}</strong></p>

    <p>Caso você realmente tenha solicitado a redefinição da senha, clique no link abaixo para criar uma nova senha:</p>

    <p><a href="{link}">Clique aqui para redefinir sua senha</a></p>

    <p>Certifique-se de utilizar um dispositivo seguro e de confiança ao efetuar essa ação. Caso tenha problemas ou precise de assistência, nossa equipe de suporte estará disponível para ajudar. 🛠️</p>

    <p>A sua segurança é importante para nós. Mantenha suas informações de acesso em sigilo e não compartilhe sua senha com ninguém.</p>

    <p>Agradecemos por fazer parte da comunidade ZapShow e esperamos que você continue desfrutando de todos os recursos da nossa plataforma.</p>

    <p>Atenciosamente,</p>

</body>
</html>`);
};

export default recuperarSenha;
