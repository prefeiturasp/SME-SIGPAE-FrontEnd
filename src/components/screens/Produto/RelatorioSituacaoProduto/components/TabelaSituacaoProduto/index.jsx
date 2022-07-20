import React, { Fragment } from "react";

import { parseDataHoraBrToMoment } from "helpers/utilities";

import "./style.scss";

export default ({ dadosRelatorio }) => {
  if (!dadosRelatorio) return false;
  return (
    <section className="tabela-situacao-produto">
      <div className="header-situacao-produto">
        <div>Nome do produto</div>
        <div>Marca do produto</div>
        <div>Data de cadastro</div>
        <div>Situação produto</div>
        <div>Data da situação</div>
      </div>
      {dadosRelatorio.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className="row-situacao-nome">
              <div>{item.nome}</div>
              <div>{item.marca.nome}</div>
              <div>
                {parseDataHoraBrToMoment(item.criado_em).format("DD/MM/YYYY")}
              </div>
              <div>{item.ultima_homologacao.status_titulo}</div>
              <div>
                {parseDataHoraBrToMoment(
                  item.ultima_homologacao.ultimo_log.criado_em
                ).format("DD/MM/YYYY")}
              </div>
            </div>
            <div className="row-situacao-card">
              <div className="row-situacao-status">
                <div className="status-flex-container">
                  <div>Nome do fabricante</div>
                  <div>{item.fabricante.nome}</div>
                </div>
                <div className="status-flex-container">
                  <div>Dieta especial</div>
                  <div>
                    {item.eh_para_alunos_com_dieta ? "Sim" : "Não"}
                  </div>{" "}
                </div>
                <div className="status-flex-container">
                  <div>Aditivos alergênicos</div>
                  <div>
                    {item.tem_aditivos_alergenicos ? "Sim" : "Não"}
                  </div>{" "}
                </div>
              </div>
              {item.ultima_homologacao.status === "CODAE_NAO_HOMOLOGADO" && (
                <div className="row-situacao-status pt-3">
                  <div className="status-flex-container">
                    <div>Motivo da recusa de Homologação</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.ultima_homologacao.justificativa
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        );
      })}
    </section>
  );
};
