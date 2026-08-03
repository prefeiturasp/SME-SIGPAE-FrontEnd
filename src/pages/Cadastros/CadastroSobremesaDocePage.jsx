import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  SOBREMESA_DOCE,
} from "src/configs/constants";
import { Calendario } from "src/components/Shareable/Calendario";
import {
  getDiasSobremesaDoce,
  setDiaSobremesaDoce,
  deleteDiaSobremesaDoce,
} from "src/services/medicaoInicial/diaSobremesaDoce.service";
import { usuarioEhCODAEGestaoAlimentacao } from "src/helpers/utilities";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${SOBREMESA_DOCE}`,
  titulo: "Sobremesa Doce e Agricultura Familiar",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export const CadastroSobremesaDocePage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <Calendario
        getObjetos={getDiasSobremesaDoce}
        nomeObjeto="Sobremesa Doce ou Agricultura Familiar"
        nomeObjetoMinusculo="sobremesa doce ou agricultura familiar"
        setObjeto={setDiaSobremesaDoce}
        deleteObjeto={deleteDiaSobremesaDoce}
        podeEditar={usuarioEhCODAEGestaoAlimentacao()}
      />
    </Page>
  );
};

export default CadastroSobremesaDocePage;
