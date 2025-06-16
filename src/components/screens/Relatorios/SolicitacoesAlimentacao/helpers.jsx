export const lotesToOptions = (lotes) => {
  return lotes
    .map((lote) => ({
      label: `${lote.diretoria_regional.iniciais} - ${lote.nome}`,
      value: lote.uuid,
    }))
    .sort((a, b) => {
      if (a.label < b.label) return -1;
      else if (a.label > b.label) return 1;
      return 0;
    });
};
