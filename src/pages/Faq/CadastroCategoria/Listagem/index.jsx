import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import { HOME } from "src/constants/config";
import "./style.scss";

const CAMINHO_FAQ = "/ajuda";
const CAMINHO_LISTAGEM_CATEGORIAS = "/ajuda/cadastro-categoria";
const CAMINHO_CADASTRAR_CATEGORIA = "/ajuda/cadastro-categoria/cadastrar";

const PaginaListagemCategorias = () => {
  const navegar = useNavigate();

  const acessarCadastroCategoria = () => {
    navegar(CAMINHO_CADASTRAR_CATEGORIA);
  };

  return (
    <PageNoSidebar
      titulo="Cadastro Dúvidas Frequentes"
      botaoVoltar
      voltarPara={CAMINHO_FAQ}
      breadcrumb={
        <Breadcrumb
          home={HOME}
          anteriores={[
            {
              href: CAMINHO_FAQ,
              titulo: "Ajuda",
            },
          ]}
          atual={{
            href: CAMINHO_LISTAGEM_CATEGORIAS,
            titulo: "Cadastro de Categoria",
          }}
        />
      }
    >
      <div className="pagina-listagem-categorias">
        <div className="acoes-listagem-categorias">
          <Botao
            texto="Cadastrar Categoria"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            onClick={acessarCadastroCategoria}
          />
        </div>
      </div>
    </PageNoSidebar>
  );
};

export default PaginaListagemCategorias;
