export const formataPeriodos = (periodos) => {
  const _periodos = periodos.map((periodo) => {
    return { nome: periodo };
  });

  const periodosComStyles = _periodos.map((periodo) => {
    switch (periodo.nome) {
      case "MANHA":
        periodo["background"] = "#fff7cb";
        periodo["borderColor"] = "#ffd79b";
        break;

      case "TARDE":
        periodo["background"] = "#ffeed6";
        periodo["borderColor"] = "#ffbb8a";
        break;

      case "NOITE":
        periodo["background"] = "#e4f1ff";
        periodo["borderColor"] = "#82b7e8";
        break;

      case "INTEGRAL":
        periodo["background"] = "#ebedff";
        periodo["borderColor"] = "#b2baff";
        break;

      default:
        periodo["background"] = "#eaffe3";
        periodo["borderColor"] = "#79cf91";
        break;
    }
    return periodo;
  });
  return periodosComStyles;
};
