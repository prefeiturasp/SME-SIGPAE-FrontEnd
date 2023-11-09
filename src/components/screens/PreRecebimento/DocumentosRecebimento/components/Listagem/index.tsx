import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import "./styles.scss";
import { DocumentosRecebimento } from "interfaces/pre_recebimento.interface";
import {
  PRE_RECEBIMENTO,
  DETALHAR_DOCUMENTO_RECEBIMENTO,
} from "../../../../../../configs/constants";

interface Props {
  objetos: Array<DocumentosRecebimento>;
}

const Listagem: React.FC<Props> = ({ objetos }) => {
  const renderizarAcoes = (objeto: DocumentosRecebimento): ReactElement => {
    const botaoDetalharVerde = (
      <NavLink
        className="float-left"
        to={`/${PRE_RECEBIMENTO}/${DETALHAR_DOCUMENTO_RECEBIMENTO}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Detalhar" className="fas fa-eye green" />
        </span>
      </NavLink>
    );

    return (
      <>{objeto.status === "Enviado para Análise" && botaoDetalharVerde}</>
    );
  };

  return (
    <div className="listagem-documentos-recebimento">
      <div className="titulo-verde mt-4 mb-3">Documentos Cadastrados</div>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Cronograma</div>
          <div>Nº do Pregão/Chamada Pública</div>
          <div>Nome do Produto</div>
          <div>Data de Cadastro</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_cronograma}</div>
                <div>{objeto.pregao_chamada_publica}</div>
                <div>{objeto.nome_produto}</div>
                <div>{objeto.criado_em}</div>
                <div>{objeto.status}</div>
                <div>{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
