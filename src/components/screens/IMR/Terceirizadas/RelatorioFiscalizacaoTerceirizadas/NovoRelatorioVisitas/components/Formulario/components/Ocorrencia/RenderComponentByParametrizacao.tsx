import React from "react";
import { FormApi } from "final-form";
import { CampoTextoLongo } from "./Inputs/CampoTextoLongo";
import { CampodeTextoSimples } from "./Inputs/CampodeTextoSimples";
import { CampoNumerico } from "./Inputs/CampoNumerico";
import { OpçoesSimNao } from "./Inputs/OpçoesSimNao";
import { SeletorDeDatas } from "./Seletores/SeletorDeDatas";
import { SeletorTipoAlimentacao } from "./Seletores/SeletorTipoAlimentacao";
import {
  TipoOcorrenciaInterface,
  ParametrizacoesInterface,
  EscolaLabelInterface,
} from "interfaces/imr.interface";
import { SeletorUtensiliosCozinha } from "./Seletores/SeletorUtensiliosCozinha";
import { SeletorUtensiliosMesa } from "./Seletores/SeletorUtensiliosMesa";
import { SeletorEquipamentos } from "./Seletores/SeletorEquipamentos";
import { SeletorMobiliarios } from "./Seletores/SeletorMobiliarios";
import { SeletorReparosEAdaptacoes } from "./Seletores/SeletorReparosEAdaptacoes";
import { SeletorInsumos } from "./Seletores/SeletorInsumos";

const componentMap = {
  "Campo de Texto Longo": CampoTextoLongo,
  "Campo de Texto Simples": CampodeTextoSimples,
  "Campo Numérico": CampoNumerico,
  "Opções Sim/Não": OpçoesSimNao,
  "Seletor de Datas": SeletorDeDatas,
  "Seletor de Tipo de Alimentação": SeletorTipoAlimentacao,
  "Seletor de Utensílios de Cozinha": SeletorUtensiliosCozinha,
  "Seletor de Utensílios de Mesa": SeletorUtensiliosMesa,
  "Seletor de Equipamentos": SeletorEquipamentos,
  "Seletor de Mobiliários": SeletorMobiliarios,
  "Seletor de Reparos e Adaptações": SeletorReparosEAdaptacoes,
  "Seletor de Insumos": SeletorInsumos,
};

type RenderComponentByParametrizacaoType = {
  form: FormApi<any, Partial<any>>;
  tipoOcorrencia: TipoOcorrenciaInterface;
  parametrizacao: ParametrizacoesInterface;
  escolaSelecionada: EscolaLabelInterface;
  name_grupos: string;
  UUIDResposta?: string;
  somenteLeitura: boolean;
};

const RenderComponentByParametrizacao = ({
  ...props
}: RenderComponentByParametrizacaoType) => {
  const {
    form,
    tipoOcorrencia,
    parametrizacao,
    escolaSelecionada,
    name_grupos,
    UUIDResposta,
    somenteLeitura,
  } = props;
  const ComponentToRender = componentMap[parametrizacao.tipo_pergunta.nome];

  if (!ComponentToRender) {
    return null;
  }

  return (
    <ComponentToRender
      titulo={parametrizacao.titulo}
      name_grupos={name_grupos}
      name={`${name_grupos}.tipoocorrencia_${tipoOcorrencia.uuid}_parametrizacao_${parametrizacao.uuid}_uuid_${UUIDResposta}`}
      form={form}
      escolaSelecionada={escolaSelecionada}
      somenteLeitura={somenteLeitura}
    />
  );
};

export default RenderComponentByParametrizacao;
