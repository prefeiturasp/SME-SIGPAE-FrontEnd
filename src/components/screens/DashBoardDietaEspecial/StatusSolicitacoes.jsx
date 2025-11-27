import { Spin } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import CardListarSolicitacoes from "src/components/Shareable/CardListarSolicitacoes";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { InputSearchPendencias } from "src/components/Shareable/InputSearchPendencias";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  SOLICITACOES_AGUARDANDO_INICIO_VIGENCIA,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_AUTORIZADAS_TEMPORARIAMENTE,
  SOLICITACOES_CANCELADAS,
  SOLICITACOES_INATIVAS,
  SOLICITACOES_INATIVAS_TEMPORARIAMENTE,
  SOLICITACOES_NEGADAS,
  SOLICITACOES_PENDENTES,
} from "src/configs/constants";
import { getNomeCardAguardandoAutorizacao } from "src/helpers/dietaEspecial";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";
import { resetCamposDieta } from "src/reducers/filtersDietaReducer";
import { getMeusLotes } from "src/services/lote.service";
import { meusDados } from "src/services/perfil.service";
import { ajustarFormatoLog } from "../helper";
import { extrairStatusDaSolicitacaoURL } from "./helpers";

function StatusSolicitacoes(props) {
  const [instituicao, setInstituicao] = useState(null);
  const [count, setCount] = useState(0);
  const [tipoSolicitacao, setTipoSolicitacao] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState(null);
  const [listaSolicitacoesSemFiltro, setListaSolicitacoesSemFiltro] =
    useState(null);
  const [tipoCard, setTipoCard] = useState(null);
  const [icone, setIcone] = useState(null);
  const [titulo, setTitulo] = useState(null);
  const [solicitacoesFiltrados, setSolicitacoesFiltrados] = useState(null);
  const [listaLotes, setListaLotes] = useState(null);
  const [filtrouInicial, setFiltroInicial] = useState(false);
  const [busca, setBusca] = useState({ offset: 0, limit: 10 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [propsDietaRedux, setPropsDietaRedux] = useState({});

  let typingTimeout = null;

  const onPesquisarChanged = (values) => {
    let params = busca;
    if (values.status && values.status.length > 0) {
      params["status"] = values.status;
    } else {
      delete params.status;
    }
    if (values.lote && values.lote.length > 0) {
      params["lote"] = values.lote;
    } else {
      delete params.lote;
    }
    if (values.titulo && values.titulo.length >= 2) {
      params["titulo"] = values.titulo;
      setBusca(params);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(async () => {
        getSolicitacoesAsync();
        setPage(1);
      }, 1000);
    } else {
      delete params.titulo;
      setBusca(params);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(async () => {
        getSolicitacoesAsync();
        setPage(1);
      }, 1000);
    }
  };

  const filtragemInicial = () => {
    const propsDieta = {
      tituloDieta: props.tituloDieta,
      loteDieta: props.loteDieta,
      statusDieta: props.statusDieta,
    };
    setPropsDietaRedux(propsDieta);
    const values = {
      titulo: propsDieta.tituloDieta || "",
      lote: propsDieta.loteDieta || "",
      status: propsDieta.statusDieta || "",
    };
    props.resetCamposDieta();
    onPesquisarChanged(values);
  };

  const {
    getDietaEspecialPendenteAutorizacao,
    getDietaEspecialNegadas,
    getDietaEspecialAutorizadas,
    getDietaEspecialCanceladas,
    getDietaEspecialAutorizadasTemporariamente,
    getDietaEspecialAguardandoVigencia,
    getDietaEspecialInativasTemporariamente,
    getDietaEspecialInativas,
  } = props;

  useEffect(() => {
    const fetchData = async () => {
      const url = window.location.href;
      let tipoSolicitacao = extrairStatusDaSolicitacaoURL(url);
      setTipoSolicitacao(tipoSolicitacao);
      meusDados().then((response) => {
        setInstituicao(response.vinculo_atual.instituicao);
      });
      if (usuarioEhEmpresaTerceirizada()) {
        const response = await getMeusLotes();
        setListaLotes(
          [{ nome: "Selecione um lote", uuid: "" }].concat(
            response.data.results,
          ),
        );
      }
    };
    fetchData();
  }, []);

  const updateSolicitacoesState = (response, tipo, titulo) => {
    setSolicitacoes(ajustarFormatoLog(response.data.results, tipo));
    setCount(response.data.count);
    setTipoCard(CARD_TYPE_ENUM[tipo.toUpperCase()]);
    setIcone(ICON_CARD_TYPE_ENUM[tipo.toUpperCase()]);
    setTitulo(titulo);
  };

  const updateSolicitacoesSemFiltro = (response, tipo) => {
    setListaSolicitacoesSemFiltro(
      ajustarFormatoLog(response.data.results, tipo),
    );
  };

  const getSolicitacoesAutorizadas = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialAutorizadas(
      instituicao.uuid,
      params,
    );
    updateSolicitacoesState(response, "autorizado", "Autorizadas");
    updateSolicitacoesSemFiltro(response, "autorizadas");
  };

  const getSolicitacoesNegadas = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialNegadas(instituicao.uuid, params);
    updateSolicitacoesState(response, "negado", "Negadas");
    updateSolicitacoesSemFiltro(response, "negadas");
  };

  const getSolicitacoesPendentesAutorizacao = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialPendenteAutorizacao(
      instituicao.uuid,
      params,
    );
    updateSolicitacoesState(
      response,
      "pendente",
      getNomeCardAguardandoAutorizacao(),
    );
    updateSolicitacoesSemFiltro(response, "pendentes-aut");
  };

  const getSolicitacoesCanceladas = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialCanceladas(instituicao.uuid, params);
    updateSolicitacoesState(response, "cancelado", "Canceladas");
    updateSolicitacoesSemFiltro(response, "canceladas");
  };

  const getSolicitacoesAutorizadasTemporariamente = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialAutorizadasTemporariamente(
      instituicao.uuid,
      params,
    );
    updateSolicitacoesState(
      response,
      "autorizado",
      "Autorizadas Temporariamente",
    );
    updateSolicitacoesSemFiltro(response, "autorizadas-temp");
  };

  const getSolicitacoesAguardandoInicioVigencia = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialAguardandoVigencia(
      instituicao.uuid,
      params,
    );
    updateSolicitacoesState(
      response,
      "aguardando_analise_reclamacao",
      "Aguardando início da vigência",
    );
    updateSolicitacoesSemFiltro(response, "aguardando-inicio-vigencia");
  };

  const getSolicitacoesInativasTemporariamente = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialInativasTemporariamente(
      instituicao.uuid,
      params,
    );
    updateSolicitacoesState(
      response,
      "aguardando_analise_reclamacao",
      "Inativas Temporariamente",
    );
    updateSolicitacoesSemFiltro(response, "inativas-temp");
  };

  const getSolicitacoesInativas = async (offset) => {
    let params = busca;
    params["offset"] = offset;
    const response = await getDietaEspecialInativas(instituicao.uuid, params);
    updateSolicitacoesState(response, "inativo", "Inativas");
    updateSolicitacoesSemFiltro(response, "inativas");
  };

  const solicitacaoHandlers = {
    [SOLICITACOES_PENDENTES]: getSolicitacoesPendentesAutorizacao,
    [SOLICITACOES_NEGADAS]: getSolicitacoesNegadas,
    [SOLICITACOES_AUTORIZADAS]: getSolicitacoesAutorizadas,
    [SOLICITACOES_CANCELADAS]: getSolicitacoesCanceladas,
    [SOLICITACOES_AUTORIZADAS_TEMPORARIAMENTE]:
      getSolicitacoesAutorizadasTemporariamente,
    [SOLICITACOES_AGUARDANDO_INICIO_VIGENCIA]:
      getSolicitacoesAguardandoInicioVigencia,
    [SOLICITACOES_INATIVAS_TEMPORARIAMENTE]:
      getSolicitacoesInativasTemporariamente,
    [SOLICITACOES_INATIVAS]: getSolicitacoesInativas,
  };

  const getSolicitacoesAsync = async (offset = 0) => {
    const handler = solicitacaoHandlers[tipoSolicitacao];
    if (handler) {
      handler(offset);
    }
  };

  useEffect(() => {
    if (tipoSolicitacao && instituicao) {
      getSolicitacoesAsync();
    }
  }, [tipoSolicitacao, instituicao]);

  useEffect(() => {
    if (solicitacoes && listaSolicitacoesSemFiltro) {
      setSolicitacoesFiltrados(solicitacoes);
    }
  }, [solicitacoes, listaSolicitacoesSemFiltro]);

  useEffect(() => {
    if (solicitacoesFiltrados && !filtrouInicial) {
      setFiltroInicial(true);
      filtragemInicial();
    }
  }, [solicitacoesFiltrados, filtrouInicial]);

  const navegacaoPage = (multiploQuantidade, quantidadePorPagina) => {
    setLoading(true);
    const offSet = quantidadePorPagina * (multiploQuantidade - 1);
    getSolicitacoesAsync(offSet);
    setPage(multiploQuantidade);
    setLoading(false);
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="pe-3">
          <InputSearchPendencias
            voltarLink={`/`}
            filterList={onPesquisarChanged}
            tipoSolicitacao={tipoSolicitacao}
            listaLotes={listaLotes}
            propsDieta={propsDietaRedux}
          />
        </div>
        <div className="pb-3" />
        <Spin tip="Carregando..." spinning={!solicitacoesFiltrados || loading}>
          {solicitacoesFiltrados && (
            <CardListarSolicitacoes
              titulo={titulo}
              solicitacoes={solicitacoesFiltrados}
              tipo={tipoCard}
              icone={icone}
            />
          )}
          <Paginacao
            current={page}
            total={count}
            onChange={(page) => navegacaoPage(page, 10)}
          />
        </Spin>
      </div>
    </div>
  );
}

const StatusSolicitacoesDietaEspecialForm = reduxForm({
  form: "statusSolicitacoesDietaEspecial",
  enableReinitialize: true,
})(StatusSolicitacoes);

const selector = formValueSelector("statusSolicitacoesDietaEspecialForm");
const mapStateToProps = (state) => {
  const statusDieta = state.filtersDieta.statusDieta;
  const loteDieta = state.filtersDieta.loteDieta;
  const tituloDieta = state.filtersDieta.tituloDieta;
  return {
    selecionar_todos: selector(state, "selecionar_todos"),
    statusDieta: statusDieta,
    loteDieta: loteDieta,
    tituloDieta: tituloDieta,
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetCamposDieta: () => dispatch(resetCamposDieta()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusSolicitacoesDietaEspecialForm);
