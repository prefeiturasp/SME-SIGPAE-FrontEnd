export const extrairTiposALimentacao = (tiposAlimentacao) => {
  let uuidsTiposAlimentacao = [];
  tiposAlimentacao.forEach((tipoAlimentacao) => {
    uuidsTiposAlimentacao.push(tipoAlimentacao.uuid);
  });
  return uuidsTiposAlimentacao;
};

export const normalizarData = (d) => {
  if (!d) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10); // 2026-10-30
  const m = String(d).match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // 30/10/2026
  return m ? `${m[3]}-${m[2]}-${m[1]}` : d;
};
