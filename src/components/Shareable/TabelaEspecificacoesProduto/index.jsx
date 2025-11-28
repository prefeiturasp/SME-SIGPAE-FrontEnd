import { Tooltip } from "antd";
import {
  RECLAMACAO_PRODUTO_STATUS_EXPLICACAO,
  TIPO_PERFIL,
} from "src/constants/shared";
import { truncarString } from "src/helpers/utilities";
import React, { Fragment } from "react";
import "./style.scss";

export const TabelaEspecificacoesProduto = (props) => {
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  const renderLabel =
    props.homologacao.ultimo_log.status_evento_explicacao ===
      RECLAMACAO_PRODUTO_STATUS_EXPLICACAO.AGUARDANDO_ANALISE_SENSORIAL &&
    tipoPerfil === TIPO_PERFIL.TERCEIRIZADA;
  return (
    props.especificacoes &&
    props.especificacoes.length > 0 && (
      <div className="row" data-testid="produto-tabela">
        <div className="col-12">
          {renderLabel ? (
            <label>Informações referentes ao volume e unidade de medida</label>
          ) : (
            <p>Informações referentes ao volume e unidade de medida</p>
          )}
        </div>
        <div className="col-12">
          <table className="table table-bordered table-especificacoes">
            <thead>
              <tr className="table-head-especificacoes">
                <th className="col-3">Volume</th>
                <th className="col-3">Unidade de Medida</th>
                <th className="col-6">Embalagem</th>
              </tr>
            </thead>
            <tbody>
              {props.especificacoes.map((item, idx) => {
                return (
                  <Fragment key={idx}>
                    <tr className="table-body-especificacoes">
                      <td>{item.volume}</td>
                      <td>{item.unidade_de_medida.nome}</td>
                      <td>
                        {item.embalagem_produto.nome.length > 40 ? (
                          <Tooltip title={item.embalagem_produto.nome}>
                            {truncarString(item.embalagem_produto.nome, 40)}
                          </Tooltip>
                        ) : (
                          item.embalagem_produto.nome
                        )}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default TabelaEspecificacoesProduto;
