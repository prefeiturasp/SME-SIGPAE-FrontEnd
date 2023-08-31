import React from "react";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import JustificativaCancelamento from "./JustificativaCancelamento";
import InformacoesAluno from "./InformacoesAluno";
import FluxoDeStatusDieta from "./FluxoDeStatusDieta";
import DadosEscolaSolicitante from "./DadosEscolaSolicitante";
import DadosEscolaDestino from "./DadosEscoladestino";
import DadosDietaEspecial from "./DadosDietaEspecial";
import MotivoNegacao from "./MotivoNegacao";
import SolicitacaoVigente from "../../../Escola/componentes/SolicitacaoVigente";

import DiagnosticosLeitura from "../FormAutorizaDietaEspecial/componentes/Diagnosticos/DiagnosticosLeitura";
import ClassificacaoDaDietaLeitura from "../FormAutorizaDietaEspecial/componentes/ClassificacaoDaDieta/ClassificacaoDietaLeitura";
import ProtocoloLeitura from "../FormAutorizaDietaEspecial/componentes/Protocolos/ProtocoloLeitura";
import OrientacoesLeitura from "../FormAutorizaDietaEspecial/componentes/Orientacoes/OrientacoesLeitura";
import SubstituicoesTable from "../FormAutorizaDietaEspecial/componentes/SubstituicoesField/SubstituicoesTable";
import InformacoesAdicionaisLeitura from "../FormAutorizaDietaEspecial/componentes/InformacoesAdicionais/InformacoesAdicionaisLeitura";
import IdentificacaoNutricionista from "../FormAutorizaDietaEspecial/componentes/IdentificacaoNutricionista";
import PeriodoVigencia from "../FormAutorizaDietaEspecial/componentes/PeriodoVigencia";
import { formataAlergias } from "../FormAutorizaDietaEspecial/helper";
import { ehCanceladaSegundoStep } from "../../helpers";
import "./styles.scss";
import JustificativaNegacao from "./JustificativaNegacao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import Botao from "components/Shareable/Botao";

