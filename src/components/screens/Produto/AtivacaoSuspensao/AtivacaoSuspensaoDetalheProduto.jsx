import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS } from "src/constants/shared";
import Botao from "src/components/Shareable/Botao";
import DetalheDoProduto from "src/components/Shareable/DetalheDoProduto";
import { getHomologacaoProduto } from "../../../../services/produto.service";
import ModalAtivacaoSuspensaoProduto from "./ModalAtivacaoSuspensaoProduto";

const { CODAE_HOMOLOGADO, ESCOLA_OU_NUTRICIONISTA_RECLAMOU } =
  ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS;

const checaStatus = (obj) =>
  obj.status === CODAE_HOMOLOGADO.toUpperCase() ||
  obj.status === ESCOLA_OU_NUTRICIONISTA_RECLAMOU.toUpperCase();

const AtivacaoSuspensaoDetalheProduto = () => {
  const [produto, setProduto] = useState(null);
  const [ativo, setAtivo] = useState(false);
  const [acao, setAcao] = useState();
  const [uuid, setUuid] = useState();
  const [status, setStatus] = useState(null);
  const [suspenso, setEhSuspenso] = useState(false);

  const navigate = useNavigate();

  const carregaHomologacao = (uuid, suspenso = false) => {
    async function fetchData() {
      const response = await getHomologacaoProduto(uuid);
      setAtivo(checaStatus(response.data) && !suspenso);
      setProduto(response.data.produto);
      setStatus(response.data.status);
    }
    fetchData();
  };

  useEffect(() => {
    async function fetchData() {
      const urlParams = new URLSearchParams(window.location.search);
      const uuid = urlParams.get("id");
      const suspenso_param = urlParams.get("suspenso");
      setUuid(uuid);
      setEhSuspenso(suspenso_param);
      carregaHomologacao(uuid, suspenso_param);
    }
    fetchData();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={!produto}>
      <>
        <ModalAtivacaoSuspensaoProduto
          showModal={!!acao}
          closeModal={() => setAcao()}
          acao={acao}
          produto={produto || {}}
          idHomologacao={uuid}
          atualizarDados={() => carregaHomologacao(uuid, suspenso)}
          status={status}
          suspenso={suspenso}
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12 text-end">
                <Botao
                  className="me-3"
                  style={BUTTON_STYLE.GREEN}
                  texto="Voltar"
                  icon={BUTTON_ICON.ARROW_LEFT}
                  onClick={() => navigate(-1)}
                  type={BUTTON_TYPE.BUTTON}
                />
                <Botao
                  texto={"Ativar"}
                  className="me-3"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  disabled={ativo}
                  onClick={() => setAcao("ativação")}
                />
                <Botao
                  texto={"Suspender"}
                  className="me-3"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  disabled={!ativo}
                  onClick={() => setAcao("suspensão")}
                />
              </div>
            </div>
            {!!produto && (
              <>
                <DetalheDoProduto
                  produto={produto}
                  status={ativo ? "ativo" : "suspenso"}
                  suspenso={suspenso}
                />

                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      className="me-3"
                      style={BUTTON_STYLE.GREEN}
                      texto="Voltar"
                      icon={BUTTON_ICON.ARROW_LEFT}
                      onClick={() => navigate(-1)}
                      type={BUTTON_TYPE.BUTTON}
                    />
                    <Botao
                      texto={"Ativar"}
                      className="me-3"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      disabled={ativo}
                      onClick={() => setAcao("ativação")}
                    />
                    <Botao
                      texto={"Suspender"}
                      className="me-3"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      disabled={!ativo}
                      onClick={() => setAcao("suspensão")}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </Spin>
  );
};
export default AtivacaoSuspensaoDetalheProduto;
