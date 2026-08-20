import React from "react";
import TabelaListagem, {
  ColunaTabelaListagem,
} from "src/components/Shareable/TabelaListagem";
import { LinhaDuvidaFrequente } from "./interfaces";

interface TabelaDuvidasFrequentesProps {
  duvidas: LinhaDuvidaFrequente[];
  aoEditar: (_duvida: LinhaDuvidaFrequente) => void;
}

const TabelaDuvidasFrequentes = ({
  duvidas,
  aoEditar,
}: TabelaDuvidasFrequentesProps) => {
  const colunas: ColunaTabelaListagem<LinhaDuvidaFrequente>[] = [
    {
      chave: "titulo",
      titulo: "Título",
      renderizar: (duvida) => duvida.titulo,
    },
    {
      chave: "categoria",
      titulo: "Categoria",
      renderizar: (duvida) => duvida.categoria,
    },
    {
      chave: "perfis",
      titulo: "Perfis de acesso",
      renderizar: (duvida) => duvida.perfis,
    },
    {
      chave: "acoes",
      titulo: "Ações",
      classe: "tabela-listagem__coluna-acoes",
      largura: "72px",
      renderizar: (duvida) => (
        <div className="tabela-listagem__acoes">
          <button
            type="button"
            className="tabela-listagem__botao-acao"
            title="Editar"
            aria-label={`Editar dúvida ${duvida.titulo}`}
            onClick={() => aoEditar(duvida)}
          >
            <i className="fas fa-edit" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="tabela-listagem__botao-acao"
            title="Excluir"
            aria-label={`Excluir dúvida ${duvida.titulo}`}
            disabled
          >
            <i className="fas fa-trash" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <TabelaListagem
      colunas={colunas}
      dados={duvidas}
      larguraMinima="760px"
      obterChave={(duvida) => duvida.uuid}
    />
  );
};

export default TabelaDuvidasFrequentes;
