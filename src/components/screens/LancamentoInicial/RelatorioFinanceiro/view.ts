import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { getLotesSimples } from "src/services/lote.service";
import { getGrupoUnidadeEscolar } from "src/services/escola.service";
import { getMesesAnosSolicitacoesMedicaoinicial } from "src/services/medicaoInicial/dashboard.service";
import {
  getRelatorioFinanceiroConsolidado,
  getRelatoriosFinanceiros,
} from "src/services/medicaoInicial/relatorioFinanceiro.service";

import {
  FiltrosInterface,
  RelatorioFinanceiroConsolidado,
  RelatorioFinanceiroInterface,
  RelatorioFinanceiroResponse,
} from "src/interfaces/relatorio_financeiro.interface";

import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import { MESES } from "src/constants/shared";

import { MultiSelectOption, SelectOption } from "./types";

const VALORES_INICIAIS = {
  lote: [""],
  grupo_unidade_escolar: {},
  mes_ano: "",
};

export function useRelatorioFinanceiro(filtrosIniciais?: FiltrosInterface) {
  const [lotes, setLotes] = useState<MultiSelectOption[]>([]);
  const [gruposUnidadeEscolar, setGruposUnidadeEscolar] = useState<
    SelectOption[]
  >([]);
  const [mesesAnos, setMesesAnos] = useState<SelectOption[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [relatoriosFinanceiros, setRelatoriosFinanceiros] = useState<
    RelatorioFinanceiroInterface[]
  >([]);
  const [relatoriosFinanceirosResponse, setRelatoriosFinanceirosResponse] =
    useState<RelatorioFinanceiroResponse>();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosInterface | null>(
    filtrosIniciais ?? null,
  );

  const [relatorioConsolidado, setRelatorioConsolidado] =
    useState<RelatorioFinanceiroConsolidado>();
  const [valoresIniciais, setValoresIniciais] = useState(VALORES_INICIAIS);

  const [searchParams] = useSearchParams();
  const uuidRelatorioFinanceiro = searchParams.get("uuid");

  const getLotesAsync = async () => {
    const { data } = await getLotesSimples();
    const lotesOrdenados = data.results.sort((a, b) =>
      a.diretoria_regional.nome.localeCompare(b.diretoria_regional.nome),
    );

    setLotes(
      lotesOrdenados.map((lote) => ({
        value: lote.uuid,
        label: `${lote.nome} - ${lote.diretoria_regional.nome}`,
      })),
    );
  };

  const getGruposUnidadesAsync = async () => {
    const { data } = await getGrupoUnidadeEscolar();
    setGruposUnidadeEscolar(
      data.results.map((grupo) => ({
        value: grupo.uuid,
        label: `${grupo.nome} (${grupo.tipos_unidades
          ?.map((u) => u.iniciais)
          .join(", ")})`,
      })),
    );
  };

  const getMesesAnosAsync = async () => {
    const { data } = await getMesesAnosSolicitacoesMedicaoinicial({
      status: "MEDICAO_APROVADA_PELA_CODAE",
    });

    setMesesAnos([
      { uuid: "", nome: "Selecione o mês de referência" },
      ...data.results.map((mesAno) => ({
        uuid: `${mesAno.mes}_${mesAno.ano}`,
        nome: `${MESES[parseInt(mesAno.mes) - 1]} de ${mesAno.ano}`,
      })),
    ]);
  };

  const getRelatoriosFinanceirosAsync = useCallback(
    async (page = paginaAtual, filtrosParam = filtros) => {
      try {
        const { data } = await getRelatoriosFinanceiros(page, {
          ...filtrosParam,
          lote: filtrosParam?.lote?.toString(),
          grupo_unidade_escolar:
            filtrosParam?.grupo_unidade_escolar?.toString(),
          status: filtrosParam?.status?.toString(),
        });

        setRelatoriosFinanceiros(data.results);
        setRelatoriosFinanceirosResponse(data);
      } catch (error: any) {
        toastError(
          "Erro ao carregar relatórios financeiros. Tente novamente mais tarde." +
            error.toString(),
        );
      }
    },
    [paginaAtual, filtros],
  );

  const getRelatorioConsolidadoAsync = async () => {
    try {
      const { data } = await getRelatorioFinanceiroConsolidado(
        uuidRelatorioFinanceiro,
      );

      setRelatorioConsolidado(data);
      setValoresIniciais({
        lote: [data.lote],
        grupo_unidade_escolar: data.grupo_unidade_escolar,
        mes_ano: data.mes_ano,
      });
    } catch ({ response }: any) {
      toastError(getError(response.data));
    }
  };

  const carregarDadosIniciais = async () => {
    try {
      setCarregando(true);

      const promises = [
        getLotesAsync(),
        getGruposUnidadesAsync(),
        getMesesAnosAsync(),
      ];

      if (uuidRelatorioFinanceiro) {
        promises.push(getRelatorioConsolidadoAsync());
      } else {
        promises.push(getRelatoriosFinanceirosAsync(1, filtros));
      }

      await Promise.all(promises);
    } finally {
      setCarregando(false);
    }
  };

  const aplicarFiltros = (novosFiltros: FiltrosInterface) => {
    setPaginaAtual(1);
    setFiltros(novosFiltros);
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (!uuidRelatorioFinanceiro) {
      getRelatoriosFinanceirosAsync();
    }
  }, [paginaAtual, filtros]);

  return {
    lotes,
    gruposUnidadeEscolar,
    mesesAnos,
    carregando,
    relatoriosFinanceiros,
    relatoriosFinanceirosResponse,
    relatorioConsolidado,
    filtros,
    setFiltros,
    aplicarFiltros,
    paginaAtual,
    setPaginaAtual,
    valoresIniciais,
    recarregar: carregarDadosIniciais,
  };
}
