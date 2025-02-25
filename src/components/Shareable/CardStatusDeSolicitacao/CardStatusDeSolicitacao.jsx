import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./style.scss";
import { conferidaClass } from "helpers/terceirizadas";
import { GESTAO_PRODUTO_CARDS, TERCEIRIZADA } from "configs/constants";
import {
  ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS,
  TIPO_PERFIL,
} from "constants/shared";
import { Websocket } from "services/websocket";
import { Tooltip } from "antd";

export const CARD_TYPE_ENUM = {
  CANCELADO: "card-cancelled",
  INATIVO: "card-cancelled",
  PENDENTE: "card-pending",
  AUTORIZADO: "card-authorized",
  NEGADO: "card-denied",
  RECLAMACAO: "card-complained",
  AGUARDANDO_ANALISE_SENSORIAL: "card-awaiting-sensory",
  CORRECAO: "card-product-correction",
  AGUARDANDO_ANALISE_RECLAMACAO: "card-awaiting-complain",
  AGUARDANDO_CODAE: "card-waiting",
};

export const ICON_CARD_TYPE_ENUM = {
  CANCELADO: "fa-times-circle",
  INATIVO: "fa-times-circle",
  PENDENTE: "fa-exclamation-triangle",
  AUTORIZADO: "fa-check",
  NEGADO: "fa-ban",
  RECLAMACAO: "fa-bullhorn",
  AGUARDANDO_ANALISE_SENSORIAL: "fa-search",
  SUSPENSO: "fa-hand-paper",
  CORRECAO: "fa-pencil-alt",
  AGUARDANDO_ANALISE_RECLAMACAO: "fa-history",
};

