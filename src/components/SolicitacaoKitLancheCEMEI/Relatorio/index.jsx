import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { CorpoRelatorio } from "./components/CorpoRelatorio";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { getSolicitacaoKitLancheCEMEI } from "src/services/kitLanche";
import "./style.scss";
import { SolicitacaoAlimentacaoContext } from "src/context/SolicitacaoAlimentacao";
import { deepCopy } from "src/helpers/utilities";

export const Relatorio = ({ ...props }) => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [solicitacoesSimilares, setSolicitacoesSimilares] = useState([]);

  const solicitacaoAlimentacaoContext = useContext(
    SolicitacaoAlimentacaoContext
  );

  const fetchData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      const response = await getSolicitacaoKitLancheCEMEI(uuid);
      if (response.status === HTTP_STATUS.OK) {
        solicitacaoAlimentacaoContext.updateSolicitacaoAlimentacao(
          response.data
        );
        let _response = deepCopy(response.data);
        let solicitacoes_similares = _response.solicitacoes_similares.map(
          (s) => {
            s["collapsed"] = true;
            return s;
          }
        );
        setSolicitacoesSimilares(solicitacoes_similares);
      } else {
        setErro(true);
      }
    }
    setCarregando(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const solicitacao = solicitacaoAlimentacaoContext.solicitacaoAlimentacao;

  const REQUISICOES_CONCLUIDAS = solicitacao;

  return erro ? (
    <div>Erro ao carregar informações. Tente novamente mais tarde.</div>
  ) : (
    <Spin tip="Carregando..." spinning={carregando}>
      {REQUISICOES_CONCLUIDAS && (
        <>
          <div className="row">
            <div className="col-6">
              <p className="page-title mt-0 pt-2">{`Kit Lanche Passeio - Solicitação # ${
                solicitacao ? solicitacao.id_externo : ""
              }`}</p>
            </div>
            <div className="col-6">
              <Botao
                type={BUTTON_TYPE.BUTTON}
                texto="Voltar"
                style={BUTTON_STYLE.GREEN_OUTLINE}
                icon={BUTTON_ICON.ARROW_LEFT}
                onClick={() => navigate("/painel-gestao-alimentacao")}
                className="float-end"
              />
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              {solicitacao && (
                <CorpoRelatorio
                  solicitacaoKitLancheCEMEI={solicitacao}
                  solicitacoesSimilares={solicitacoesSimilares}
                  setSolicitacoesSimilares={setSolicitacoesSimilares}
                  fetchData={fetchData}
                  {...props}
                />
              )}
            </div>
          </div>
        </>
      )}
    </Spin>
  );
};
