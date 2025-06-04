import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import ModalHistoricoProtocoloPadrao from "src/components/Shareable/ModalHistoricoProtocoloPadrao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

export default ({ protocoloPadrao, idx, selecionado }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [historico, setHistorico] = useState([]);

  const visualizarModal = () => {
    setHistorico(protocoloPadrao.historico);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <tr className={selecionado === idx ? "" : "d-none"}>
        <td colSpan="4">
          <Botao
            texto="Histórico"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-end mt-3 mb-3 ms-3"
            onClick={visualizarModal}
          />
        </td>
      </tr>
      {historico && (
        <ModalHistoricoProtocoloPadrao
          visible={visible}
          onOk={handleCancel}
          onCancel={handleCancel}
          history={historico}
        />
      )}
      <tr className={selecionado === idx ? "" : "d-none"}>
        <td colSpan="4">
          <p className="data-title">Orientações Gerais</p>
          <div
            dangerouslySetInnerHTML={{
              __html: protocoloPadrao.orientacoes_gerais,
            }}
          />
        </td>
      </tr>
      <tr className={selecionado === idx ? "" : "d-none"}>
        <td colSpan="4">
          <p className="data-title">Lista de Substituições</p>
          <table className="table table-bordered table-alimentacao">
            <thead>
              <tr className="table-head-alimentacao">
                <th>Alimento</th>
                <th>Isenção/Substituição</th>
                <th>Alimento/Ingrediente</th>
              </tr>
            </thead>
            <tbody>
              {protocoloPadrao.substituicoes.map(
                (substituicao, idxSubstituição) => {
                  return (
                    <tr
                      key={idxSubstituição}
                      className="table-body-alimentacao"
                    >
                      <td>{substituicao.alimento.nome}</td>
                      <td>{substituicao.tipo}</td>
                      <td>
                        <ul>
                          {substituicao.alimentos_substitutos.map(
                            (alimento, idxAlimento) => {
                              return <li key={idxAlimento}>{alimento.nome}</li>;
                            }
                          )}
                          {substituicao.substitutos.map(
                            (alimento, idxAlimento) => {
                              return <li key={idxAlimento}>{alimento.nome}</li>;
                            }
                          )}
                        </ul>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </td>
      </tr>
      {protocoloPadrao && protocoloPadrao.outras_informacoes && (
        <tr className={selecionado === idx ? "" : "d-none"}>
          <td colSpan="4">
            <p className="data-title">Outras informações</p>
            <div
              dangerouslySetInnerHTML={{
                __html: protocoloPadrao.outras_informacoes,
              }}
            />
          </td>
        </tr>
      )}
      <tr className={selecionado === idx ? "" : "d-none"}>
        <td colSpan="4">
          <Botao
            texto="Criar cópia"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="float-end mt-3 mb-3 ms-3"
            onClick={() => {
              navigate(
                `/dieta-especial/protocolo-padrao/${protocoloPadrao.uuid}/criar-copia`
              );
            }}
          />
          <Botao
            texto="Editar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="float-end mt-3 mb-3 ms-3"
            onClick={() => {
              navigate(
                `/dieta-especial/protocolo-padrao/${protocoloPadrao.uuid}/editar`
              );
            }}
          />
        </td>
      </tr>
    </>
  );
};