const CorpoRelatorio = ({
  dietaEspecial,
  dietaCancelada,
  card,
  solicitacaoVigenteAtiva,
  editar,
}) => {
  const onSubmit = () => {
    // será desenvolvido na história 41937
  };

  const canceladaSegundoStep = dietaEspecial
    ? ehCanceladaSegundoStep(dietaEspecial)
    : false;

  const downloadAnexo = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const anexos = dietaEspecial.anexos.map((anexo, key) => {
    return (
      <div className="col-2 mb-3" key={key}>
        <p>
          <b>Anexo {key + 1}</b>
        </p>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.ATTACH}
          className="w-100"
          onClick={() => downloadAnexo(anexo.arquivo_url)}
        />
      </div>
    );
  });

  const montaCorpoRelatorio = () => {
    if (
      ([
        "TERMINADA_AUTOMATICAMENTE_SISTEMA",
        "CODAE_AUTORIZADO",
        "CODAE_AUTORIZOU_INATIVACAO",
      ].includes(dietaEspecial.status_solicitacao) ||
        (card && ["inativas", "inativas-temp"].includes(card))) &&
      dietaEspecial.eh_importado === false &&
      dietaEspecial.ativo === false &&
      !editar
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={5}
        />,
        <IdentificacaoNutricionista key={6} />,
      ];
    } else if (
      dietaEspecial.eh_importado === false &&
      !editar &&
      (["TERMINADA_AUTOMATICAMENTE_SISTEMA", "CODAE_AUTORIZADO"].includes(
        dietaEspecial.status_solicitacao
      ) ||
        (card && ["autorizadas", "autorizadas-temp"].includes(card)))
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <PeriodoVigencia key={5} />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={6}
        />,
        <IdentificacaoNutricionista key={7} />,
      ];
    } else if (
      [
        "CANCELADO_ALUNO_MUDOU_ESCOLA",
        "CANCELADO_ALUNO_NAO_PERTENCE_REDE",
        "ESCOLA_CANCELOU",
      ].includes(dietaEspecial.status_solicitacao) &&
      !canceladaSegundoStep &&
      dietaEspecial.eh_importado === false
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={5}
        />,
        <IdentificacaoNutricionista key={6} />,
      ];
    } else if (
      dietaEspecial.status_solicitacao === "CODAE_NEGOU_PEDIDO" &&
      dietaEspecial.tipo_solicitacao !== "ALTERACAO_UE"
    ) {
      return <IdentificacaoNutricionista />;
    } else if (
      dietaEspecial.status_solicitacao === "CODAE_NEGOU_PEDIDO" &&
      dietaEspecial.tipo_solicitacao === "ALTERACAO_UE"
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={5}
        />,
        <IdentificacaoNutricionista key={6} />,
      ];
    } else if (
      dietaEspecial.eh_importado === true &&
      dietaEspecial.protocolo_padrao &&
      [
        "CODAE_AUTORIZADO",
        "TERCEIRIZADA_TOMOU_CIENCIA",
        "CODAE_AUTORIZOU_INATIVACAO",
        "TERCEIRIZADA_TOMOU_CIENCIA_INATIVACAO",
        "INFORMADO",
        "ESCOLA_CANCELOU",
        "CANCELADO_ALUNO_MUDOU_ESCOLA",
        "CANCELADO_ALUNO_NAO_PERTENCE_REDE",
      ].includes(dietaEspecial.status_solicitacao) &&
      !editar
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        dietaEspecial.tipo_solicitacao === "ALTERACAO_UE" && (
          <PeriodoVigencia key={5} />
        ),
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={6}
        />,
        <IdentificacaoNutricionista key={7} />,

        dietaEspecial.anexos.length > 0 && (
          <div className="mt-0" key={4}>
            <p className="mt-1 mb-2">Anexos</p>
            <div className="row">{anexos}</div>
          </div>
        ),
      ];
    } else if (
      dietaEspecial.eh_importado === true &&
      ([
        "autorizadas",
        "autorizadas-temp",
        "pendentes-aut",
        "inativas",
        "inativas-temp",
        "canceladas",
        "aguardando-vigencia",
      ].includes(card) ||
        [
          "TERMINADA_AUTOMATICAMENTE_SISTEMA",
          "CODAE_AUTORIZADO",
          "CODAE_AUTORIZOU_INATIVACAO",
        ].includes(dietaEspecial.status_solicitacao)) &&
      !editar
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        dietaEspecial.tipo_solicitacao === "ALTERACAO_UE" && (
          <PeriodoVigencia key={3} />
        ),
        dietaEspecial.anexos.length > 0 && (
          <div className="mt-0" key={4}>
            <p className="mt-1 mb-2">Anexos</p>
            <div className="row">{anexos}</div>
          </div>
        ),
      ];
    } else if (
      dietaEspecial.eh_importado === false &&
      dietaEspecial.tipo_solicitacao === "ALTERACAO_UE" &&
      ["CODAE_A_AUTORIZAR", "CODAE_AUTORIZADO"].includes(
        dietaEspecial.status_solicitacao
      )
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <PeriodoVigencia key={5} />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={6}
        />,
        <IdentificacaoNutricionista key={7} />,
      ];
    } else if (
      dietaEspecial.eh_importado === false &&
      ["COMUM", "CANCELAMENTO_DIETA"].includes(
        dietaEspecial.tipo_solicitacao
      ) &&
      ["ESCOLA_SOLICITOU_INATIVACAO", "CODAE_NEGOU_CANCELAMENTO"].includes(
        dietaEspecial.status_solicitacao
      )
    ) {
      return [
        <DiagnosticosLeitura key={0} />,
        <ClassificacaoDaDietaLeitura key={1} />,
        <ProtocoloLeitura key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <PeriodoVigencia key={5} />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={6}
        />,
        <IdentificacaoNutricionista key={7} />,
      ];
    }

    return <></>;
  };

  const initialValues = () => {
    if (![undefined, null].includes(dietaEspecial.alergias_intolerancias)) {
      dietaEspecial.relacao_diagnosticos = formataAlergias(dietaEspecial)
        .map((a) => a.nome)
        .join("; ");
    } else {
      dietaEspecial.relacao_diagnosticos = "";
    }
    dietaEspecial.classificacao_nome = [undefined, null].includes(
      dietaEspecial.classificacao
    )
      ? ""
      : dietaEspecial.classificacao.nome;
    dietaEspecial.nome_protocolo_padrao = [undefined, null].includes(
      dietaEspecial.nome_protocolo
    )
      ? ""
      : dietaEspecial.nome_protocolo;
    dietaEspecial.data_inicio = [undefined, null].includes(
      dietaEspecial.data_inicio
    )
      ? ""
      : dietaEspecial.data_inicio;
    dietaEspecial.data_fim = [undefined, null].includes(
      dietaEspecial.data_termino
    )
      ? ""
      : dietaEspecial.data_termino;
    return dietaEspecial;
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues()}
      mutators={{ ...arrayMutators }}
      render={({ values }) => (
        <form>
          {["CODAE_NEGOU_PEDIDO", "CODAE_NEGOU_CANCELAMENTO"].includes(
            dietaEspecial.status_solicitacao
          ) && [
            <MotivoNegacao
              key={0}
              motivoNegacao={dietaEspecial.motivo_negacao}
            />,
            <JustificativaNegacao
              key={1}
              justificativaNegacao={
                dietaEspecial.justificativa_negacao ||
                dietaEspecial.logs[dietaEspecial.logs.length - 1].justificativa
              }
            />,
          ]}
          {card &&
            ((["pendentes-aut", "negadas"].includes(card) &&
              [
                "ESCOLA_SOLICITOU_INATIVACAO",
                "CODAE_NEGOU_CANCELAMENTO",
              ].includes(dietaEspecial.status_solicitacao)) ||
              (!["inativas", "inativas-temp"].includes(card) &&
                dietaCancelada)) && [
              <JustificativaCancelamento
                key={1}
                dietaEspecial={dietaEspecial}
              />,
              <hr key={2} />,
            ]}
          <InformacoesAluno
            aluno={dietaEspecial.aluno}
            status_solicitacao={dietaEspecial.status_solicitacao}
          />
          {solicitacaoVigenteAtiva &&
            ["pendentes-aut"].includes(card) &&
            dietaEspecial.tipo_solicitacao === "COMUM" &&
            dietaEspecial.status_solicitacao === "CODAE_A_AUTORIZAR" && (
              <SolicitacaoVigente
                solicitacoesVigentes={solicitacaoVigenteAtiva}
              />
            )}
          <hr />
          {dietaEspecial.tipo_solicitacao === "ALTERACAO_UE" && (
            <>
              <DadosEscolaDestino />
              <hr />
            </>
          )}
          <FluxoDeStatusDieta
            logs={dietaEspecial.logs}
            eh_importado={dietaEspecial.eh_importado}
          />
          <hr />
          <DadosEscolaSolicitante />
          <hr />
          <DadosDietaEspecial
            values={values}
            dietaEspecial={dietaEspecial}
            card={card}
          />

          {dietaEspecial && montaCorpoRelatorio()}
        </form>
      )}
    />
  );
};

export default CorpoRelatorio;
