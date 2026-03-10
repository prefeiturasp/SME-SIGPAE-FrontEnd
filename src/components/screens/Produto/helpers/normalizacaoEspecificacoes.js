export const normalizarVolume = (volume) => {
  if ([null, undefined, ""].includes(volume)) return volume;
  if (typeof volume === "number") return volume;

  const valor = volume.toString().trim();
  if (!valor) return "";

  let valorNormalizado = valor;
  if (valor.includes(",") && valor.includes(".")) {
    valorNormalizado = valor.replace(/\./g, "").replace(",", ".");
  } else if (valor.includes(",")) {
    valorNormalizado = valor.replace(",", ".");
  }

  const numero = Number(valorNormalizado);
  return Number.isNaN(numero) ? volume : numero;
};

export const normalizarEspecificacoes = (especificacoes = []) =>
  especificacoes.map((especificacao) => ({
    ...especificacao,
    volume: normalizarVolume(especificacao?.volume),
  }));
