import React, { FormEvent } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import CamposAcesso from "../CamposAcesso";
import SeletorCategorias, {
  Categoria,
  OpcaoCategoria,
} from "../SeletorCategorias";
import "./style.scss";

interface CategoriaSelecionada {
  nome: string;
  uuid: string;
}

interface OpcaoPerfilAcesso {
  label: string;
  value: string;
}

export interface ValoresFormularioDuvida {
  buscaCategoria: string;
  categoria: CategoriaSelecionada | null;
  descricaoDetalhada: string;
  perfisAcesso: string[];
  titulo: string;
}

interface FormularioDuvidaFrequenteProps {
  categorias: Categoria[];
  carregandoCategorias: boolean;
  carregandoPerfis: boolean;
  desabilitarSalvar: boolean;
  onAlterarBuscaCategoria: (_valor: string) => void;
  onAlterarDescricao: (_valor: string) => void;
  onAlterarPerfis: (_perfis: string[]) => void;
  onAlterarTitulo: (_valor: string) => void;
  onCancelar: () => void;
  onSalvar: (_evento: FormEvent<HTMLFormElement>) => void;
  onSelecionarCategoria: (_valor: string, _opcao: OpcaoCategoria) => void;
  opcoesPerfisAcesso: OpcaoPerfilAcesso[];
  textoBotaoSalvar: string;
  valores: ValoresFormularioDuvida;
}

const FormularioDuvidaFrequente = ({
  categorias,
  carregandoCategorias,
  carregandoPerfis,
  desabilitarSalvar,
  onAlterarBuscaCategoria,
  onAlterarDescricao,
  onAlterarPerfis,
  onAlterarTitulo,
  onCancelar,
  onSalvar,
  onSelecionarCategoria,
  opcoesPerfisAcesso,
  textoBotaoSalvar,
  valores,
}: FormularioDuvidaFrequenteProps) => (
  <div className="cadastro-duvidas-frequentes">
    <form
      className="formulario-cadastro-duvidas-frequentes"
      onSubmit={onSalvar}
    >
      <div className="linha-formulario">
        <SeletorCategorias
          buscaCategoria={valores.buscaCategoria}
          categorias={categorias}
          carregandoCategorias={carregandoCategorias}
          onBuscaCategoriaChange={onAlterarBuscaCategoria}
          onCategoriaSelect={onSelecionarCategoria}
        />

        <CamposAcesso
          categoriaSelecionada={Boolean(valores.categoria)}
          carregandoPerfis={carregandoPerfis}
          onPerfisChange={onAlterarPerfis}
          opcoesPerfisAcesso={opcoesPerfisAcesso}
          perfisAcesso={valores.perfisAcesso}
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
            value: valores.titulo,
            onChange: (evento: React.ChangeEvent<HTMLInputElement>) =>
              onAlterarTitulo(evento.target.value),
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
            value: valores.descricaoDetalhada,
            onChange: onAlterarDescricao,
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
          onClick={onCancelar}
        />

        <Botao
          texto={textoBotaoSalvar}
          type={BUTTON_TYPE.SUBMIT}
          style={BUTTON_STYLE.GREEN}
          disabled={desabilitarSalvar}
        />
      </div>
    </form>
  </div>
);

export default FormularioDuvidaFrequente;
