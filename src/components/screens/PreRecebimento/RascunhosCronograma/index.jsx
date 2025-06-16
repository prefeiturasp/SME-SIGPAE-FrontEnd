import React from "react";
import { Spin } from "antd";
import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRO_CRONOGRAMA,
  EDITAR,
  PRE_RECEBIMENTO,
} from "src/configs/constants";

export default ({ listaRascunhos }) => {
  const so_data = (data) => {
    if (data) {
      return data.slice(0, 10);
    }
  };
  const so_hora = (hora) => {
    if (hora) {
      return hora.slice(11, 16);
    }
  };
  return (
    <>
      {listaRascunhos && listaRascunhos.length > 0 && (
        <Spin tip="Carregando..." spinning={!listaRascunhos}>
          <div className="card mt-3">
            <div className="card-body body-rascunho">
              <span className="titulo-rascunho">Rascunhos</span>
              <div className="tabela-rascunho">
                {listaRascunhos.map((rascunho, idx) => {
                  return (
                    <div key={idx} className="row row-rascunho">
                      <div className="col-5 numero-rascunho">{`Cronograma #${rascunho.numero}`}</div>
                      <div className="col-7 data-rascunho ">
                        {`Rascunho salvo em ${so_data(
                          rascunho.alterado_em
                        )} às ${so_hora(rascunho.alterado_em)}`}

                        <NavLink
                          to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}/${EDITAR}?uuid=${rascunho.uuid}`}
                        >
                          <span className="icon-editar-rascunho">
                            <i title="Editar" className="fas fa-edit" />
                          </span>
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Spin>
      )}
    </>
  );
};
