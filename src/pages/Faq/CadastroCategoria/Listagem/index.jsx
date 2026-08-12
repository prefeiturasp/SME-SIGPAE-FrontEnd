import React, { useState, useEffect, useCallback } from "react";
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
import {
  buscarCategoriasFaq,
  excluirCategoriaFaq,
} from "src/services/faq.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import { Paginacao } from "src/components/Shareable/Paginacao";
import * as constants from "src/configs/constants";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

const CAMINHO_FAQ = `/${constants.AJUDA}`;
const CAMINHO_LISTAGEM_CATEGORIAS = `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}`;
const CAMINHO_CADASTRAR_CATEGORIA = `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/${constants.CADASTRAR_CATEGORIA}`;

const ITENS_POR_PAGINA = 10;

const PaginaListagemCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const navegar = useNavigate();

  const acessarCadastroCategoria = () => {
    navegar(CAMINHO_CADASTRAR_CATEGORIA);
  };

  const editarCategoria = (categoria) => {
    navegar(
      `${CAMINHO_LISTAGEM_CATEGORIAS}/${categoria.uuid}/${constants.EDITAR_CATEGORIA}`,
    );
  };

  const abrirModalExclusao = (categoria) => {
    setCategoriaSelecionada(categoria);
    setExibirModalExclusao(true);
  };

  const fecharModalExclusao = () => {
    setExibirModalExclusao(false);
    setCategoriaSelecionada(null);
  };

  const alterarPagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  const buscarCategorias = useCallback(async () => {
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
  }, [paginaAtual]);

  const confirmarExclusao = async () => {
    if (!categoriaSelecionada || excluindo) {
      return;
    }

    setExcluindo(true);

    try {
      await excluirCategoriaFaq(categoriaSelecionada.uuid);

      setExibirModalExclusao(false);
      setCategoriaSelecionada(null);

      toastSuccess("Categoria Excluída com Sucesso!");

      if (categorias.length === 1 && paginaAtual > 1) {
        setPaginaAtual((pagina) => pagina - 1);
        return;
      }

      await buscarCategorias();
    } catch {
      toastError("Houve um erro ao excluir a categoria");
    } finally {
      setExcluindo(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

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
                aoExcluir={abrirModalExclusao}
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

      <ModalGenerico
        show={exibirModalExclusao}
        titulo="Excluir Categoria"
        texto={
          <>
            <p>
              Ao excluir a Categoria, todas as questões vinculadas serão
              removidas.
            </p>
            <p>Deseja realmente excluir a Categoria?</p>
          </>
        }
        handleClose={fecharModalExclusao}
        handleSim={confirmarExclusao}
        loading={excluindo}
      />
    </PageNoSidebar>
  );
};

export default PaginaListagemCategorias;
