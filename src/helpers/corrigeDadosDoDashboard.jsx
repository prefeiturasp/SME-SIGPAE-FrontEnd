const sumObjectsByKey = (...objs) => {
  return objs.reduce((a, b) => {
    if (!b) return a;
    for (let k in b) {
      // eslint-disable-next-line no-prototype-builtins
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
};

/**
 * Normaliza os nomes das chaves do resumo vindas do backend,
 * tratando possíveis problemas de encoding (ex: "AlteraÃ§Ã£o" → "Alteração").
 * Também faz o merge de CEI/CEMEI nas categorias base.
 */
const normalizaTexto = (texto) => {
  try {
    return decodeURIComponent(escape(texto));
  } catch {
    return texto;
  }
};

export default (results) => {
  try {
    // Primeiro normaliza todas as chaves para corrigir encoding incorreto
    const chaves = Object.keys(results);
    for (const chave of chaves) {
      const normalizada = normalizaTexto(chave);
      if (normalizada !== chave) {
        results[normalizada] = results[chave];
        delete results[chave];
      }
    }

    // Merge de CEI/CEMEI nas categorias base (usando includes para ser resiliente a encoding)
    const CHAVES_BASE = [
      { base: "Inclusão de Alimentação", cei: "CEI", cemei: "CEMEI" },
      { base: "Kit Lanche Passeio", cei: "CEI", cemei: "CEMEI" },
      { base: "Alteração do tipo de Alimentação", cei: "CEI", cemei: "CEMEI" },
    ];

    for (const { base, cei, cemei } of CHAVES_BASE) {
      const chavesRelacionadas = Object.keys(results).filter(
        (k) =>
          k !== base &&
          k.toLowerCase().includes(base.toLowerCase()) &&
          (k.includes(cei) || k.includes(cemei)),
      );
      if (chavesRelacionadas.length > 0) {
        results[base] = sumObjectsByKey(
          results[base],
          ...chavesRelacionadas.map((k) => results[k]),
        );
      }
    }
  } catch {
    return false;
  }
  return true;
};
