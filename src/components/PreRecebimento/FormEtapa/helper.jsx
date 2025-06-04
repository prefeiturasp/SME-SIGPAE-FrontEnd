// onChangeEtapas: método utilizado para lidar com mudanças em tempo real no formulário através do FormSpy
//                 todos os parametros são obrigatórios
//                 changes: objeto changes vindo do FormSpy
//                 etapas: array indicador de quantas etapas existem
//                 setRestante: método set de um state indicando os alimentos restantes
//                 setDuplicados: método set de um state indicando etapas/partes duplicadas

export const onChangeEtapas = (changes, etapas, setRestante, setDuplicados) => {
  let restante = Number(
    changes.values.quantidade_total
      ?.toString()
      .replaceAll(".", "")
      .replace(",", ".")
  );

  etapas.forEach((e, index) => {
    if (changes.values[`quantidade_${index}`]) {
      let qtd = Number(
        changes.values[`quantidade_${index}`]
          .toString()
          .replaceAll(".", "")
          .replace(",", ".")
      );

      restante -= qtd;
    }
  });

  setRestante(parseFloat(restante.toFixed(2)));

  if (etapas.length < 2) return;

  const partes_etapas = [];
  etapas.forEach((_, i) => {
    partes_etapas.push({
      parte: changes.values[`parte_${i}`],
      etapa: changes.values[`etapa_${i}`],
      index: i,
    });
  });

  const duplicados = [];
  partes_etapas.forEach((pe) => {
    if (
      partes_etapas.filter(
        (pe_) => pe_.parte === pe.parte && pe_.etapa === pe.etapa
      ).length > 1
    ) {
      duplicados.push(pe.index);
    }
  });

  setDuplicados(duplicados);
};
