export const getPerfisPorVisao = (visao, perfis) => {
  return perfis
    .filter((perfil) => perfil.visao === visao)
    .map((perfil) => ({
      uuid: perfil.nome,
      nome: perfil.nome,
    }));
};
