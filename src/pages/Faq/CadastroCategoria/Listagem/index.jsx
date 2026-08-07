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
import { Paginacao } from "src/components/Shareable/Paginacao";

const CAMINHO_FAQ = "/ajuda";
const CAMINHO_LISTAGEM_CATEGORIAS = "/ajuda/cadastro-categoria";
const CAMINHO_CADASTRAR_CATEGORIA = "/ajuda/cadastro-categoria/cadastrar";

const ITENS_POR_PAGINA = 10;

const PaginaListagemCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalCategorias, setTotalCategorias] = useState(0);

  const navegar = useNavigate();

  const acessarCadastroCategoria = () => {
    navegar(CAMINHO_CADASTRAR_CATEGORIA);
  };

  const editarCategoria = (categoria) => {
    navegar(`${CAMINHO_LISTAGEM_CATEGORIAS}/${categoria.uuid}/editar`);
  };

  const alterarPagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  useEffect(() => {
    const buscarCategorias = async () => {
      setCarregando(true);

      try {
        const resposta = await buscarCategoriasFaq({
          page: paginaAtual,
          page_size: ITENS_POR_PAGINA,
        });

        setCategorias(resposta.data.results);
        setTotalCategorias(resposta.data.count);
      } finally {
        setCarregando(false);
      }
    };

    buscarCategorias();
  }, [paginaAtual]);

  return (
    <PageNoSidebar
      titulo="Cadastrar Categoria"
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
            <>
              <TabelaCategorias
                categorias={categorias}
                aoEditar={editarCategoria}
              />

              {totalCategorias > ITENS_POR_PAGINA && (
                <Paginacao
                  current={paginaAtual}
                  pageSize={ITENS_POR_PAGINA}
                  total={totalCategorias}
                  onChange={alterarPagina}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageNoSidebar>
  );
};

export default PaginaListagemCategorias;
