import React from "react";
import { Tooltip } from "antd";

import { truncarString } from "src/helpers/utilities";
import { AjusteSaldoLaudoListagem } from "../../interfaces";

import { agruparMilharDecimalModificado } from "src/components/Shareable/Input/InputText/helpers";

import "./styles.scss";

interface Props {
  objetos: AjusteSaldoLaudoListagem[];
}

const TAMANHO_MAXIMO = 30;

const Listagem: React.FC<Props> = ({ objetos }) => {
  return (
    <div className="listagem-ajustes-saldo">
      <div className="titulo-verde mt-4 mb-3">Ajustes de Saldo Cadastrados</div>

      <article>
        {objetos.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            Nenhum resultado encontrado
          </div>
        ) : (
          <>
            <div className="grid-table header-table">
              <div>Nº do Cronograma</div>
              <div>Produto</div>
              <div>Fornecedor</div>
              <div>Nº do Laudo</div>
              <div>Quantidade a ser Descontada</div>
              <div>Ações</div>
            </div>

            {objetos.map((objeto) => {
              return (
                <div key={objeto.uuid} className="grid-table body-table">
                  <div>{objeto.numero_cronograma}</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <Tooltip title={objeto.produto}>
                      {truncarString(objeto.produto, TAMANHO_MAXIMO)}
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title={objeto.fornecedor}>
                      {truncarString(objeto.fornecedor, TAMANHO_MAXIMO)}
                    </Tooltip>
                  </div>
                  <div>{objeto.numero_laudo}</div>
                  <div>
                    {agruparMilharDecimalModificado(
                      objeto.quantidade_descontada,
                    )}{" "}
                    {objeto.unidade_medida}
                  </div>
                  <div> - </div>
                </div>
              );
            })}
          </>
        )}
      </article>
    </div>
  );
};

export default Listagem;
