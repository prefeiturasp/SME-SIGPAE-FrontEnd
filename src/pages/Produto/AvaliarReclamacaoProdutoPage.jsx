import React, { useState } from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  AVALIAR_RECLAMACAO_PRODUTO,
  GESTAO_PRODUTO,
} from "../../configs/constants";
import AvaliarReclamacaoProduto from "src/components/screens/Produto/AvaliarReclamacaoProduto";

const atual = {
  href: `/${GESTAO_PRODUTO}/${AVALIAR_RECLAMACAO_PRODUTO}`,
  titulo: "Avaliar Reclamação de Produto",
};

export const AvaliarReclamacaoProdutoPage = () => {
  const [produto, setProduto] = useState(null);

  return (
    <Page
      titulo={"Avaliar Reclamação de Produto"}
      botaoVoltar={produto === null}
      voltarPara={"/"}
    >
      <Breadcrumb home={"/"} atual={atual} />
      <AvaliarReclamacaoProduto setPropsPageProduto={setProduto} />
    </Page>
  );
};

export default AvaliarReclamacaoProdutoPage;
