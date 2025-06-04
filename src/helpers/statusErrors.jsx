export const statusErrors = {
  400: "Oops! Alguma informação na sua solicitação está incorreta. Por favor, verifique e tente novamente.",
  401: "Desculpe, você não tem permissão para acessar ou executar este recurso. Certifique-se de estar logado e tente novamente.",
  403: "Oops! você não tem permissão para acessar ou executar este recurso.",
  404: "Desculpe, não conseguimos encontrar o que você está procurando.",
  500: "Desculpe-nos! Houve um erro interno no servidor.",
  // Adicione outros códigos de status conforme necessário
};

// Função para obter mensagem genérica com base no código de status
export const getMensagemDeErro = (statusCode) => {
  return statusErrors[statusCode] || "Erro desconhecido.";
};
