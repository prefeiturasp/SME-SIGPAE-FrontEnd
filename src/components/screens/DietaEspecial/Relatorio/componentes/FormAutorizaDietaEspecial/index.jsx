import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { CODAE, ESCOLA } from "src/configs/constants";
import { statusEnum, TIPO_SOLICITACAO_DIETA } from "src/constants/shared";
import {
  atualizaDietaEspecial,
  CODAEAtualizaProtocoloDietaEspecial,
  CODAEAutorizaDietaEspecial,
  CODAENegaDietaEspecial,
  getAlergiasIntolerancias,
  getAlimentos,
  getClassificacoesDietaEspecial,
  getNomesProtocolosValidos,
  getProtocoloPadrao,
  getSolicitacoesDietaEspecial,
} from "src/services/dietaEspecial.service";
import { getMotivosNegacaoDietaEspecial } from "src/services/painelNutricionista.service";
import { getSubstitutos } from "src/services/produto.service";
import EscolaCancelaDietaEspecial from "../../componentes/EscolaCancelaDietaEspecial";

import ModalNegaDietaEspecial from "../ModalNegaDietaEspecial";
import ClassificacaoDaDieta from "./componentes/ClassificacaoDaDieta";
import DataTermino from "./componentes/DataTermino";
import Diagnosticos from "./componentes/Diagnosticos";
import IdentificacaoNutricionista from "./componentes/IdentificacaoNutricionista";
import InformacoesAdicionais from "./componentes/InformacoesAdicionais";
import ModalAutorizaAlteracaoUE from "./componentes/ModalAutorizaAlteracaoUE";
import ModalAutorizaDietaEspecial from "./componentes/ModalAutorizaDietaEspecial";
import Orientacoes from "./componentes/Orientacoes";
import Protocolos from "./componentes/Protocolos";
import SubstituicoesField from "./componentes/SubstituicoesField";

import { getStatusSolicitacoesVigentes } from "src/helpers/dietaEspecial";
import {
  agregarDefault,
  deepCopy,
  gerarParametrosConsulta,
  obtemIdentificacaoNutricionista,
} from "src/helpers/utilities";
import { formatarSolicitacoesVigentes } from "../../../Escola/helper";
import { formataMotivos } from "../ModalNegaDietaEspecial/helper";
import {
  formataAlergias,
  formataOpcoesClassificacaoDieta,
  formataSubstituicoes,
} from "./helper";
import "./style.scss";

