import React from "react";
import { Tooltip } from "antd";

import { truncarString } from "src/helpers/utilities";

import { FichaDeRecebimentoItemListagem } from "../../interfaces";

import "./styles.scss";

interface Props {
  objetos: FichaDeRecebimentoItemListagem[];
}

const TAMANHO_MAXIMO = 30;

const Listagem: React.FC<Props> = ({ objetos }) => {
  return (
    <div className="listagem-fichas-recebimento">
      <div className="titulo-verde mt-4 mb-3">Recebimentos Cadastrados</div>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Cronograma</div>
          <div>Nome do Produto</div>
          <div>Fornecedor</div>
          <div>Nº do Pregão / Chamada Pública</div>
          <div>Data do Recebimento</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_cronograma}</div>
                <div>
                  <Tooltip title={objeto.nome_produto}>
                    {truncarString(objeto.nome_produto, TAMANHO_MAXIMO)}
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title={objeto.fornecedor}>
                    {truncarString(objeto.fornecedor, TAMANHO_MAXIMO)}
                  </Tooltip>
                </div>
                <div>{objeto.pregao_chamada_publica}</div>
                <div>{objeto.data_recebimento}</div>
                <div>{objeto.status}</div>
                <div>
                  <span className="link-acoes px-1">
                    <i title="Detalhar" className="fas fa-eye green" />
                  </span>
                  <span className="link-acoes px-1">
                    <i title="Imprimir" className="fas fa-print green" />
                  </span>
                  <span className="link-acoes px-1">
                    <i title="Alterar" className="fas fa-edit green" />
                  </span>
                </div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
