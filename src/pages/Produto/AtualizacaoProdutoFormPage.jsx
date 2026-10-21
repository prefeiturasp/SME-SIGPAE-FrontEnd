import React from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import AtualizacaoProdutoForm from "../../components/screens/Produto/AtualizacaoProdutoForm";
import Page from "../../components/Shareable/Page/Page";
import {
  PESQUISA_DESENVOLVIMENTO,
  HOMOLOGACAO_PRODUTO,
} from "../../configs/constants";

const atual = {
  href: `/${PESQUISA_DESENVOLVIMENTO}/${HOMOLOGACAO_PRODUTO}`,
  titulo: "Homologação de Produto",
};

const AtualizacaoProdutoFormPage = () => {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");

  return (
    <Page
      titulo={"Ficha de identificação de Produto"}
      botaoVoltar
      voltarPara={"/"}
    >
      <Breadcrumb home={"/"} atual={atual} />
      {/* A key garante que a tela seja remontada ao trocar de produto,
          recarregando os dados e limpando o formulário. */}
      <AtualizacaoProdutoForm key={uuid} uuid={uuid} />
    </Page>
  );
};

export default AtualizacaoProdutoFormPage;
