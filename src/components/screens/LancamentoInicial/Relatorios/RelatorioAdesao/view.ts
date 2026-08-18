import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "src/helpers/utilities";

import {
  RelatorioAdesaoEscola,
  RelatorioAdesaoPaginadoResponse,
  RelatorioAdesaoResponse,
} from "src/services/medicaoInicial/relatorio.interface";
import RelatorioService from "src/services/medicaoInicial/relatorio.service";

import { IFiltros } from "./types";

type Paginacao = {
  count: number;
  page_size: number;
};

export default () => {
  const [loading, setLoading] = useState(false);
  const [exibirTitulo, setExibirTitulo] = useState(false);

  const [params, setParams] = useState<IFiltros | null>(null);
  const [filtros, setFiltros] = useState<IFiltros | null>(null);
  const [filtrosSelecionados, setFiltrosSelecionados] =
    useState<IFiltros | null>(null);
  const [resultado, setResultado] = useState<RelatorioAdesaoResponse>(null);
  const [escola, setEscola] = useState<RelatorioAdesaoEscola | null>(null);
  const [paginacao, setPaginacao] = useState<Paginacao | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const buscaRelatorioAdesao = async (values: IFiltros, page: number) => {
    setLoading(true);
    const temFiltroEscola = values.unidade_educacional?.length > 0;
    const response = await RelatorioService.getRelatorioAdesao({
      mes_ano: values.mes,
      lotes: values.lotes,
      tipos_unidades: values.tipos_unidades,
      escola__uuid: values.unidade_educacional,
      periodos_escolares: values.periodos,
      tipos_alimentacao: values.tipos_alimentacao,
      periodo_lancamento_de: values.periodo_lancamento_de,
      periodo_lancamento_ate: values.periodo_lancamento_ate,
      ...(temFiltroEscola ? { page } : {}),
    });
    if (response.status === HTTP_STATUS.OK) {
      if (temFiltroEscola) {
        const data =
          response.data as unknown as RelatorioAdesaoPaginadoResponse;
        const resultadoPagina = data.results?.[0];
        setEscola(resultadoPagina?.escola ?? null);
        setResultado(resultadoPagina?.resultados ?? {});
        setPaginacao({ count: data.count, page_size: data.page_size });
        setPaginaAtual(page);
      } else {
        setEscola(null);
        setPaginacao(null);
        setResultado(response.data as unknown as RelatorioAdesaoResponse);
      }
    } else {
      toastError(
        "Não foi possível obter os resultados. Tente novamente mais tarde.",
      );
    }
    setLoading(false);
  };

  const filtrar = async (values: IFiltros) => {
    if (values.periodo_lancamento_de && !values.periodo_lancamento_ate) {
      toastError("Se preencher o campo `De`, `Até` é obrigatório");
      return;
    }
    if (!values.periodo_lancamento_de && values.periodo_lancamento_ate) {
      toastError("Se preencher o campo `Até`, `De` é obrigatório");
      return;
    }
    setFiltros(filtrosSelecionados);
    setParams(values);
    setExibirTitulo(true);

    await buscaRelatorioAdesao(values, 1);
  };

  const mudarPagina = (page: number) => {
    if (params) {
      buscaRelatorioAdesao(params, page);
    }
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
    setEscola(null);
    setPaginacao(null);
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
    escola,
    paginacao,
    paginaAtual,
    filtrar,
    mudarPagina,
    limparFiltro,
    atualizaFiltrosSelecionados,
    exibirTitulo,
    setExibirTitulo,
  };
};