const FormAutorizaDietaEspecial = ({
  dietaEspecial,
  onAutorizarOuNegar,
  visao,
  dietaCancelada,
  editar,
  cancelar,
}) => {
  const [diagnosticos, setDiagnosticos] = useState(undefined);
  const [alergiasError, setAlergiasError] = useState(false);
  const [alergias, setAlergias] = useState(undefined);
  const [classificacoesDieta, setClassificacoesDieta] = useState(undefined);
  const [protocolos, setProtocolos] = useState(undefined);
  const [protocoloPadrao, setProtocoloPadrao] = useState(undefined);
  const [alimentos, setAlimentos] = useState(undefined);
  const [produtos, setProdutos] = useState(undefined);
  const [showModalNegaDieta, setShowModalNegaDieta] = useState(false);
  const [showAutorizarAlteracaoUEModal, setShowAutorizarAlteracaoUEModal] =
    useState(false);
  const [showAutorizarModal, setShowAutorizarModal] = useState(false);
  const [solicitacoesVigentes, setSolicitacoesVigentes] = useState(undefined);
  const [diagnosticosSelecionados, setDiagnosticosSelecionados] = useState([]);
  const [motivosNegacao, setMotivosNegacao] = useState();
  const tipoUsuario = localStorage.getItem("tipo_perfil");

  const fetchData = async (dietaEspecial) => {
    const respAlergiasIntolerancias = await getAlergiasIntolerancias();
    if (respAlergiasIntolerancias.status === HTTP_STATUS.OK) {
      setDiagnosticos(
        respAlergiasIntolerancias.data.map((r) => {
          return {
            uuid: r.id.toString(),
            nome: r.descricao,
          };
        }),
      );
    } else {
      toastError("Houve um erro ao carregar Alergias e Intolerâncias");
    }

    const respClassificacoes = await getClassificacoesDietaEspecial();
    if (respClassificacoes.status === HTTP_STATUS.OK) {
      setClassificacoesDieta(
        formataOpcoesClassificacaoDieta(respClassificacoes.data),
      );
    } else {
      toastError("Houve um erro ao carregar Classificações da Dieta");
    }

    const payload = { dieta_especial_uuid: dietaEspecial.uuid };
    const respNomesProtocolos = await getNomesProtocolosValidos(payload);
    if (respNomesProtocolos.status === HTTP_STATUS.OK) {
      let optionsProtocolo = [
        {
          nome_protocolo: "Selecione um protocolo",
          uuid: "selecione",
        },
      ];
      optionsProtocolo = optionsProtocolo.concat(
        respNomesProtocolos.data.results,
      );
      setProtocolos(optionsProtocolo);
    } else {
      toastError("Houve um erro ao carregar Nomes dos Protocolos da Dieta");
    }

    const respAlimentos = await getAlimentos();
    if (respAlimentos.status === HTTP_STATUS.OK) {
      setAlimentos(respAlimentos.data);
    } else {
      toastError("Houve um erro ao carregar Alimentos");
    }

    if (!respAlimentos) {
      const respSubstitutos = await getSubstitutos();
      if (respSubstitutos.status === HTTP_STATUS.OK) {
        setProdutos(respSubstitutos.data.results);
      } else {
        toastError("Houve um erro ao carregar Alimentos Substitutos");
      }
    } else {
      const substitutos = respAlimentos.data.map((alimento) =>
        Object.assign({}, alimento, {
          nome: alimento.marca
            ? `${alimento.nome} (${alimento.marca.nome})`
            : `${alimento.nome}`,
        }),
      );
      setProdutos(substitutos);
    }

    const params = gerarParametrosConsulta({
      aluno: dietaEspecial.aluno.uuid,
      status: getStatusSolicitacoesVigentes(),
    });
    const respSolicitacoesVigentes = await getSolicitacoesDietaEspecial(params);
    if (respSolicitacoesVigentes.status === HTTP_STATUS.OK) {
      const resultado = formatarSolicitacoesVigentes(
        respSolicitacoesVigentes.data.results.filter(
          (solicitacaoVigente) =>
            solicitacaoVigente.uuid !== dietaEspecial.uuid,
        ),
      );
      setSolicitacoesVigentes(resultado);
    } else {
      toastError("Houve um erro ao carregar Solicitações Vigentes");
    }

    setDiagnosticosDaDieta();
    setProtocoloDaDieta();
    setAlergias(formataAlergias(dietaEspecial));
  };

  const salvaRascunho = async (values, form) => {
    const { valid } = form.getState();
    if (!valid) {
      toastError(
        "Preencha todos os campos obrigatórios antes de salvar o rascunho.",
      );
      return;
    }

    values.alergias_intolerancias = diagnosticosSelecionados;
    if (protocoloPadrao) {
      values.nome_protocolo = protocoloPadrao.nome_protocolo;
    } else {
      values.nome_protocolo = dietaEspecial.nome_protocolo;
    }
    if (!values.protocolo_padrao) {
      delete values["protocolo_padrao"];
    }
    if (
      values.substituicoes &&
      Object.keys(values.substituicoes[0]).length === 0
    ) {
      delete values["substituicoes"];
    }
    try {
      const response = await atualizaDietaEspecial(dietaEspecial.uuid, values);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Rascunho salvo com sucesso!");
      }
    } catch (error) {
      const mensagem =
        error?.response?.data?.substituicoes ||
        "Houve um erro ao salvar o rascunho.";
      toastError(mensagem);
    }
    onAutorizarOuNegar();
  };

  const onSubmit = async (values_) => {
    const values = deepCopy(values_);
    if (!values.substituicoes || values.substituicoes.length === 0) {
      toastError(
        "É necessário ao menos um alimento na lista de substituições!",
      );
      return;
    }
    values.alergias_intolerancias = diagnosticosSelecionados;
    if (!diagnosticosSelecionados.length) {
      return;
    }
    if (protocoloPadrao) {
      values.nome_protocolo = protocoloPadrao.nome_protocolo;
    } else {
      values.nome_protocolo = dietaEspecial.nome_protocolo;
    }
    if (
      dietaEspecial.tipo_solicitacao === TIPO_SOLICITACAO_DIETA.ALTERACAO_UE &&
      !showAutorizarAlteracaoUEModal
    ) {
      setShowAutorizarAlteracaoUEModal(true);
      return;
    } else if (
      solicitacoesVigentes &&
      solicitacoesVigentes.length > 0 &&
      !showAutorizarModal &&
      !editar &&
      dietaEspecial.tipo_solicitacao !== TIPO_SOLICITACAO_DIETA.ALTERACAO_UE
    ) {
      setShowAutorizarModal(true);
      return;
    }
    if (showAutorizarModal) {
      setShowAutorizarModal(false);
    }
    let { nome_protocolo, data_termino } = values;
    if (nome_protocolo)
      if (nome_protocolo[0] === "") nome_protocolo.splice(0, 1);
    if (!data_termino) {
      delete values.data_termino;
    } else if (
      data_termino &&
      data_termino.includes("/") &&
      dietaEspecial.tipo_solicitacao ===
        TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO
    ) {
      let data = moment(data_termino, "DD/MM/YYYY");
      values.data_termino = moment(data).format("YYYY-MM-DD");
    }
    const response = editar
      ? await CODAEAtualizaProtocoloDietaEspecial(dietaEspecial.uuid, values)
      : await CODAEAutorizaDietaEspecial(dietaEspecial.uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      if (
        dietaEspecial.tipo_solicitacao === TIPO_SOLICITACAO_DIETA.ALTERACAO_UE
      ) {
        setShowAutorizarAlteracaoUEModal(false);
        toastSuccess("Solicitação de alteração de U.E autorizada com sucesso!");
      } else {
        toastSuccess(response.data.detail);
      }
    } else {
      toastError("Houve um erro ao autorizar a Dieta Especial");
    }
    if (editar) {
      cancelar();
      onAutorizarOuNegar(true);
    } else {
      onAutorizarOuNegar(false);
    }
  };

  const getInitialValues = () => {
    if (!dietaEspecial) return {};
    const substituicoes = formataSubstituicoes(dietaEspecial);
    let data_termino_formatada = undefined;
    if (
      dietaEspecial.data_termino &&
      dietaEspecial.tipo_solicitacao === TIPO_SOLICITACAO_DIETA.COMUM
    ) {
      let data = moment(dietaEspecial.data_termino, "DD/MM/YYYY");
      data_termino_formatada = moment(data).format("YYYY-MM-DD");
    }
    return {
      alergias_intolerancias: alergias,
      classificacao: dietaEspecial.classificacao
        ? dietaEspecial.classificacao.id.toString()
        : undefined,
      protocolo_padrao: dietaEspecial.protocolo_padrao,
      orientacoes_gerais: dietaEspecial.orientacoes_gerais,
      substituicoes: substituicoes,
      data_termino:
        data_termino_formatada || dietaEspecial.data_termino || undefined,
      data_inicio: dietaEspecial.data_inicio || undefined,
      informacoes_adicionais: dietaEspecial.informacoes_adicionais,
      registro_funcional_nutricionista: obtemIdentificacaoNutricionista(),
    };
  };

  const setProtocoloDaDieta = async () => {
    if (dietaEspecial.protocolo_padrao) {
      const respProtocoloPadrao = await getProtocoloPadrao(
        dietaEspecial.protocolo_padrao,
      );
      if (respProtocoloPadrao.status === HTTP_STATUS.OK) {
        setProtocoloPadrao(respProtocoloPadrao.data);
      } else {
        toastError("Houve um erro ao carregar Protocolo Padrão");
      }
    }
  };

  const setDiagnosticosDaDieta = () => {
    const diagnosticosDieta = dietaEspecial.alergias_intolerancias.map(
      (alergia) => {
        return alergia.id.toString();
      },
    );
    setDiagnosticosSelecionados(diagnosticosDieta);
  };

  const validaAlergias = (form) => {
    if (diagnosticosSelecionados.length) {
      setAlergiasError(false);
    } else {
      setAlergiasError(true);
    }
    form.submit();
  };

  const getMotivosNegacaoDietaEspecialAsync = async () => {
    const response = await getMotivosNegacaoDietaEspecial({
      processo: "INCLUSAO",
    });
    if (response.status === HTTP_STATUS.OK) {
      setMotivosNegacao(agregarDefault(formataMotivos(response.data)));
    } else {
      toastError("Erro ao carregar motivos de negação.");
    }
  };

  useEffect(() => {
    fetchData(dietaEspecial);
    getMotivosNegacaoDietaEspecialAsync();
  }, []);

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={getInitialValues()}
        keepDirtyOnReinitialize={true}
        mutators={{ ...arrayMutators }}
        render={({ form, handleSubmit, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            {dietaEspecial.tipo_solicitacao !==
              TIPO_SOLICITACAO_DIETA.ALTERACAO_UE && (
              <div className="information-codae">
                {diagnosticos && (
                  <Diagnosticos
                    diagnosticos={diagnosticos}
                    setDiagnosticosSelecionados={setDiagnosticosSelecionados}
                    selectedValues={alergias}
                    alergiasError={alergiasError}
                    setAlergiasError={setAlergiasError}
                  />
                )}
                {classificacoesDieta && (
                  <ClassificacaoDaDieta
                    classificacoesDieta={classificacoesDieta}
                  />
                )}
                {protocolos && (
                  <Protocolos
                    protocolos={protocolos}
                    setProtocoloPadrao={setProtocoloPadrao}
                    form={form}
                  />
                )}
                <Orientacoes />
                {alimentos && produtos && (
                  <>
                    <div className="row mt-3">
                      <div className="col-12 input title mb-2">
                        <span className="required-asterisk">*</span>
                        <label>Substituições de Alimentos</label>
                      </div>
                    </div>
                    <div className="imput title">
                      <SubstituicoesField
                        alimentos={alimentos}
                        produtos={produtos}
                        form={form}
                        values={values}
                        required
                      />
                    </div>
                  </>
                )}
                <DataTermino
                  dietaEspecial={dietaEspecial}
                  temData={dietaEspecial.data_termino ? true : false}
                />
                <InformacoesAdicionais />
                <IdentificacaoNutricionista />
              </div>
            )}
            <div className="row mt-3">
              <div className="col-4">
                {dietaEspecial.tipo_solicitacao !==
                  TIPO_SOLICITACAO_DIETA.ALTERACAO_UE &&
                  !dietaCancelada &&
                  !editar &&
                  tipoUsuario === '"dieta_especial"' && (
                    <Botao
                      texto="Salvar Rascunho"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      onClick={() => salvaRascunho(values, form)}
                      disabled={pristine || submitting}
                    />
                  )}
              </div>
              <div className="col-8">
                {dietaEspecial.status_solicitacao ===
                  statusEnum.CODAE_A_AUTORIZAR &&
                  visao === ESCOLA &&
                  tipoUsuario === '"dieta_especial"' && (
                    <EscolaCancelaDietaEspecial
                      uuid={dietaEspecial?.uuid}
                      onCancelar={() => onAutorizarOuNegar()}
                    />
                  )}
                {dietaEspecial.status_solicitacao ===
                  statusEnum.CODAE_A_AUTORIZAR &&
                  visao === CODAE &&
                  tipoUsuario === '"dieta_especial"' && (
                    <>
                      <Botao
                        texto="Autorizar"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={() => validaAlergias(form)}
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3 float-end"
                        disabled={submitting}
                      />
                      <Botao
                        texto="Negar"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.RED_OUTLINE}
                        onClick={() => setShowModalNegaDieta(true)}
                        className="ms-3 float-end"
                        disabled={submitting}
                      />
                    </>
                  )}
                {dietaEspecial.status_solicitacao ===
                  statusEnum.CODAE_AUTORIZADO &&
                  visao === CODAE &&
                  editar &&
                  tipoUsuario === '"dieta_especial"' && (
                    <>
                      <Botao
                        texto="Salvar"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={() => validaAlergias(form)}
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3 float-end"
                        disabled={submitting}
                      />
                      <Botao
                        texto="Cancelar"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.RED_OUTLINE}
                        onClick={() => cancelar()}
                        className="ms-3 float-end"
                        disabled={submitting}
                      />
                    </>
                  )}
                <ModalAutorizaDietaEspecial
                  closeModal={() => setShowAutorizarModal(false)}
                  showModal={showAutorizarModal}
                  dietaEspecial={dietaEspecial}
                  handleSubmit={form.submit}
                />
                <ModalAutorizaAlteracaoUE
                  closeModal={() => setShowAutorizarAlteracaoUEModal(false)}
                  showModal={showAutorizarAlteracaoUEModal}
                  dietaEspecial={dietaEspecial}
                  handleSubmit={form.submit}
                  submitting={submitting}
                />
              </div>
            </div>
          </form>
        )}
      />
      {motivosNegacao && (
        <ModalNegaDietaEspecial
          showModal={showModalNegaDieta}
          closeModal={() => setShowModalNegaDieta(false)}
          onNegar={onAutorizarOuNegar}
          uuid={dietaEspecial?.uuid}
          motivosNegacao={motivosNegacao}
          submitModal={(uuid, values) => CODAENegaDietaEspecial(uuid, values)}
          fieldJustificativa={"justificativa_negacao"}
          tituloModal={"Deseja negar a solicitação?"}
        />
      )}
    </>
  );
};

export default FormAutorizaDietaEspecial;
