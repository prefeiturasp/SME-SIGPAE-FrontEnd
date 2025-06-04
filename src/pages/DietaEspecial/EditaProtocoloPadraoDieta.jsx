import React from "react";
import { useLocation } from "react-router-dom";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import UpdateProtocoloPadrao from "src/components/screens/DietaEspecial/CadastroProtocoloPadraoDietaEsp";
import {
  DIETA_ESPECIAL,
  CONSULTA_PROTOCOLO_PADRAO_DIETA,
} from "src/configs/constants";

export default () => {
  const location = useLocation();
  const uuid = location.pathname.split("/")[3];
  const atual = {
    href: `/${DIETA_ESPECIAL}/protocolo-padrao/${uuid}/editar`,
    titulo: "Atualização de Protocolo Padrão de Dieta Especial",
  };
  const anteriores = [
    {
      href: `/${DIETA_ESPECIAL}/${CONSULTA_PROTOCOLO_PADRAO_DIETA}`,
      titulo: "Consultar Protocolo Padrão",
    },
  ];

  return (
    <Page
      botaoVoltar
      voltarPara="/dieta-especial/consultar-protocolo-padrao-dieta"
      titulo={atual.titulo}
    >
      <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
      <UpdateProtocoloPadrao uuid={uuid} />
    </Page>
  );
};
