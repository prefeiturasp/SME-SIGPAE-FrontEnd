import React, { useState } from "react";
import { Tooltip } from "antd";
import { FormOutlined, DeleteFilled } from "@ant-design/icons";

import { ModalEditarEmail } from "../ModalEditarEmail";
import { ModalExcluirEmail } from "../ModalExcluirEmail";
import {
  deleteEmailsTerceirizadasPorModulo,
  updateEmailsTerceirizadasPorModulo,
} from "src/services/terceirizada.service";
import "./styles.scss";

export default ({
  empresas,
  terceirizadas,
  ativos,
  setAtivos,
  modulo,
  buscarTerceirizadas,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [terceirizada, setTerceirizada] = useState(null);
  const [emailDict, setEmailDict] = useState(null);

  return (
    <section className="resultado-busca-emails-terceirizadas">
      <article>
        <div className="grid-table header-table">
          <div>Empresas e E-mails Cadastrados no Módulo de {modulo}</div>
        </div>
        {terceirizadas.map((terceirizada) => {
          const bordas =
            ativos && ativos.includes(terceirizada.uuid)
              ? "desativar-borda"
              : "";
          const icone =
            ativos && ativos.includes(terceirizada.uuid)
              ? "minus-square"
              : "plus-square";
          return (
            <React.Fragment key={terceirizada.uuid}>
              <div className="grid-table body-table">
                <div className={`${bordas}`}>
                  <i
                    className={`far fa-${icone} expand icon-green mx-3`}
                    onClick={() => {
                      ativos && ativos.includes(terceirizada.uuid)
                        ? setAtivos(
                            ativos.filter((el) => el !== terceirizada.uuid)
                          )
                        : setAtivos(
                            ativos
                              ? [...ativos, terceirizada.uuid]
                              : [terceirizada.uuid]
                          );
                    }}
                  />
                  {terceirizada.razao_social}
                </div>
              </div>

              {ativos && ativos.includes(terceirizada.uuid) && (
                <>
                  {terceirizada.emails_terceirizadas.map((emailDict) => {
                    return (
                      emailDict.modulo === modulo && (
                        <div
                          key={emailDict.uuid}
                          className="grid-table body-table hand-cursor"
                        >
                          <div className="col-12 row-email-icons">
                            <span className="ms-5 col-10 email">
                              {emailDict.email}
                            </span>
                            <span className="icons">
                              <Tooltip title="Editar e-mail">
                                <FormOutlined
                                  className="ms-5 me-3"
                                  onClick={() => {
                                    setShowModal(true);
                                    setTerceirizada(terceirizada);
                                    setEmailDict(emailDict);
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="Excluir e-mail">
                                <DeleteFilled
                                  onClick={() => {
                                    setShowModalExcluir(true);
                                    setEmailDict(emailDict);
                                  }}
                                />
                              </Tooltip>
                            </span>
                          </div>
                        </div>
                      )
                    );
                  })}
                </>
              )}
            </React.Fragment>
          );
        })}
      </article>
      <ModalEditarEmail
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        titulo={"Editar E-mail"}
        tituloBotaoCorfirma={"Salvar"}
        empresas={empresas}
        terceirizada={terceirizada}
        emailDict={emailDict}
        endpoint={updateEmailsTerceirizadasPorModulo}
        buscarTerceirizadas={buscarTerceirizadas}
      />
      <ModalExcluirEmail
        showModal={showModalExcluir}
        closeModal={() => setShowModalExcluir(false)}
        modulo={modulo}
        emailDict={emailDict}
        endpoint={deleteEmailsTerceirizadasPorModulo}
        buscarTerceirizadas={buscarTerceirizadas}
      />
    </section>
  );
};
