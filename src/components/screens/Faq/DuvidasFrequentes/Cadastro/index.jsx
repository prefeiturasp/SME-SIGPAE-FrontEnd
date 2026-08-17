import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import { MultiSelect } from "src/components/Shareable/MultiSelect";
import { ModalPadraoSimNao } from "src/components/Shareable/ModalPadraoSimNao";
import "./style.scss";

const CadastroDuvidasFrequentes = () => {
  const [categoria, setCategoria] = useState("");
  const [perfisAcesso, setPerfisAcesso] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricaoDetalhada, setDescricaoDetalhada] = useState("");
  const [exibirModalCancelamento, setExibirModalCancelamento] = useState(false);

  const categorias = [];
  const opcoesPerfisAcesso = [];

  const formularioPreenchido =
    categoria ||
    perfisAcesso.length > 0 ||
    titulo.trim() ||
    descricaoDetalhada.trim();

  const formularioValido =
    categoria &&
    perfisAcesso.length > 0 &&
    titulo.trim() &&
    descricaoDetalhada.trim();

  const limparFormulario = () => {
    setCategoria("");
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

  const alterarCategoria = (evento) => {
    const valor = evento.target.value;

    setCategoria(valor);

    if (!valor) {
      setPerfisAcesso([]);
    }
  };

  const alterarTitulo = (evento) => {
    setTitulo(evento.target.value);
  };

  const cadastrarDuvida = (evento) => {
    evento.preventDefault();
    if (!formularioValido) return;
  };

  return (
    <div className="cadastro-duvidas-frequentes">
      <form
        className="formulario-cadastro-duvidas-frequentes"
        onSubmit={cadastrarDuvida}
      >
        <div className="linha-formulario">
          <div className="campo-formulario">
            <label htmlFor="categoria" className="col-form-label">
              <span className="required-asterisk">*</span>
              Categoria
            </label>

            <select
              id="categoria"
              name="categoria"
              className="form-control"
              value={categoria}
              onChange={alterarCategoria}
              required
            >
              <option value="">Selecione a Categoria</option>

              {categorias.map((item) => (
                <option key={item.uuid} value={item.uuid}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-formulario">
            <MultiSelect
              label="Perfis de Acesso"
              name="perfisAcesso"
              required
              options={opcoesPerfisAcesso}
              selected={perfisAcesso}
              onSelectedChange={setPerfisAcesso}
              disabled={!categoria}
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
            valorInicial={titulo}
            inputOnChange={alterarTitulo}
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
            disabled={!formularioValido}
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
