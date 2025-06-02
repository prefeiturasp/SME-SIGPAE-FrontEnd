export const mascaraCNPJ = (cnpj) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export const mascaraTelefoneOuCelular = (telefone) => {
  const ehCelular = telefone.length === 11;
  if (ehCelular)
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else return telefone.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};
