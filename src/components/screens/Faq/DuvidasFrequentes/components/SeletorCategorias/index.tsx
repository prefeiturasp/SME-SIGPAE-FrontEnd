import { AutoComplete, Input } from "antd";
import React from "react";
import "./style.scss";

export interface Categoria {
  nome: string;
  uuid: string;
}

export interface OpcaoCategoria {
  label: string;
  uuid: string;
  value: string;
}

interface SeletorCategoriasProps {
  buscaCategoria: string;
  categorias: Categoria[];
  carregandoCategorias: boolean;
  onBuscaCategoriaChange: (_valor: string) => void;
  onCategoriaSelect: (_valor: string, _opcao: OpcaoCategoria) => void;
}

const SeletorCategorias = ({
  buscaCategoria,
  categorias,
  carregandoCategorias,
  onBuscaCategoriaChange,
  onCategoriaSelect,
}: SeletorCategoriasProps) => {
  const opcoesCategorias: OpcaoCategoria[] = categorias.map((item) => ({
    value: item.nome,
    label: item.nome,
    uuid: item.uuid,
  }));

  return (
    <div className="campo-formulario seletor-categorias">
      <label htmlFor="categoria" className="col-form-label">
        <span className="required-asterisk">*</span>
        Categoria
      </label>

      <AutoComplete<OpcaoCategoria>
        id="categoria"
        className="autocomplete-select autocomplete-categoria"
        value={buscaCategoria}
        options={opcoesCategorias}
        onChange={onBuscaCategoriaChange}
        onSelect={onCategoriaSelect}
        filterOption={(textoDigitado, opcao) =>
          opcao?.label
            .toLocaleLowerCase("pt-BR")
            .includes(textoDigitado.toLocaleLowerCase("pt-BR")) ?? false
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
  );
};

export default SeletorCategorias;
