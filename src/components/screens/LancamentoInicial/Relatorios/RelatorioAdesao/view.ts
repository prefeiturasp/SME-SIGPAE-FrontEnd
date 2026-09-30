import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "src/helpers/utilities";

import {
  RelatorioAdesaoEscola,
  RelatorioAdesaoEscolaResultado,
  RelatorioAdesaoPaginadoResponse,
  RelatorioAdesaoResponse,
  RelatorioAdesaoResultadoIndividual,
} from "src/services/medicaoInicial/relatorio.interface";
import RelatorioService from "src/services/medicaoInicial/relatorio.service";

import {
  devePaginarRelatorioAdesao,
  montaIdentificacaoResultadoIndividual,
  montaParamsRelatorioAdesao,
} from "./helpers";
import { IFiltros, IResultadoIndividual } from "./types";

type Paginacao = {
  count: number;
  page_size: number;
};

const isResultadoIndividual = (
  item:
    | RelatorioAdesaoEscolaResultado
    | RelatorioAdesaoResultadoIndividual
    | undefined,
): item is RelatorioAdesaoResultadoIndividual =>
  Boolean(item && "data" in item);

export default () => {
  const [loading, setLoading] = useState(false);
  const [exibirTitulo, setExibirTitulo] = useState(false);

  const [params, setParams] = useState<IFiltros | null>(null);
  const [filtros, setFiltros] = useState<IFiltros | null>(null);
  const [filtrosSelecionados, setFiltrosSelecionados] =
    useState<IFiltros | null>(null);
  const [resultado, setResultado] = useState<RelatorioAdesaoResponse>(null);
  const [escola, setEscola] = useState<RelatorioAdesaoEscola | null>(null);
  const [resultadoIndividual, setResultadoIndividual] =
    useState<IResultadoIndividual | null>(null);
  const [paginacao, setPaginacao] = useState<Paginacao | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const buscaRelatorioAdesao = async (values: IFiltros, page: number) => {
    setLoading(true);
    const devePaginar = devePaginarRelatorioAdesao(values);
    const response = await RelatorioService.getRelatorioAdesao(
      montaParamsRelatorioAdesao(values, devePaginar ? page : undefined),
    );
    if (response.status === HTTP_STATUS.OK) {
      if (devePaginar) {
        const data =
          response.data as unknown as RelatorioAdesaoPaginadoResponse;
        const resultadoPagina = data.results?.[0];
        if (values.resultado_individual_por_data) {
          setEscola(null);
          setResultadoIndividual(
            montaIdentificacaoResultadoIndividual(
              isResultadoIndividual(resultadoPagina)
                ? resultadoPagina
                : undefined,
              filtrosSelecionados?.tipos_unidades,
            ),
          );
        } else {
          setResultadoIndividual(null);
          setEscola(
            (resultadoPagina as RelatorioAdesaoEscolaResultado)?.escola ?? null,
          );
        }
        setResultado(resultadoPagina?.resultados ?? {});
        setPaginacao({ count: data.count, page_size: data.page_size });
        setPaginaAtual(page);
      } else {
        setEscola(null);
        setResultadoIndividual(null);
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
    if (
      values.resultado_individual_por_data &&
      (!values.tipos_unidades || values.tipos_unidades.length === 0)
    ) {
      toastError("O campo Tipo de Unidade é obrigatório");
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
    setResultadoIndividual(null);
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
    resultadoIndividual,
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
