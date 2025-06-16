import { useEffect, useState } from "react";

import { FormApi } from "final-form";

import { MESES } from "src/constants/shared";

import { buscaAnosComDietas } from "src/services/painelNutricionista.service";

type Args = {
  values: Record<string, any>;
  form: FormApi;
  anoVigente: number;
};

type MultiSelectOption = {
  label: string;
  value: number;
};

const MES_OPCOES: Array<MultiSelectOption> = MESES.map(
  (m: string, k: number) => ({
    label: m.toUpperCase(),
    value: k + 1,
  })
);

export default ({ values, form, anoVigente }: Args) => {
  const [loadingAnoOpcoes, setLoadingAnoOpcoes] = useState(true);
  const [anoOpcoes, setAnoOpcoes] = useState([]);

  useEffect(() => {
    buscaAnosComDietas().then((data: Array<number>) => {
      setAnoOpcoes(
        data.map((a) => ({
          label: a,
          value: a,
        }))
      );
      setLoadingAnoOpcoes(false);
    });

    form.submit();
  }, []);

  const getDataMinimaMaxima = () => {
    let dataMinima: Date, dataMaxima: Date;
    if (
      selecionouAno &&
      !selecionouMaisDeUmAno &&
      selecionouMes &&
      !selecionouMaisDeUmMes
    ) {
      dataMinima = new Date(values.anos[0], values.meses[0] - 1, 1);
      dataMaxima = new Date(values.anos[0], values.meses[0], 0);
    } else if (selecionouAno && !selecionouMaisDeUmAno) {
      dataMinima = new Date(values.anos[0], 0, 1);
      dataMaxima = new Date(values.anos[0], 12, 0);
    } else if (selecionouMes && !selecionouMaisDeUmMes) {
      dataMinima = new Date(anoVigente, values.meses[0] - 1, 1);
      dataMaxima = new Date(anoVigente, values.meses[0], 0);
    }
    return [dataMinima, dataMaxima];
  };

  const selecionouMaisDeUmAno = values.anos?.length > 1;
  const selecionouMaisDeUmMes = values.meses?.length > 1;
  const selecionouAno = values.anos?.length > 0;
  const selecionouMes = values.meses?.length > 0;

  if (!values.anos) {
    form.change("anos", [anoVigente]);
  }

  if (selecionouMaisDeUmAno) {
    form.change("meses", null);
    form.change("dia", null);
  }

  if (selecionouMaisDeUmMes) {
    form.change("dia", null);
  }

  const [dataMinima, dataMaxima] = getDataMinimaMaxima();

  return {
    loadingAnoOpcoes,
    anoOpcoes,
    MES_OPCOES,
    selecionouMaisDeUmAno,
    selecionouMaisDeUmMes,
    dataMinima,
    dataMaxima,
  };
};
