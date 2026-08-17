import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "src/helpers/utilities";

import { RelatorioAdesaoResponse } from "src/services/medicaoInicial/relatorio.interface";
import RelatorioService from "src/services/medicaoInicial/relatorio.service";

import { IFiltros } from "./types";

export default () => {
  const [loading, setLoading] = useState(false);
  const [exibirTitulo, setExibirTitulo] = useState(false);

  const [params, setParams] = useState<IFiltros | null>(null);
  const [filtros, setFiltros] = useState<IFiltros | null>(null);
  const [filtrosSelecionados, setFiltrosSelecionados] =
    useState<IFiltros | null>(null);
  const [resultado, setResultado] = useState<RelatorioAdesaoResponse>(null);

  const filtrar = async (values: IFiltros) => {
    if (values.periodo_lancamento_de && !values.periodo_lancamento_ate) {
      toastError("Se preencher o campo `De`, `Até` é obrigatório");
      return;
    }
    if (!values.periodo_lancamento_de && values.periodo_lancamento_ate) {
      toastError("Se preencher o campo `Até`, `De` é obrigatório");
      return;
    }
    setLoading(true);
    setFiltros(filtrosSelecionados);
    setParams(values);
    setExibirTitulo(true);

    const response = await RelatorioService.getRelatorioAdesao({
      mes_ano: values.mes,
      lotes: values.lotes,
      tipos_unidades: values.tipos_unidades,
      escola__uuid: values.unidade_educacional,
      periodos_escolares: values.periodos,
      tipos_alimentacao: values.tipos_alimentacao,
      periodo_lancamento_de: values.periodo_lancamento_de,
      periodo_lancamento_ate: values.periodo_lancamento_ate,
    });
    if (response.status === HTTP_STATUS.OK) {
      setResultado(response.data);
    } else {
      toastError(
        "Não foi possível obter os resultados. Tente novamente mais tarde.",
      );
    }

    setLoading(false);
  };

  const limparFiltro = () => {
    if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      setFiltrosSelecionados({
        unidade_educacional: filtrosSelecionados["unidade_educacional"],
      });
      setFiltros({
        unidade_educacional: filtrosSelecionados["unidade_educacional"],
      });
    } else {
      setFiltrosSelecionados(null);
      setFiltros(null);
    }
    setResultado(null);
    setExibirTitulo(false);
  };

  const atualizaFiltrosSelecionados = (values: IFiltros) => {
    setFiltrosSelecionados((prev) => {
      let values_ = values;
      if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
        values_["unidade_educacional"] = [
          localStorage.getItem("labelEscolaLote"),
        ];
      }
      if (prev) return { ...prev, ...values_ };
      return values_;
    });
  };

  return {
    loading,
    params,
    filtros,
    resultado,
    filtrar,
    limparFiltro,
    atualizaFiltrosSelecionados,
    exibirTitulo,
    setExibirTitulo,
  };
};
