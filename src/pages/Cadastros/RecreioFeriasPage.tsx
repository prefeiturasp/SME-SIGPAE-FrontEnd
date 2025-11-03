import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  RECREIO_NAS_FERIAS,
} from "src/configs/constants";
import { RecreioFerias } from "../../components/screens/Cadastros/RecreioFerias";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${RECREIO_NAS_FERIAS}`,
  titulo: "Recreio nas Férias",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export const RecreioFeriasPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <RecreioFerias />
    </Page>
  );
};

export default RecreioFeriasPage;
