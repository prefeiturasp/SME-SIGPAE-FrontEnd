import React from "react";
import "./style.scss";

interface CategoriaDuvida {
  nome: string;
}

interface PerfilDuvida {
  nome?: string;
}

export interface DuvidaFrequente {
  categoria: CategoriaDuvida | string;
  pergunta: string;
  perfis?: Array<PerfilDuvida | string>;
  todos_os_perfis?: boolean;
  uuid: string;
}

interface TabelaDuvidasFrequentesProps {
  duvidas: DuvidaFrequente[];
  aoEditar: (_duvida: DuvidaFrequente) => void;
}

const obterNomeCategoria = (categoria: CategoriaDuvida | string) =>
  typeof categoria === "string" ? categoria : categoria?.nome;

const obterPerfis = (duvida: DuvidaFrequente) => {
  if (duvida.todos_os_perfis) return "TODOS";

  return (
    duvida.perfis
      ?.map((perfil) => (typeof perfil === "string" ? perfil : perfil.nome))
      .filter(Boolean)
      .join("; ") || "--"
  );
};

const TabelaDuvidasFrequentes = ({
  duvidas,
  aoEditar,
}: TabelaDuvidasFrequentesProps) => (
  <div className="tabela-duvidas-frequentes">
    <div className="container-tabela-duvidas">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Perfis de acesso</th>
            <th className="coluna-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {duvidas.map((duvida) => (
            <tr key={duvida.uuid}>
              <td>{duvida.pergunta}</td>
              <td>{obterNomeCategoria(duvida.categoria)}</td>
              <td>{obterPerfis(duvida)}</td>
              <td className="coluna-acoes">
                <div className="acoes-duvida">
                  <button
                    type="button"
                    className="botao-acao"
                    title="Editar"
                    aria-label={`Editar dúvida ${duvida.pergunta}`}
                    onClick={() => aoEditar(duvida)}
                  >
                    <i className="fas fa-edit" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TabelaDuvidasFrequentes;
