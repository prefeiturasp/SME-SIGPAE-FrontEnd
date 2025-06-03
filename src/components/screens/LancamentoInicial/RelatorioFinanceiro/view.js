import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLotesSimples } from "src/services/lote.service";
import { getGrupoUnidadeEscolar } from "src/services/escola.service";
import { getMesesAnosSolicitacoesMedicaoinicial } from "src/services/medicaoInicial/dashboard.service";
import {
  getRelatorioFinanceiroConsolidado,
  getRelatoriosFinanceiros,
} from "src/services/medicaoInicial/relatorioFinanceiro.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { MESES } from "src/constants/shared";
import { getError } from "src/helpers/utilities";
const VALORES_INICIAIS = {
  lote: [""],
  grupo_unidade_escolar: "",
  mes_ano: "",
};
export default ({ ...props }) => {
  const [lotes, setLotes] = useState([]);
  const [gruposUnidadeEscolar, setGruposUnidadeEscolar] = useState([]);
  const [mesesAnos, setMesesAnos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [relatoriosFinanceiros, setRelatoriosFinanceiros] = useState([]);
  const [relatoriosFinanceirosResponse, setResponseEmpenhosResponse] =
    useState();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [relatorioConsolidado, setRelatorioConsolidado] = useState();
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
  const getRelatoriosFinanceirosAsync = async (page = null, filtros = null) => {
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
  const requisicoesPreRender = async () => {
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
