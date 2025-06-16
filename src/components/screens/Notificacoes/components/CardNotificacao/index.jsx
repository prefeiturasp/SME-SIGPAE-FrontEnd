import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { slugifyMin } from "../../../helper";
import { Checkbox } from "antd";
import Botao from "src/components/Shareable/Botao";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";

export default ({
  notificacao,
  handleChangeMarcarComoLida,
  clickBtnNotificacoes,
  toggleBtnNotificacoes,
  index,
}) => {
  const retornaClasseStatus = (notificacao) => {
    if (notificacao.tipo === "Pendência" && !notificacao.resolvido) {
      return "card-header-notificacao-pendente";
    } else if (notificacao.lido) {
      return "card-header-notificacao-lida";
    } else return "";
  };

  return (
    <div className="card mt-3" key={notificacao.uuid}>
      <div
        className={`card-header card-tipo-${slugifyMin(
          notificacao.tipo
        )} ${retornaClasseStatus(notificacao)}`}
        id={`heading_${notificacao.uuid}`}
      >
        <div className="row card-header-content">
          <div className="col-9">
            <div className="row">
              <div className="col-md-3 align-self-center">
                <span className={`span-tipo-${slugifyMin(notificacao.tipo)}`}>
                  {notificacao.tipo}
                </span>
              </div>
              <div className="col-md-9 ">
                <p className="mb-0 titulo-notificacao">
                  {notificacao.categoria}
                </p>
                <p className="mb-0">
                  <span className="remetente-categoria">
                    {notificacao.titulo}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-2 align-self-center text-end">
            <p className="mb-0">{notificacao.criado_em}</p>
          </div>
          <div className="col-1 align-self-center">
            <button
              onClick={() => toggleBtnNotificacoes(notificacao.uuid)}
              className="btn btn-link btn-block text-start px-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse_${notificacao.uuid}`}
              aria-expanded="true"
              aria-controls={`collapse_${notificacao.uuid}`}
            >
              <span className="span-icone-toogle">
                <i
                  className={
                    clickBtnNotificacoes[notificacao.uuid]
                      ? "fas fa-chevron-up"
                      : "fas fa-chevron-down"
                  }
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id={`collapse_${notificacao.uuid}`}
        className="collapse"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionNotificacoes"
      >
        <div className="card-body">
          <div className="row">
            <div
              className="col-12 descricao-notificacao"
              dangerouslySetInnerHTML={{
                __html: notificacao.descricao,
              }}
            />
          </div>
          <div className="row acoes-notificacoes">
            <div className="checkbox-container">
              {notificacao.tipo !== "Pendência" && (
                <Checkbox
                  defaultChecked={notificacao.lido}
                  style={{
                    fontSize: "16px",
                    paddingTop: "10px",
                    paddingLeft: "12px",
                  }}
                  onChange={() => {
                    handleChangeMarcarComoLida(notificacao, index);
                  }}
                >
                  Marcar como lida
                </Checkbox>
              )}
            </div>
            {notificacao.link && (
              <Link to={notificacao.link}>
                <Botao
                  texto="Acesse Aqui"
                  className="general-button"
                  icon="fas fa-arrow-right"
                  iconPosition="right"
                  style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
