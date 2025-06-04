const sumObjectsByKey = (...objs) => {
  return objs.reduce((a, b) => {
    for (let k in b) {
      // eslint-disable-next-line no-prototype-builtins
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
};

export default (results) => {
  try {
    if (
      results["Inclusão de Alimentacao de CEI"] ||
      results["Inclusão de Alimentação CEMEI"]
    ) {
      results["Inclusão de Alimentação"] = sumObjectsByKey(
        results["Inclusão de Alimentação"],
        results["Inclusão de Alimentacao de CEI"],
        results["Inclusão de Alimentação CEMEI"]
      );
    }
    if (
      results["Kit Lanche Passeio de CEI"] ||
      results["Kit Lanche Passeio de CEMEI"]
    ) {
      results["Kit Lanche Passeio"] = sumObjectsByKey(
        results["Kit Lanche Passeio"],
        results["Kit Lanche Passeio de CEI"],
        results["Kit Lanche Passeio de CEMEI"]
      );
    }
    if (
      results["Alteração do Tipo de Alimentação CEI"] ||
      results["Alteração do tipo de Alimentação CEMEI"]
    ) {
      results["Alteração do tipo de Alimentação"] = sumObjectsByKey(
        results["Alteração do tipo de Alimentação"],
        results["Alteração do Tipo de Alimentação CEI"],
        results["Alteração do tipo de Alimentação CEMEI"]
      );
    }
  } catch (error) {
    return false;
  }
  return true;
};
