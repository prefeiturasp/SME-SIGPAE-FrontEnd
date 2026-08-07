import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import { HOME } from "src/constants/config";
import TabelaCategorias from "./components/TabelaCategorias";
import "./style.scss";
import { buscarCategoriasFaq } from "src/services/faq.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";

const CAMINHO_FAQ = "/ajuda";
const CAMINHO_LISTAGEM_CATEGORIAS = "/ajuda/cadastro-categoria";
const CAMINHO_CADASTRAR_CATEGORIA = "/ajuda/cadastro-categoria/cadastrar";

const PaginaListagemCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegar = useNavigate();

  const acessarCadastroCategoria = () => {
    navegar(CAMINHO_CADASTRAR_CATEGORIA);
  };

  const editarCategoria = () => {};

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const resposta = await buscarCategoriasFaq();

        setCategorias(resposta.data.results || resposta.data);
      } finally {
        setCarregando(false);
      }
    };

    buscarCategorias();
  }, []);

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
        <div className="conteudo-listagem-categorias">
          <h2 className="titulo-listagem-categorias">Categorias Cadastradas</h2>
          {carregando ? (
            <div className="carregamento-listagem-categorias">
              <SigpaeLogoLoader />
            </div>
          ) : (
            <TabelaCategorias
              categorias={categorias}
              aoEditar={editarCategoria}
            />
          )}
        </div>
      </div>
    </PageNoSidebar>
  );
};

export default PaginaListagemCategorias;
