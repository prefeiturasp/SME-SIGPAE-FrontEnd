import React from "react";

import "./styles.scss";
import { REGISTRAR_INSUCESSO, LOGISTICA } from "src/configs/constants";
import { NavLink } from "react-router-dom";
import { Tooltip } from "antd";

const ListagemGuias = ({ guias, ativos, setAtivos }) => {
  const isDisabled = (guia) => {
    if (
      guia.situacao === "ARQUIVADA" ||
      guia.status !== "Pendente de conferência" ||
      guia.status_requisicao !== "DISTRIBUIDOR_CONFIRMA"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const validaLink = (desabilitar, event) => {
    if (desabilitar) {
      event.preventDefault();
    }
  };

  return (
    <section className="resultado-insucesso-entrega">
      <header>Registros de Insucesso</header>
      <article>
        <div className="grid-table header-table">
          <div>N° da Guia</div>
          <div>N° da Requisição</div>
          <div>Nome da U.E. </div>
          <div>Data de entrega</div>
          <div>Status</div>
          <div>Registrar Insucesso de Entrega</div>
          <div />
        </div>
        {guias.map((guia) => {
          const bordas =
            ativos && ativos.includes(guia.uuid) ? "desativar-borda" : "";
          const icone = ativos && ativos.includes(guia.uuid) ? "minus" : "plus";
          const desabilitar = isDisabled(guia);
          return (
            <>
              <div key={guia.uuid} className="grid-table body-table">
                <div className={`${bordas}`}>{guia.numero_guia}</div>
                <div className={`${bordas}`}>{guia.numero_requisicao}</div>
                <div className={`${bordas}`}>{guia.nome_unidade}</div>
                <div className={`${bordas}`}>{guia.data_entrega}</div>
                <div className={`${bordas}`}>{guia.status}</div>
                <div className={`${bordas}`}>
                  <Tooltip
                    title={
                      desabilitar
                        ? `Botão habilitado apenas para Guias de Remessa com status de "Pendente".`
                        : ""
                    }
                  >
                    <span>
                      <NavLink
                        className="float-start"
                        to={`/${LOGISTICA}/${REGISTRAR_INSUCESSO}?uuid=${guia.uuid}`}
                        onClick={(event) => validaLink(desabilitar, event)}
                        disabled={desabilitar}
                      >
                        <span
                          className={
                            desabilitar
                              ? "link-insucesso-desativado"
                              : "link-insucesso"
                          }
                        >
                          <i className="fas fa-thumbs-down" /> Insucesso de
                          Entrega
                        </span>
                      </NavLink>
                    </span>
                  </Tooltip>
                </div>
                <div className={`${bordas}`}>
                  <i
                    className={`fas fa-${icone}`}
                    onClick={() => {
                      ativos && ativos.includes(guia.uuid)
                        ? setAtivos(ativos.filter((el) => el !== guia.uuid))
                        : setAtivos(
                            ativos ? [...ativos, guia.uuid] : [guia.uuid]
                          );
                    }}
                  />
                </div>
              </div>
              {ativos && ativos.includes(guia.uuid) && (
                <>
                  <section className="resultado-busca-detalhe pb-3">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-md-10 justify-content-center align-self-center">
                          <span>
                            {" "}
                            N° da guia: <b>{guia.numero_guia}</b>
                          </span>
                        </div>
                      </div>

                      <hr />

                      <div className="row">
                        <div className="col">
                          <b>Cód. CODAE U.E</b>
                          <br />
                          {guia.codigo_unidade}
                        </div>
                        <div className="col border-start">
                          <b>Nome Unidade Educacional</b>
                          <br />
                          {guia.nome_unidade}
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <b>Endereço</b>
                          <br />
                          {guia.endereco_unidade}, {guia.numero_unidade} -{" "}
                          {guia.bairro_unidade} - CEP: {guia.cep_unidade} -{" "}
                          {guia.cidade_unidade} - {guia.estado_unidade}
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <b>Contato de entrega</b>
                          <br />
                          {guia.contato_unidade}
                        </div>
                        <div className="col border-start">
                          <b>Telefone</b>
                          <br />
                          {guia.telefone_unidade}
                        </div>
                      </div>

                      {guia.alimentos.map((alimento) => {
                        return (
                          <>
                            <div className="row mt-3">
                              <div className="col-2">
                                <b>Nome do produto</b>
                                <br />
                                {alimento.nome_alimento}
                              </div>

                              <div className={"col-2"}>
                                <b>Quantidade</b>
                                <br />
                                {alimento.embalagens[0].qtd_volume}
                              </div>
                              <div className="col">
                                <b>
                                  Embalagem{" "}
                                  {alimento.embalagens[0].tipo_embalagem}
                                </b>
                                <br />
                                {alimento.embalagens[0].capacidade_completa}
                              </div>

                              {alimento.embalagens.length > 1 && (
                                <>
                                  <div className={"col-2 border-start"}>
                                    <b>Quantidade</b>
                                    <br />
                                    {alimento.embalagens[1].qtd_volume}
                                  </div>
                                  <div className="col">
                                    <b>
                                      Embalagem{" "}
                                      {alimento.embalagens[1].tipo_embalagem}
                                    </b>
                                    <br />
                                    {alimento.embalagens[1].capacidade_completa}
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemGuias;
