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

import { obtemIdentificacaoNutricionista } from "helpers/utilities";

import { ehCanceladaSegundoStep } from "../../helpers";
import "./styles.scss";
import JustificativaNegacao from "./JustificativaNegacao";

const CorpoRelatorio = ({
  dietaEspecial,
  dietaCancelada,
  card,
  solicitacaoVigenteAtiva
}) => {
  const onSubmit = () => {
    // será desenvolvido na história 41937
  };

  const canceladaSegundoStep = dietaEspecial
    ? ehCanceladaSegundoStep(dietaEspecial)
    : false;

  const montaCorpoRelatorio = () => {
    if (
      card &&
      ["inativas", "inativas-temp"].includes(card) &&
      dietaEspecial.eh_importado === false &&
      dietaEspecial.ativo === false
    ) {
      return [
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
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
        <IdentificacaoNutricionista key={6} />
      ];
    } else if (
      dietaEspecial.eh_importado === false &&
      (dietaEspecial.status_solicitacao ===
        "TERMINADA_AUTOMATICAMENTE_SISTEMA" ||
        (card && ["autorizadas", "autorizadas-temp"].includes(card)))
    ) {
      return [
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={3}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={4}
        />,
        <PeriodoVigencia dieta={dietaEspecial} key={5} />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={6}
        />,
        <IdentificacaoNutricionista key={7} />
      ];
    } else if (
      [
        "CANCELADO_ALUNO_MUDOU_ESCOLA",
        "CANCELADO_ALUNO_NAO_PERTENCE_REDE",
        "ESCOLA_CANCELOU"
      ].includes(dietaEspecial.status_solicitacao) &&
      !canceladaSegundoStep &&
      dietaEspecial.eh_importado === false
    ) {
      return [
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
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
        <IdentificacaoNutricionista key={6} />
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
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
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
        <IdentificacaoNutricionista key={6} />
      ];
    } else if (
      dietaEspecial.eh_importado === true &&
      [
        "autorizadas",
        "autorizadas-temp",
        "pendentes-aut",
        "inativas",
        "inativas-temp",
        "canceladas",
        "aguardando-vigencia"
      ].includes(card)
    ) {
      return [
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
        dietaEspecial.tipo_solicitacao === "ALTERACAO_UE" && (
          <PeriodoVigencia dieta={dietaEspecial} key={3} />
        )
      ];
    } else if (
      dietaEspecial.eh_importado === false &&
      dietaEspecial.tipo_solicitacao === "ALTERACAO_UE" &&
      ["CODAE_A_AUTORIZAR", "CODAE_AUTORIZADO"].includes(
        dietaEspecial.status_solicitacao
      )
    ) {
      return [
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={2}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={3}
        />,
        <PeriodoVigencia dieta={dietaEspecial} key={4} />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={5}
        />,
        <IdentificacaoNutricionista key={7} />
      ];
    } else if (
      dietaEspecial.eh_importado === false &&
      dietaEspecial.tipo_solicitacao === "COMUM" &&
      ["ESCOLA_SOLICITOU_INATIVACAO"].includes(dietaEspecial.status_solicitacao)
    ) {
      return [
        <DiagnosticosLeitura
          alergias={formataAlergias(dietaEspecial)}
          key={0}
        />,
        <ClassificacaoDaDietaLeitura
          classificacaoDieta={dietaEspecial.classificacao}
          key={1}
        />,
        <ProtocoloLeitura protocolo={dietaEspecial.nome_protocolo} key={2} />,
        <OrientacoesLeitura
          orientacoes_gerais={dietaEspecial.orientacoes_gerais}
          key={2}
        />,
        <SubstituicoesTable
          substituicoes={dietaEspecial.substituicoes}
          key={3}
        />,
        <PeriodoVigencia dieta={dietaEspecial} key={4} />,
        <InformacoesAdicionaisLeitura
          informacoes_adicionais={dietaEspecial.informacoes_adicionais}
          key={5}
        />,
        <IdentificacaoNutricionista key={7} />
      ];
    }

    return <></>;
  };

  const initialValues = () => {
    if (dietaEspecial.registro_funcional_nutricionista === "") {
      dietaEspecial.registro_funcional_nutricionista = obtemIdentificacaoNutricionista();
    }
    return dietaEspecial;
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues()}
      mutators={{ ...arrayMutators }}
      render={({ values }) => (
        <form>
          {dietaEspecial.status_solicitacao === "CODAE_NEGOU_PEDIDO" && [
            <MotivoNegacao
              key={0}
              motivoNegacao={dietaEspecial.motivo_negacao}
            />,
            <JustificativaNegacao
              key={1}
              justificativaNegacao={dietaEspecial.justificativa_negacao}
            />
          ]}
          {card &&
            ((["pendentes-aut"].includes(card) &&
              ["ESCOLA_SOLICITOU_INATIVACAO"].includes(
                dietaEspecial.status_solicitacao
              )) ||
              (!["inativas", "inativas-temp"].includes(card) &&
                dietaCancelada)) && [
              <JustificativaCancelamento
                key={1}
                dietaEspecial={dietaEspecial}
              />,
              <hr key={2} />
            ]}
          <InformacoesAluno />
          {solicitacaoVigenteAtiva && ["pendentes-aut"].includes(card) && (
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