export const CardStatusDeSolicitacao = (props) => {
  const {
    cardTitle,
    cardType,
    solicitations,
    icon,
    href,
    loading,
    hrefCard,
    dataTestId,
  } = props;

  const [dietasAbertas, setDietasAbertas] = useState([]);
  const [filteredSolicitations, setFilteredSolicitations] = useState(undefined);

  const nomeUsuario = localStorage.getItem("nome");
  const tipoPerfil = localStorage.getItem("tipo_perfil");

  let navigate = useNavigate();

  const initSocket = () => {
    return new Websocket(
      "solicitacoes-abertas/",
      ({ data }) => {
        getDietasEspeciaisAbertas(JSON.parse(data));
      },
      () => initSocket()
    );
  };

  const getDietasEspeciaisAbertas = (content) => {
    content && setDietasAbertas(content.message);
  };

  useEffect(() => {
    cardTitle.toString().includes("Recebidas") &&
      tipoPerfil === TIPO_PERFIL.DIETA_ESPECIAL &&
      initSocket();

    if (cardTitle === GESTAO_PRODUTO_CARDS.RESPONDER_QUESTIONAMENTOS_DA_CODAE) {
      if (tipoPerfil === `"${TERCEIRIZADA}"`) {
        setFilteredSolicitations(
          solicitations.filter(
            (solicitation) =>
              ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_PEDIU_ANALISE_RECLAMACAO.toUpperCase() ===
              solicitation.status
          )
        );
      } else if (tipoPerfil === TIPO_PERFIL.SUPERVISAO_NUTRICAO) {
        setFilteredSolicitations(
          solicitations.filter(
            (solicitation) =>
              ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_QUESTIONOU_NUTRISUPERVISOR.toUpperCase() ===
              solicitation.status
          )
        );
      } else {
        setFilteredSolicitations(
          solicitations.filter(
            (solicitation) =>
              nomeUsuario ===
                `"${solicitation.nome_usuario_log_de_reclamacao}"` &&
              ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_QUESTIONOU_UE.toUpperCase() ===
                solicitation.status
          )
        );
      }
    } else {
      setFilteredSolicitations([]);
    }
  }, []);

  const dietasFiltradas = (solicitation) => {
    return dietasAbertas.filter((dieta) =>
      solicitation.link.includes(dieta.uuid_solicitacao)
    );
  };

  const qtdDietasAbertas = (solicitacao) => {
    return dietasFiltradas(solicitacao).length;
  };

  const renderSolicitations = (solicitations) => {
    return (
      filteredSolicitations &&
      solicitations.slice(0, 5).map((solicitation, key) => {
        let conferida = conferidaClass(solicitation, cardTitle);
        const text = (
          <span>
            Marca: {solicitation.marca},<br />
            Editais: {solicitation.editais}
          </span>
        );

        return (
          <NavLink
            to={solicitation.link}
            key={key}
            data-cy={`${cardType}-${key}`}
          >
            <p className={`data ${conferida}`}>
              {[
                GESTAO_PRODUTO_CARDS.HOMOLOGADOS,
                GESTAO_PRODUTO_CARDS.PRODUTOS_SUSPENSOS,
              ].includes(cardTitle) ? (
                <Tooltip
                  color="#42474a"
                  overlayStyle={{
                    maxWidth: "320px",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                  title={text}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {solicitation.text}
                  </span>
                </Tooltip>
              ) : (
                solicitation.text
              )}
              <span className="float-end">{solicitation.date}</span>
              {tipoPerfil === TIPO_PERFIL.DIETA_ESPECIAL &&
                qtdDietasAbertas(solicitation) > 0 && (
                  <Tooltip
                    color="#686868"
                    overlayStyle={{
                      maxWidth: "140px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                    title="Usuários visualizando simultaneamente"
                  >
                    <span
                      className={`me-3 dietas-abertas float-end ${
                        qtdDietasAbertas(solicitation) > 9 && "qtd-dois-digitos"
                      }`}
                    >
                      {cardTitle.toString().includes("Recebidas") &&
                        `${qtdDietasAbertas(solicitation)}`}
                    </span>
                  </Tooltip>
                )}
            </p>
          </NavLink>
        );
      })
    );
  };

  const renderVerMais = (solicitations) => {
    return (
      filteredSolicitations &&
      solicitations.length > 5 && (
        <div className="container-link">
          <NavLink
            to={`${href}`}
            className="see-more"
            data-cy={`ver-mais-${cardType}`}
          >
            Ver Mais
          </NavLink>
        </div>
      )
    );
  };

  return (
    <div
      className={`card card-panel card-colored ${cardType}`}
      data-testid={dataTestId}
    >
      <div
        className={`card-title-status ajuste-icones ${
          hrefCard ? "card-com-href" : undefined
        }`}
        onClick={() => hrefCard && navigate(hrefCard)}
      >
        <div>
          <i className={"fas " + icon} />
          {cardTitle}
        </div>
        {loading && (
          <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
        )}
        <span className="float-end my-auto">Data/Hora</span>
      </div>
      <hr />
      {cardTitle === GESTAO_PRODUTO_CARDS.RESPONDER_QUESTIONAMENTOS_DA_CODAE &&
      ![
        TIPO_PERFIL.DIRETORIA_REGIONAL,
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.NUTRICAO_MANIFESTACAO,
        TIPO_PERFIL.CODAE_GABINETE,
        TIPO_PERFIL.DINUTRE,
      ].includes(tipoPerfil)
        ? renderSolicitations(filteredSolicitations)
        : renderSolicitations(solicitations)}
      {cardTitle === GESTAO_PRODUTO_CARDS.RESPONDER_QUESTIONAMENTOS_DA_CODAE &&
      ![
        TIPO_PERFIL.DIRETORIA_REGIONAL,
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.NUTRICAO_MANIFESTACAO,
        TIPO_PERFIL.CODAE_GABINETE,
        TIPO_PERFIL.DINUTRE,
      ].includes(tipoPerfil)
        ? renderVerMais(filteredSolicitations)
        : renderVerMais(solicitations)}
    </div>
  );
};

export default CardStatusDeSolicitacao;
