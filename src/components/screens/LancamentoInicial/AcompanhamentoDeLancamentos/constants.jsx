import { usuarioEhEscolaTerceirizadaDiretor } from "src/helpers/utilities";
import React from "react";

export const MEDICAO_CARD_NOME_POR_STATUS_DRE = {
  MEDICAO_ENVIADA_PELA_UE: {
    nome: (
      <div>
        {usuarioEhEscolaTerceirizadaDiretor() ? "Enviado" : "Recebido"} <br />{" "}
        para análise
      </div>
    ),
    cor: "azul-claro",
  },
  MEDICAO_CORRECAO_SOLICITADA: {
    nome: (
      <div>
        Devolvido para
        <br /> ajustes pela DRE
      </div>
    ),
    cor: "laranja",
  },
  MEDICAO_CORRECAO_SOLICITADA_CODAE: {
    nome: (
      <div>
        Devolvido para
        <br /> ajustes pela CODAE
      </div>
    ),
    cor: "vermelho",
  },
  MEDICAO_CORRIGIDA_PELA_UE: {
    nome: <div>Corrigido para DRE</div>,
    cor: "azul-escuro",
  },
  MEDICAO_CORRIGIDA_PARA_CODAE: {
    nome: (
      <div>
        Corrigido para
        <br /> CODAE
      </div>
    ),
    cor: "azul-escuro",
  },
  MEDICAO_APROVADA_PELA_DRE: {
    nome: <div>Aprovado pela DRE</div>,
    cor: "verde-claro",
  },
  MEDICAO_APROVADA_PELA_CODAE: {
    nome: (
      <div>
        Aprovado pela <br /> CODAE
      </div>
    ),
    cor: "verde-escuro",
  },
  TODOS_OS_LANCAMENTOS: {
    nome: (
      <div>
        Todos os <br /> Lançamentos
      </div>
    ),
    cor: "vermelho",
  },
  MEDICAO_CORRIGIDA: {
    nome: <div>Corrigido</div>,
    cor: "azul-escuro",
  },
  MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE: {
    nome: (
      <div>
        Em Preenchimento <br /> pela Unidade
      </div>
    ),
    cor: "greenLight",
  },
};

export const STATUS_RELACAO_DRE_UE = [
  "MEDICAO_ENVIADA_PELA_UE",
  "MEDICAO_CORRECAO_SOLICITADA",
  "MEDICAO_CORRIGIDA_PELA_UE",
];
