import React from "react";
import TabelaListagem, {
  ColunaTabelaListagem,
} from "src/components/Shareable/TabelaListagem";
import { OcorrenciaDiretorInterface } from "src/interfaces/imr.interface";
import "./style.scss";

interface TabelaOcorrenciasProps {
  ocorrencias: OcorrenciaDiretorInterface[];
}

const TabelaOcorrencias = ({ ocorrencias }: TabelaOcorrenciasProps) => {
  const colunas: ColunaTabelaListagem<OcorrenciaDiretorInterface>[] = [
    {
      chave: "data",
      titulo: "Data da Ocorrência",
      largura: "160px",
      renderizar: (ocorrencia) => ocorrencia.data,
    },
    {
      chave: "categoria",
      titulo: "Categoria",
      largura: "25%",
      renderizar: (ocorrencia) => ocorrencia.categoria.nome,
    },
    {
      chave: "ocorrencia",
      titulo: "Ocorrência",
      renderizar: (ocorrencia) => (
        <div>
          <strong>{ocorrencia.titulo}</strong>
          {ocorrencia.descricao && (
            <div className="tabela-ocorrencias__descricao mt-1">
              {ocorrencia.descricao}
            </div>
          )}
          {ocorrencia.respostas.map((resposta) => (
            <div
              className="tabela-ocorrencias__resposta mt-1"
              key={resposta.uuid}
            >
              {resposta.titulo}: {resposta.resposta}
            </div>
          ))}
        </div>
      ),
    },
    {
      chave: "acoes",
      titulo: "Ações",
      classe: "tabela-listagem__coluna-acoes",
      largura: "72px",
      renderizar: (ocorrencia) => (
        <div className="tabela-listagem__acoes">
          <button
            type="button"
            className="tabela-listagem__botao-acao"
            title="Edição indisponível"
            aria-label={`Editar ocorrência ${ocorrencia.titulo}`}
            disabled
          >
            <i className="fas fa-edit" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="tabela-ocorrencias">
      <TabelaListagem
        colunas={colunas}
        dados={ocorrencias}
        larguraMinima="760px"
        obterChave={(ocorrencia) =>
          `${ocorrencia.uuid}-${ocorrencia.tipo_ocorrencia}-${ocorrencia.grupo}`
        }
      />
    </div>
  );
};

export default TabelaOcorrencias;
