import React from "react";
import { MultiSelect } from "src/components/Shareable/MultiSelect";

interface OpcaoPerfilAcesso {
  label: string;
  value: string;
}

interface CamposAcessoProps {
  categoriaSelecionada: boolean;
  carregandoPerfis: boolean;
  onPerfisChange: (_perfis: string[]) => void;
  opcoesPerfisAcesso: OpcaoPerfilAcesso[];
  perfisAcesso: string[];
}

const CamposAcesso = ({
  categoriaSelecionada,
  carregandoPerfis,
  onPerfisChange,
  opcoesPerfisAcesso,
  perfisAcesso,
}: CamposAcessoProps) => (
  <div className="campo-formulario">
    <MultiSelect
      label="Perfis de Acesso"
      name="perfisAcesso"
      required
      options={opcoesPerfisAcesso}
      selected={perfisAcesso}
      onSelectedChange={onPerfisChange}
      disabled={!categoriaSelecionada || carregandoPerfis}
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
);

export default CamposAcesso;
