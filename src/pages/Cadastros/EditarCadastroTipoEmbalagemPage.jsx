import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import CadastroTipoEmbalagem from "src/components/screens/Cadastros/TiposEmbalagens/components/CadastroTipoEmbalagem";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  CADASTRO_TIPO_EMBALAGEM,
  TIPOS_EMBALAGENS,
} from "../../configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_TIPO_EMBALAGEM}`,
  titulo: "Editar Cadastro de Tipo de Embalagem",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_EMBALAGENS}`,
    titulo: "Tipos de Embalagens Cadastradas",
  },
];

export default () => (
  <Page
    titulo={atual.titulo}
    botaoVoltar
    voltarPara={`/${CONFIGURACOES}/${CADASTROS}/${TIPOS_EMBALAGENS}`}
  >
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <CadastroTipoEmbalagem />
  </Page>
);
