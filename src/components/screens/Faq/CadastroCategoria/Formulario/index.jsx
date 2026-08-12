import React, { useState } from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { HOME } from "src/constants/config";
import { criarCategoriaFaq } from "src/services/faq.service";
import "./style.scss";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import HTTP_STATUS from "http-status-codes";

const CAMINHO_FAQ = "/ajuda";
const CAMINHO_LISTAGEM_CATEGORIAS = "/ajuda/cadastro-categoria";
const CAMINHO_CADASTRAR_CATEGORIA = "/ajuda/cadastro-categoria/cadastrar";

const PaginaFormularioCategoria = () => {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [cadastrando, setCadastrando] = useState(false);

  const nomeCategoriaNormalizado = nomeCategoria.trim();

  const cadastroDesabilitado = !nomeCategoriaNormalizado || cadastrando;

  const [exibirModalCategoriaDuplicada, setExibirModalCategoriaDuplicada] =
    useState(false);
  const [mensagemCategoriaDuplicada, setMensagemCategoriaDuplicada] =
    useState("");

  const fecharModalCategoriaDuplicada = () => {
    setExibirModalCategoriaDuplicada(false);
  };

  const cancelarCadastro = () => {
    setNomeCategoria("");
  };

  const cadastrarCategoria = async (evento) => {
    evento.preventDefault();

    if (cadastroDesabilitado) {
      return;
    }

    setCadastrando(true);

    try {
      const resposta = await criarCategoriaFaq({
        nome: nomeCategoriaNormalizado,
      });

      if (resposta.status === HTTP_STATUS.CREATED) {
        toastSuccess("Categoria Cadastrada com Sucesso!");
        setNomeCategoria("");
      }
    } catch (erro) {
      const mensagemErro = erro.response?.data?.nome?.[0];

      const categoriaDuplicada =
        erro.response?.status === HTTP_STATUS.BAD_REQUEST &&
        mensagemErro?.includes("já existe uma categoria");

      if (categoriaDuplicada) {
        setMensagemCategoriaDuplicada(mensagemErro);
        setExibirModalCategoriaDuplicada(true);
        return;
      }

      toastError(mensagemErro || "Não foi possível cadastrar a categoria.");
    } finally {
      setCadastrando(false);
    }
  };

  return (
    <PageNoSidebar
      titulo="Cadastrar Categoria"
      botaoVoltar
      voltarPara={CAMINHO_LISTAGEM_CATEGORIAS}
      breadcrumb={
        <Breadcrumb
          home={HOME}
          anteriores={[
            {
              href: CAMINHO_FAQ,
              titulo: "Ajuda",
            },
            {
              href: CAMINHO_LISTAGEM_CATEGORIAS,
              titulo: "Cadastro de Categoria",
            },
          ]}
          atual={{
            href: CAMINHO_CADASTRAR_CATEGORIA,
            titulo: "Cadastrar Categoria",
          }}
        />
      }
    >
      <div className="pagina-cadastro-categoria">
        <form
          className="formulario-cadastro-categoria"
          onSubmit={cadastrarCategoria}
        >
          <div className="campo-cadastro-categoria">
            <InputText
              id="nome-categoria"
              label="Nome da Categoria"
              maxlength={100}
              placeholder="Digite o nome da categoria"
              required
              input={{
                name: "nome",
                value: nomeCategoria,
                onChange: (evento) => {
                  setNomeCategoria(evento.target.value);
                },
              }}
            />
          </div>

          <div className="acoes-cadastro-categoria">
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="botao-cadastro-categoria"
              onClick={cancelarCadastro}
            />

            <Botao
              texto={cadastrando ? "Cadastrando..." : "Cadastrar Categoria"}
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN}
              className="botao-cadastro-categoria"
              disabled={cadastroDesabilitado}
            />
          </div>
        </form>

        <ModalGenerico
          show={exibirModalCategoriaDuplicada}
          titulo="Cadastrar Categoria"
          texto={<strong>{mensagemCategoriaDuplicada}</strong>}
          textoBotaoSim="OK"
          handleClose={fecharModalCategoriaDuplicada}
          handleSim={fecharModalCategoriaDuplicada}
          unicoBotao
        />
      </div>
    </PageNoSidebar>
  );
};

export default PaginaFormularioCategoria;
