import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import { HOME } from "src/constants/config";
import {
  atualizarCategoriaFaq,
  buscarCategoriaFaq,
} from "src/services/faq.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import "./style.scss";

const CAMINHO_FAQ = "/ajuda";
const CAMINHO_LISTAGEM_CATEGORIAS = "/ajuda/cadastro-categoria";

const PaginaEdicaoCategoria = () => {
  const { uuid } = useParams();

  const [nomeCategoria, setNomeCategoria] = useState("");
  const [nomeCategoriaOriginal, setNomeCategoriaOriginal] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const nomeCategoriaNormalizado = nomeCategoria.trim();

  const salvarDesabilitado =
    !nomeCategoriaNormalizado ||
    nomeCategoriaNormalizado === nomeCategoriaOriginal.trim() ||
    salvando;

  const alterarNomeCategoria = (evento) => {
    setNomeCategoria(evento.target.value);
  };

  const cancelarEdicao = () => {
    setNomeCategoria(nomeCategoriaOriginal);
  };

  const salvarAlteracoes = async () => {
    if (salvarDesabilitado) {
      return;
    }

    setSalvando(true);

    try {
      const resposta = await atualizarCategoriaFaq(uuid, {
        nome: nomeCategoriaNormalizado,
      });

      setNomeCategoria(resposta.data.nome);
      setNomeCategoriaOriginal(resposta.data.nome);

      toastSuccess("Categoria Atualizada com Sucesso!");
    } catch {
      toastError("Houve um erro ao atualizar a categoria");
    } finally {
      setSalvando(false);
    }
  };

  useEffect(() => {
    const carregarCategoria = async () => {
      try {
        const resposta = await buscarCategoriaFaq(uuid);

        setNomeCategoria(resposta.data.nome);
        setNomeCategoriaOriginal(resposta.data.nome);
      } catch {
        toastError("Houve um erro ao carregar a categoria");
      } finally {
        setCarregando(false);
      }
    };

    carregarCategoria();
  }, [uuid]);

  return (
    <PageNoSidebar
      titulo="Editar Categoria"
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
            href: "#",
            titulo: "Editar Categoria",
          }}
        />
      }
    >
      <div className="pagina-edicao-categoria">
        {carregando ? (
          <div className="carregamento-edicao-categoria">
            <SigpaeLogoLoader />
          </div>
        ) : (
          <div className="formulario-edicao-categoria">
            <div className="campo-edicao-categoria">
              <InputText
                label="Nome da Categoria"
                name="nomeCategoria"
                required
                valorInicial={nomeCategoria}
                inputOnChange={alterarNomeCategoria}
              />
            </div>

            <div className="acoes-edicao-categoria">
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={cancelarEdicao}
              />

              <Botao
                texto="Salvar Alterações"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                disabled={salvarDesabilitado}
                onClick={salvarAlteracoes}
              />
            </div>
          </div>
        )}
      </div>
    </PageNoSidebar>
  );
};

export default PaginaEdicaoCategoria;
