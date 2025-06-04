import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import Botao from "../Botao";
import { BUTTON_STYLE } from "../Botao/constants";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { NOTIFICACOES } from "src/configs/constants";
import "./style.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";

export default () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [quantidade, setQuantidade] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const buscarNotificacoes = async () => {
    const params = gerarParametrosConsulta({ page_size: 4 });
    let notifsResponse = await getNotificacoes(params);
    let qtdResponse = await getQtdNaoLidas();
    setQuantidade(qtdResponse.data.quantidade_nao_lidos);
    setNotificacoes(notifsResponse.data.results);
  };

  const goToNotificacoes = (notificacao) => {
    let path = `/${NOTIFICACOES}/${
      notificacao ? `?uuid=${notificacao.uuid}` : ""
    }`;
    if (location.pathname.includes(`/${NOTIFICACOES}/`)) {
      navigate("/");
      setTimeout(() => navigate(path), 10);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const menu = (
    <div className="menu-notificacoes">
      <table className="table mb-0">
        <tbody>
          {notificacoes?.map((notificacao, index) => {
            return (
              <tr
                onClick={() => goToNotificacoes(notificacao)}
                key={index}
                className={`tr-notificacoes ${
                  notificacao.lido ? "lida" : "nao-lida"
                }`}
              >
                <td className="py-1 px-4 align-middle w-75">
                  {notificacao.titulo}
                </td>
                <td
                  className={`py-1 px-1 text-center w-25 align-middle status`}
                >
                  {notificacao.lido ? "Lida" : "Não Lida"}
                </td>
                <td className="py-1 px-2 align-middle w-25 text-end">
                  {notificacao.criado_em}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Botao
        texto="Ver todas"
        className="btn-block btn-notificacoes"
        style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
        onClick={() => goToNotificacoes()}
      />
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <div className="navbar-notificacoes">
        <div className="nav-link text-center">
          <div className="icone-verde-fundo">
            <i className="fas fa-bell icone-verde" />
            {quantidade > 0 && (
              <span className="span-notificacoes-menor-que-10">
                {quantidade}
              </span>
            )}
          </div>
        </div>
        <p className="title">Notificações</p>
      </div>
    </Dropdown>
  );
};
