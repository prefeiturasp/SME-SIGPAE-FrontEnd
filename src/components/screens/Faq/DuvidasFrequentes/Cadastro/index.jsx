import React, { useEffect, useState } from "react";
import { AutoComplete, Input } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import { MultiSelect } from "src/components/Shareable/MultiSelect";
import { ModalPadraoSimNao } from "src/components/Shareable/ModalPadraoSimNao";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { formatarParaMultiselect, getError } from "src/helpers/utilities";
import {
  buscarOpcoesCategoriasFaq,
  criarPerguntaFrequente,
} from "src/services/faq.service";
import { getPerfilListagem } from "src/services/perfil.service";
import "./style.scss";

const CadastroDuvidasFrequentes = () => {
  const [categoria, setCategoria] = useState(null);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [perfisAcesso, setPerfisAcesso] = useState([]);
  const [opcoesPerfisAcesso, setOpcoesPerfisAcesso] = useState([]);
  const [carregandoPerfis, setCarregandoPerfis] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [descricaoDetalhada, setDescricaoDetalhada] = useState("");
  const [exibirModalCancelamento, setExibirModalCancelamento] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

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

  useEffect(() => {
    let requisicaoAtiva = true;

    const carregarCategorias = async () => {
      try {
        const resposta = await buscarOpcoesCategoriasFaq();

        if (requisicaoAtiva) {
          setCategorias(resposta.data);
        }
      } catch {
        if (requisicaoAtiva) {
          toastError("Não foi possível carregar as categorias.");
        }
      } finally {
        if (requisicaoAtiva) {
          setCarregandoCategorias(false);
        }
      }
    };

    carregarCategorias();

    return () => {
      requisicaoAtiva = false;
    };
  }, []);

  useEffect(() => {
    let requisicaoAtiva = true;

    const carregarPerfis = async () => {
      try {
        const resposta = await getPerfilListagem();

        if (requisicaoAtiva) {
          setOpcoesPerfisAcesso(formatarParaMultiselect(resposta.data.results));
        }
      } catch {
        if (requisicaoAtiva) {
          toastError("Não foi possível carregar os perfis de acesso.");
        }
      } finally {
        if (requisicaoAtiva) {
          setCarregandoPerfis(false);
        }
      }
    };

    carregarPerfis();

    return () => {
      requisicaoAtiva = false;
    };
  }, []);

  return (
    <div className="cadastro-duvidas-frequentes">
      <form
        className="formulario-cadastro-duvidas-frequentes"
        onSubmit={cadastrarDuvida}
      >
        <div className="linha-formulario">
          <div className="campo-formulario campo-categoria">
            <label htmlFor="categoria" className="col-form-label">
              <span className="required-asterisk">*</span>
              Categoria
            </label>

            <AutoComplete
              id="categoria"
              className="autocomplete-select autocomplete-categoria"
              value={buscaCategoria}
              options={categorias.map((item) => ({
                value: item.nome,
                label: item.nome,
                uuid: item.uuid,
              }))}
              onChange={alterarBuscaCategoria}
              onSelect={selecionarCategoria}
              filterOption={(textoDigitado, opcao) =>
                opcao.label
                  .toLocaleLowerCase("pt-BR")
                  .includes(textoDigitado.toLocaleLowerCase("pt-BR"))
              }
              notFoundContent={
                carregandoCategorias
                  ? "Carregando categorias..."
                  : "Nenhuma categoria encontrada."
              }
            >
              <Input
                name="categoria"
                placeholder="Digite ou selecione a Categoria"
                autoComplete="off"
                required
              />
            </AutoComplete>
          </div>

          <div className="campo-formulario">
            <MultiSelect
              label="Perfis de Acesso"
              name="perfisAcesso"
              required
              options={opcoesPerfisAcesso}
              selected={perfisAcesso}
              onSelectedChange={setPerfisAcesso}
              disabled={!categoria || carregandoPerfis}
              meta={{
                touched: false,
                error: null,
              }}
              overrideStrings={{
                selectSomeItems: "Selecione os Perfis de Acesso",
                allItemsAreSelected: "Todos os itens estão selecionados",
                selectAll: "Todos",
              }}
            />
          </div>
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
