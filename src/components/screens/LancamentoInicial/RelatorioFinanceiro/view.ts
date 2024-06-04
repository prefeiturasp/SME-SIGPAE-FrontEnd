import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getLotesSimples } from "services/lote.service";
import { getGrupoUnidadeEscolar } from "services/escola.service";
import { getMesesAnosSolicitacoesMedicaoinicial } from "services/medicaoInicial/dashboard.service";
import {
  getRelatorioFinanceiroConsolidado,
  getRelatoriosFinanceiros,
} from "services/medicaoInicial/relatorioFinanceiro.service";
import {
  FiltrosInterface,
  RelatorioFinanceiroConsolidado,
  RelatorioFinanceiroInterface,
  RelatorioFinanceiroResponse,
} from "interfaces/relatorio_financeiro.interface";

import { toastError } from "components/Shareable/Toast/dialogs";

import { MultiSelectOption, SelectOption } from "./types";
import { MESES } from "constants/shared";
import { getError } from "helpers/utilities";

type Props = {
  filtros?: FiltrosInterface;
};

const VALORES_INICIAIS = {
  lote: [""],
  grupo_unidade_escolar: "",
  mes_ano: "",
};

export default ({ ...props }: Props) => {
  const [lotes, setLotes] = useState<MultiSelectOption[]>([]);
  const [gruposUnidadeEscolar, setGruposUnidadeEscolar] = useState<
    SelectOption[]
  >([]);
  const [mesesAnos, setMesesAnos] = useState<SelectOption[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [relatoriosFinanceiros, setRelatoriosFinanceiros] = useState<
    RelatorioFinanceiroInterface[]
  >([]);
  const [relatoriosFinanceirosResponse, setResponseEmpenhosResponse] =
    useState<RelatorioFinanceiroResponse>();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [relatorioConsolidado, setRelatorioConsolidado] =
    useState<RelatorioFinanceiroConsolidado>();
  const [valoresIniciais, setValoresIniciais] = useState(VALORES_INICIAIS);

  const [searchParams] = useSearchParams();
  const uuidRelatorioFinanceiro = searchParams.get("uuid");

  const getLotesAsync = async () => {
    try {
      const { data } = await getLotesSimples();
      const lotesOrdenados = data.results.sort((loteA, loteB) => {
        return loteA.diretoria_regional.nome < loteB.diretoria_regional.nome;
      });
      const lotes = lotesOrdenados.map((lote) => {
        return {
          value: lote.uuid,
          label: `${lote.nome} - ${lote.diretoria_regional.nome}`,
        };
      });
      setLotes(lotes);
    } catch (error) {
      toastError("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getGruposUnidades = async () => {
    try {
      const { data } = await getGrupoUnidadeEscolar();
      const tiposUnidades = data.results.map((grupo) => ({
        uuid: grupo.uuid,
        nome: grupo.tipos_unidades
          ?.map((unidade) => unidade.iniciais)
          .join(", "),
      }));

      setGruposUnidadeEscolar(
        [
          {
            uuid: "",
            nome: "Selecione o tipo de UE",
          },
        ].concat(tiposUnidades)
      );
    } catch (error) {
      toastError(
        "Erro ao carregar tipos de unidade escolar. Tente novamente mais tarde."
      );
    }
  };

  const getMesesAnosAsync = async () => {
    try {
      const { data } = await getMesesAnosSolicitacoesMedicaoinicial({
        status: "MEDICAO_APROVADA_PELA_CODAE",
      });
      const mesesAnos = data.results.map((mesAno) => ({
        uuid: `${mesAno.mes}_${mesAno.ano}`,
        nome: `${MESES[parseInt(mesAno.mes) - 1]} de ${mesAno.ano}`,
      }));
      setMesesAnos(
        [
          {
            uuid: "",
            nome: "Selecione o mês de referência",
          },
        ].concat(mesesAnos)
      );
    } catch (error) {
      toastError(
        "Erro ao carregar meses de referência. Tente novamente mais tarde."
      );
    }
  };

  const getRelatoriosFinanceirosAsync = async (
    page: number = null,
    filtros: FiltrosInterface = null
  ) => {
    try {
      filtros = { ...filtros, lote: filtros?.lote?.toString() };

      const { data } = await getRelatoriosFinanceiros(page, filtros);

      setRelatoriosFinanceiros(data.results);
      setResponseEmpenhosResponse(data);
    } catch (error) {
      toastError(
        "Erro ao carregar relatórios financeiros. Tente novamente mais tarde."
      );
    }
  };

  const getRelatorioConsolidadoAsync = async () => {
    try {
      const { data } = await getRelatorioFinanceiroConsolidado(
        uuidRelatorioFinanceiro
      );
      setRelatorioConsolidado(data);
      setValoresIniciais({
        lote: [data.lote],
        grupo_unidade_escolar: data.grupo_unidade_escolar,
        mes_ano: data.mes_ano,
      });
    } catch ({ response }) {
      toastError(getError(response.data));
    }
  };

  const requisicoesPreRender = async (): Promise<void> => {
    Promise.all([
      getLotesAsync(),
      getGruposUnidades(),
      getMesesAnosAsync(),
      !uuidRelatorioFinanceiro &&
        getRelatoriosFinanceirosAsync(paginaAtual, props.filtros),
      uuidRelatorioFinanceiro && getRelatorioConsolidadoAsync(),
    ]).then(() => {
      setCarregando(false);
    });
  };

  useEffect(() => {
    setPaginaAtual(1);
    requisicoesPreRender();
  }, []);

  return {
    lotes,
    gruposUnidadeEscolar,
    mesesAnos,
    carregando,
    relatoriosFinanceiros,
    relatoriosFinanceirosResponse,
    paginaAtual,
    relatorioConsolidado,
    valoresIniciais,
    setPaginaAtual,
    setCarregando,
    getRelatoriosFinanceirosAsync,
  };
};
