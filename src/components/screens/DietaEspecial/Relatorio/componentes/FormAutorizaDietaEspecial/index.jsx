import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Form } from "react-final-form";
import moment from "moment";
import arrayMutators from "final-form-arrays";
import { TIPO_SOLICITACAO_DIETA } from "constants/shared";
import { toastSuccess, toastError } from "components/Shareable/Toast/dialogs";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import Botao from "components/Shareable/Botao";

import {
  getAlergiasIntolerancias,
  getClassificacoesDietaEspecial,
  getNomesProtocolosValidos,
  getProtocoloPadrao,
  getAlimentos,
  atualizaDietaEspecial,
  getSolicitacoesDietaEspecial,
  CODAEAutorizaDietaEspecial
} from "services/dietaEspecial.service";
import { getSubstitutos } from "services/produto.service";

import Diagnosticos from "./componentes/Diagnosticos";
import ClassificacaoDaDieta from "./componentes/ClassificacaoDaDieta";
import Protocolos from "./componentes/Protocolos";
import Orientacoes from "./componentes/Orientacoes";
import SubstituicoesField from "./componentes/SubstituicoesField";
import DataTermino from "./componentes/DataTermino";
import InformacoesAdicionais from "./componentes/InformacoesAdicionais";
import IdentificacaoNutricionista from "./componentes/IdentificacaoNutricionista";
import ModalNegaDietaEspecial from "../ModalNegaDietaEspecial";
import ModalAutorizaDietaEspecial from "./componentes/ModalAutorizaDietaEspecial";
import ModalAutorizaAlteracaoUE from "./componentes/ModalAutorizaAlteracaoUE";

import {
  formataOpcoesClassificacaoDieta,
  formataSubstituicoes,
  formataAlergias
} from "./helper";
import {
  obtemIdentificacaoNutricionista,
  gerarParametrosConsulta
} from "helpers/utilities";
import { getStatusSolicitacoesVigentes } from "helpers/dietaEspecial";
import { formatarSolicitacoesVigentes } from "../../../Escola/helper";
import "./style.scss";

