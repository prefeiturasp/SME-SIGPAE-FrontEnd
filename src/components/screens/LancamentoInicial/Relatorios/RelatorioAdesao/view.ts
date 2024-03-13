import { useState } from "react";

import { toastError } from "components/Shareable/Toast/dialogs";

import {
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "helpers/utilities";

import RelatorioService from "services/medicaoInicial/relatorio.service";
import { RelatorioAdesaoResponse } from "services/medicaoInicial/relatorio.interface";

import { Filtros } from "./types";

export default () => {
  const [loading, setLoading] = useState(false);
  const [exibirTitulo, setExibirTitulo] = useState(false);

  const [params, setParams] = useState<Filtros | null>(null);
  const [filtros, setFiltros] = useState<Filtros | null>(null);
  const [filtrosSelecionados, setFiltrosSelecionados] =
    useState<Filtros | null>(null);
  const [resultado, setResultado] = useState<RelatorioAdesaoResponse>(null);

  const filtrar = async (values: Filtros) => {
    setLoading(true);
    setFiltros(filtrosSelecionados);
    setParams(values);
    setExibirTitulo(true);

    try {
      const dados = await RelatorioService.getRelatorioAdesao({
        mes_ano: values.mes,
        diretoria_regional: values.dre,
        lotes: values.lotes,
        escola: values.unidade_educacional,
        periodos_escolares: values.periodos,
        tipos_alimentacao: values.tipos_alimentacao,
      });

      setResultado(dados);
    } catch (e) {
      toastError("Não foi possível obter os resultados");
    }

    setLoading(false);
  };

  const limparFiltro = () => {
    if (usuarioEhDRE()) {
      setFiltrosSelecionados({
        dre: localStorage.getItem("nome_instituicao"),
      });
      setFiltros({
        dre: localStorage.getItem("nome_instituicao"),
      });
    } else if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      setFiltrosSelecionados({
        dre: localStorage.getItem("dre_nome"),
        unidade_educacional: filtrosSelecionados["unidade_educacional"],
      });
      setFiltros({
        dre: localStorage.getItem("dre_nome"),
        unidade_educacional: filtrosSelecionados["unidade_educacional"],
      });
    } else {
      setFiltrosSelecionados(null);
      setFiltros(null);
    }
    setResultado(null);
    setExibirTitulo(false);
  };

  const atualizaFiltrosSelecionados = (values: Filtros) => {
    setFiltrosSelecionados((prev) => {
      if (prev) return { ...prev, ...values };
      return values;
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
