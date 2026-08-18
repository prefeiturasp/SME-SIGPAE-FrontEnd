import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import { ModalPadraoSimNao } from "src/components/Shareable/ModalPadraoSimNao";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import { criarPerguntaFrequente } from "src/services/faq.service";
import CamposAcesso from "../components/CamposAcesso";
import SeletorCategorias from "../components/SeletorCategorias";
import { useOpcoesCadastroDuvida } from "../hooks/useOpcoesCadastroDuvida";
import "./style.scss";

const CadastroDuvidasFrequentes = () => {
  const [categoria, setCategoria] = useState(null);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [perfisAcesso, setPerfisAcesso] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricaoDetalhada, setDescricaoDetalhada] = useState("");
  const [exibirModalCancelamento, setExibirModalCancelamento] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

  const {
    categorias,
    carregandoCategorias,
    opcoesPerfisAcesso,
    carregandoPerfis,
  } = useOpcoesCadastroDuvida();

  const formularioPreenchido =
    buscaCategoria.trim() ||
    perfisAcesso.length > 0 ||
    titulo.trim() ||
    descricaoDetalhada.trim();

  const formularioValido =
    categoria &&
    perfisAcesso.length > 0 &&
    titulo.trim() &&
    descricaoDetalhada.trim();

  const limparFormulario = () => {
    setCategoria(null);
    setBuscaCategoria("");
    setPerfisAcesso([]);
    setTitulo("");
    setDescricaoDetalhada("");
  };

  const cancelarCadastro = () => {
    if (!formularioPreenchido) {
      limparFormulario();
      return;
    }

    setExibirModalCancelamento(true);
  };

  const confirmarCancelamento = () => {
    limparFormulario();
    setExibirModalCancelamento(false);
  };

  const fecharModalCancelamento = () => {
    setExibirModalCancelamento(false);
  };

  const alterarBuscaCategoria = (valor) => {
    setBuscaCategoria(valor);
    setCategoria(null);
    setPerfisAcesso([]);
  };

  const selecionarCategoria = (_, opcao) => {
    setCategoria({ uuid: opcao.uuid, nome: opcao.label });
    setBuscaCategoria(opcao.label);
  };

  const alterarTitulo = (evento) => {
    setTitulo(evento.target.value);
  };

  const cadastrarDuvida = async (evento) => {
    evento.preventDefault();

    if (!formularioValido || cadastrando) return;

    const todosOsPerfis = perfisAcesso.length === opcoesPerfisAcesso.length;

    setCadastrando(true);

    try {
      await criarPerguntaFrequente({
        categoria: categoria.uuid,
        perfis: todosOsPerfis ? [] : perfisAcesso,
        todos_os_perfis: todosOsPerfis,
        pergunta: titulo.trim(),
        resposta: descricaoDetalhada.trim(),
      });

      toastSuccess("Dúvida Frequente Cadastrada com Sucesso!");
      limparFormulario();
    } catch (erro) {
      const dadosErro = erro.response?.data;

      toastError(
        dadosErro
          ? getError(dadosErro)
          : "Não foi possível cadastrar a dúvida frequente.",
      );
    } finally {
      setCadastrando(false);
    }
  };

  return (
    <div className="cadastro-duvidas-frequentes">
      <form
        className="formulario-cadastro-duvidas-frequentes"
        onSubmit={cadastrarDuvida}
      >
        <div className="linha-formulario">
          <SeletorCategorias
            buscaCategoria={buscaCategoria}
            categorias={categorias}
            carregandoCategorias={carregandoCategorias}
            onBuscaCategoriaChange={alterarBuscaCategoria}
            onCategoriaSelect={selecionarCategoria}
          />

          <CamposAcesso
            categoriaSelecionada={Boolean(categoria)}
            carregandoPerfis={carregandoPerfis}
            onPerfisChange={setPerfisAcesso}
            opcoesPerfisAcesso={opcoesPerfisAcesso}
            perfisAcesso={perfisAcesso}
          />
        </div>

        <div className="campo-formulario campo-titulo">
          <InputText
            label="Título"
            name="titulo"
            placeholder="Descreva o Título da Dúvida"
            required
            input={{
              name: "titulo",
              value: titulo,
              onChange: alterarTitulo,
              onBlur: () => {},
            }}
          />
        </div>

        <div className="campo-formulario campo-descricao">
          <CKEditorField
            label="Descrição Detalhada"
            name="descricaoDetalhada"
            required
            placeholder="Descreva detalhadamente a dúvida"
            input={{
              value: descricaoDetalhada,
              onChange: setDescricaoDetalhada,
            }}
            meta={{
              touched: false,
              error: null,
            }}
            allowImages
          />
        </div>

        <div className="acoes-cadastro-duvidas-frequentes">
          <Botao
            texto="Cancelar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={cancelarCadastro}
          />

          <Botao
            texto="Cadastrar Dúvida"
            type={BUTTON_TYPE.SUBMIT}
            style={BUTTON_STYLE.GREEN}
            disabled={!formularioValido || cadastrando}
          />
        </div>
      </form>

      <ModalPadraoSimNao
        showModal={exibirModalCancelamento}
        closeModal={fecharModalCancelamento}
        tituloModal="Cancelar Cadastro"
        descricaoModal={
          <div className="mensagem-modal-cancelamento">
            <p>Ao cancelar, todos os dados preenchidos serão perdidos.</p>
            <p>Deseja realmente cancelar o cadastro da dúvida?</p>
          </div>
        }
        funcaoSim={confirmarCancelamento}
      />
    </div>
  );
};

export default CadastroDuvidasFrequentes;