const FormAutorizaDietaEspecial = ({ dietaEspecial, onAutorizarOuNegar }) => {
  const [diagnosticos, setDiagnosticos] = useState(undefined);
  const [alergiasError, setAlergiasError] = useState(false);
  const [alergias, setAlergias] = useState(undefined);
  const [classificacoesDieta, setClassificacoesDieta] = useState(undefined);
  const [protocolos, setProtocolos] = useState(undefined);
  const [protocoloPadrao, setProtocoloPadrao] = useState(undefined);
  const [alimentos, setAlimentos] = useState(undefined);
  const [produtos, setProdutos] = useState(undefined);
  const [showModalNegaDieta, setShowModalNegaDieta] = useState(false);
  const [
    showAutorizarAlteracaoUEModal,
    setShowAutorizarAlteracaoUEModal
  ] = useState(false);
  const [showAutorizarModal, setShowAutorizarModal] = useState(false);
  const [solicitacoesVigentes, setSolicitacoesVigentes] = useState(undefined);
  const [diagnosticosSelecionados, setDiagnosticosSelecionados] = useState([]);

  const fetchData = async dietaEspecial => {
    const respAlergiasIntolerancias = await getAlergiasIntolerancias();
    if (respAlergiasIntolerancias.status === HTTP_STATUS.OK) {
      setDiagnosticos(respAlergiasIntolerancias.results);
    } else {
      toastError("Houve um erro ao carregar Alergias e Intolerâncias");
    }

    const respClassificacoes = await getClassificacoesDietaEspecial();
    if (respClassificacoes.status === HTTP_STATUS.OK) {
      setClassificacoesDieta(
        formataOpcoesClassificacaoDieta(respClassificacoes.results)
      );
    } else {
      toastError("Houve um erro ao carregar Classificações da Dieta");
    }

    const respNomesProtocolos = await getNomesProtocolosValidos();
    if (respNomesProtocolos.status === HTTP_STATUS.OK) {
      let optionsProtocolo = [
        {
          nome_protocolo: "Selecione um protocolo",
          uuid: "selecione"
        }
      ];
      optionsProtocolo = optionsProtocolo.concat(
        respNomesProtocolos.data.results
      );
      setProtocolos(optionsProtocolo);
    } else {
      toastError("Houve um erro ao carregar Nomes dos Protocolos da Dieta");
    }

    const respAlimentos = await getAlimentos({
      tipo: dietaEspecial.escola.tipo_gestao.nome === "TERC TOTAL" ? "E" : "P"
    });
    if (respAlimentos.status === HTTP_STATUS.OK) {
      setAlimentos(respAlimentos.data);
    } else {
      toastError("Houve um erro ao carregar Alimentos");
    }

    if (dietaEspecial.escola.tipo_gestao.nome === "TERC TOTAL") {
      const respSubstitutos = await getSubstitutos();
      if (respSubstitutos.status === HTTP_STATUS.OK) {
        setProdutos(respSubstitutos.data.results);
      } else {
        toastError("Houve um erro ao carregar Alimentos Substitutos");
      }
    } else {
      const substitutos = respAlimentos.data.map(alimento =>
        Object.assign({}, alimento, {
          nome: alimento.marca
            ? `${alimento.nome} (${alimento.marca.nome})`
            : `${alimento.nome}`
        })
      );
      setProdutos(substitutos);
    }

    const params = gerarParametrosConsulta({
      aluno: dietaEspecial.aluno.uuid,
      status: getStatusSolicitacoesVigentes()
    });
    const respSolicitacoesVigentes = await getSolicitacoesDietaEspecial(params);
    if (respSolicitacoesVigentes.status === HTTP_STATUS.OK) {
      const resultado = formatarSolicitacoesVigentes(
        respSolicitacoesVigentes.data.results.filter(
          solicitacaoVigente => solicitacaoVigente.uuid !== dietaEspecial.uuid
        )
      );
      setSolicitacoesVigentes(resultado);
    } else {
      toastError("Houve um erro ao carregar Solicitações Vigentes");
    }

    setDiagnosticosDaDieta();
    setProtocoloDaDieta();
    setAlergias(formataAlergias(dietaEspecial));
  };

  const salvaRascunho = async values => {
    values.alergias_intolerancias = diagnosticosSelecionados;
    if (protocoloPadrao) {
      values.nome_protocolo = protocoloPadrao.nome_protocolo;
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
    const response = await atualizaDietaEspecial(dietaEspecial.uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Rascunho salvo com sucesso!");
    } else {
      toastError("Houve um erro ao salvar o rascunho.");
    }
    onAutorizarOuNegar();
  };

  const onSubmit = async values => {
    values.alergias_intolerancias = diagnosticosSelecionados;
    if (!diagnosticosSelecionados.length) {
      return;
    }
    values.nome_protocolo = protocoloPadrao.nome_protocolo;
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
    if (
      data_termino &&
      dietaEspecial.tipo_solicitacao ===
        TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO
    ) {
      let data = moment(data_termino, "DD/MM/YYYY");
      data_termino = moment(data).format("YYYY-MM-DD");
    }
    const response = await CODAEAutorizaDietaEspecial(
      dietaEspecial.uuid,
      values
    );
    if (response.status === HTTP_STATUS.OK) {
      if (
        dietaEspecial.tipo_solicitacao === TIPO_SOLICITACAO_DIETA.ALTERACAO_UE
      ) {
        toastSuccess("Solicitação de alteração de U.E autorizada com sucesso!");
      } else {
        toastSuccess("Autorização de Dieta Especial realizada com sucesso!");
      }
    } else {
      toastError("Houve um erro ao autorizar a Dieta Especial");
    }
    onAutorizarOuNegar();
  };

  const getInitialValues = () => {
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
      informacoes_adicionais: dietaEspecial.informacoes_adicionais,
      registro_funcional_nutricionista: obtemIdentificacaoNutricionista()
    };
  };

  const setProtocoloDaDieta = async () => {
    if (dietaEspecial.protocolo_padrao) {
      const respProtocoloPadrao = await getProtocoloPadrao(
        dietaEspecial.protocolo_padrao
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
      alergia => {
        return alergia.id.toString();
      }
    );
    setDiagnosticosSelecionados(diagnosticosDieta);
  };

  const validaAlergias = form => {
    if (diagnosticosSelecionados.length) {
      setAlergiasError(false);
    } else {
      setAlergiasError(true);
    }
    form.submit();
  };

  useEffect(() => {
    fetchData(dietaEspecial);
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
                      />
                    </div>
                  </>
                )}
                <DataTermino
                  tipoSolicitacao={dietaEspecial.tipo_solicitacao}
                  temData={dietaEspecial.data_termino ? true : false}
                />
                <InformacoesAdicionais />
                <IdentificacaoNutricionista />
              </div>
            )}
            <div className="row mt-3">
              <div className="col-4">
                {dietaEspecial.tipo_solicitacao !==
                  TIPO_SOLICITACAO_DIETA.ALTERACAO_UE && (
                  <Botao
                    texto="Salvar Rascunho"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => salvaRascunho(values)}
                    disabled={pristine || submitting}
                  />
                )}
              </div>
              <div className="col-8">
                <Botao
                  texto="Autorizar"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => validaAlergias(form)}
                  style={BUTTON_STYLE.GREEN}
                  className="ml-3 float-right"
                  disabled={submitting}
                />
                <Botao
                  texto="Negar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.RED_OUTLINE}
                  onClick={() => setShowModalNegaDieta(true)}
                  className="ml-3 float-right"
                  disabled={submitting}
                />
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
                />
              </div>
            </div>
          </form>
        )}
      />
      <ModalNegaDietaEspecial
        showModalNegaDieta={showModalNegaDieta}
        closeModal={() => setShowModalNegaDieta(false)}
        onNegar={onAutorizarOuNegar}
        uuid={dietaEspecial.uuid}
      />
    </>
  );
};

export default FormAutorizaDietaEspecial;
