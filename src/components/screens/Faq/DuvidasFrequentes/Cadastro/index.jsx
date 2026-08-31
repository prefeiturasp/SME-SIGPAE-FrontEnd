import React, { useState } from "react";
import { ModalPadraoSimNao } from "src/components/Shareable/ModalPadraoSimNao";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import { criarPerguntaFrequente } from "src/services/faq.service";
import FormularioDuvidaFrequente from "../components/FormularioDuvidaFrequente";
import { useOpcoesCadastroDuvida } from "../hooks/useOpcoesCadastroDuvida";

const VALORES_INICIAIS = {
  categoria: null,
  buscaCategoria: "",
  perfisAcesso: [],
  titulo: "",
  descricaoDetalhada: "",
};

const CadastroDuvidasFrequentes = () => {
  const [valores, setValores] = useState(VALORES_INICIAIS);
  const [exibirModalCancelamento, setExibirModalCancelamento] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

  const {
    categorias,
    carregandoCategorias,
    opcoesPerfisAcesso,
    carregandoPerfis,
  } = useOpcoesCadastroDuvida();

  const formularioPreenchido =
    valores.buscaCategoria.trim() ||
    valores.perfisAcesso.length > 0 ||
    valores.titulo.trim() ||
    valores.descricaoDetalhada.trim();

  const formularioValido =
    valores.categoria &&
    valores.perfisAcesso.length > 0 &&
    valores.titulo.trim() &&
    valores.descricaoDetalhada.trim();

  const alterarValor = (campo, valor) => {
    setValores((valoresAtuais) => ({
      ...valoresAtuais,
      [campo]: valor,
    }));
  };

  const limparFormulario = () => {
    setValores({ ...VALORES_INICIAIS, perfisAcesso: [] });
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

  const alterarBuscaCategoria = (buscaCategoria) => {
    setValores((valoresAtuais) => ({
      ...valoresAtuais,
      categoria: null,
      buscaCategoria,
      perfisAcesso: [],
    }));
  };

  const selecionarCategoria = (_, opcao) => {
    setValores((valoresAtuais) => ({
      ...valoresAtuais,
      categoria: { uuid: opcao.uuid, nome: opcao.label },
      buscaCategoria: opcao.label,
    }));
  };

  const cadastrarDuvida = async (evento) => {
    evento.preventDefault();

    if (!formularioValido || cadastrando) return;

    const todosOsPerfis =
      valores.perfisAcesso.length === opcoesPerfisAcesso.length;

    setCadastrando(true);

    try {
      await criarPerguntaFrequente({
        categoria: valores.categoria.uuid,
        perfis: todosOsPerfis ? [] : valores.perfisAcesso,
        todos_os_perfis: todosOsPerfis,
        pergunta: valores.titulo.trim(),
        resposta: valores.descricaoDetalhada.trim(),
      });

      toastSuccess("Dúvida frequente cadastrada com sucesso!");
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
    <>
      <FormularioDuvidaFrequente
        categorias={categorias}
        carregandoCategorias={carregandoCategorias}
        carregandoPerfis={carregandoPerfis}
        desabilitarSalvar={!formularioValido || cadastrando}
        onAlterarBuscaCategoria={alterarBuscaCategoria}
        onAlterarDescricao={(valor) =>
          alterarValor("descricaoDetalhada", valor)
        }
        onAlterarPerfis={(perfis) => alterarValor("perfisAcesso", perfis)}
        onAlterarTitulo={(titulo) => alterarValor("titulo", titulo)}
        onCancelar={cancelarCadastro}
        onSalvar={cadastrarDuvida}
        onSelecionarCategoria={selecionarCategoria}
        opcoesPerfisAcesso={opcoesPerfisAcesso}
        textoBotaoSalvar="Cadastrar Dúvida"
        valores={valores}
      />

      <ModalPadraoSimNao
        showModal={exibirModalCancelamento}
        closeModal={() => setExibirModalCancelamento(false)}
        tituloModal="Cancelar Cadastro"
        descricaoModal={
          <div className="mensagem-modal-cancelamento">
            <p>Ao cancelar, todos os dados preenchidos serão perdidos.</p>
            <p>Deseja realmente cancelar o cadastro da dúvida?</p>
          </div>
        }
        funcaoSim={confirmarCancelamento}
      />
    </>
  );
};

export default CadastroDuvidasFrequentes;
