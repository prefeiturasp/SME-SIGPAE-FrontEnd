export const mascaraCNPJ = (cnpj) => {
  return cnpj.replace(
    /^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})(\d{2})/i,
    "$1.$2.$3/$4-$5",
  );
};

export const mascaraTelefoneOuCelular = (telefone) => {
  const ehCelular = telefone.length === 11;
  if (ehCelular)
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else return telefone.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};
