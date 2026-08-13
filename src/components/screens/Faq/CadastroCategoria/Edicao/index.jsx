import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import {
  atualizarCategoriaFaq,
  buscarCategoriaFaq,
} from "src/services/faq.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import HTTP_STATUS from "http-status-codes";
import "./style.scss";

const EdicaoCategoria = () => {
  const { uuid } = useParams();
  const [exibirModalCategoriaDuplicada, setExibirModalCategoriaDuplicada] =
    useState(false);
  const [mensagemCategoriaDuplicada, setMensagemCategoriaDuplicada] =
    useState("");
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
    } catch (erro) {
      const mensagemErro = erro.response?.data?.nome?.[0];
      const categoriaDuplicada =
        erro.response?.status === HTTP_STATUS.BAD_REQUEST;

      if (categoriaDuplicada) {
        setMensagemCategoriaDuplicada(mensagemErro);
        setExibirModalCategoriaDuplicada(true);
        return;
      }
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

  const fecharModalCategoriaDuplicada = () => {
    setExibirModalCategoriaDuplicada(false);
  };

  return (
    <>
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
      {exibirModalCategoriaDuplicada && (
        <ModalGenerico
          show={exibirModalCategoriaDuplicada}
          titulo="Atualizar Categoria"
          texto={<strong>{mensagemCategoriaDuplicada}</strong>}
          textoBotaoSim="OK"
          handleClose={fecharModalCategoriaDuplicada}
          handleSim={fecharModalCategoriaDuplicada}
          unicoBotao
        />
      )}
    </>
  );
};

export default EdicaoCategoria;
