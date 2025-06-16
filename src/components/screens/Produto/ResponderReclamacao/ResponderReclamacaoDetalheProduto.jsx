import React, { useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import DetalheDoProduto from "src/components/Shareable/DetalheDoProduto";
import { getHomologacaoProduto } from "../../../../services/produto.service";
import ModalResponderReclamacao from "./ModalResponderReclamacao";
import { ordenaLogs, getQuestionamentoCodae } from "./helpers";

const ResponderReclamacaoDetalheProduto = () => {
  const [produto, setProduto] = useState(null);
  const [exibirModal, setExibirModal] = useState();
  const [uuid, setUuid] = useState();

  const navigate = useNavigate();

  const carregaHomologacao = useCallback(
    (_uuid) => {
      async function fetchData() {
        setProduto(null);
        setExibirModal(false);
        const response = await getHomologacaoProduto(_uuid || uuid);
        const _produto = response.data.results;
        const logOrdenado = ordenaLogs(_produto.ultima_homologacao.logs);
        _produto.logOrdenado = logOrdenado;
        setProduto(_produto);
      }
      fetchData();
    },
    [uuid]
  );

  useEffect(() => {
    async function fetchData() {
      const urlParams = new URLSearchParams(window.location.search);
      const uuid = urlParams.get("id");
      setUuid(uuid);
      carregaHomologacao(uuid);
    }
    fetchData();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={!produto}>
      <>
        <ModalResponderReclamacao
          showModal={exibirModal}
          closeModal={() => setExibirModal(false)}
          produto={produto || {}}
          idHomologacao={uuid}
          atualizarDados={() => {
            setProduto({ ...produto, respondido: true });
            setExibirModal(false);
          }}
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12 text-end">
                <Botao
                  className="me-3"
                  style={BUTTON_STYLE.BLUE}
                  texto="Voltar"
                  icon={BUTTON_ICON.ARROW_LEFT}
                  onClick={() => navigate(-1)}
                  type={BUTTON_TYPE.BUTTON}
                />
              </div>
            </div>
            {!!produto && (
              <>
                <DetalheDoProduto
                  produto={produto}
                  reclamacao={produto.ultima_homologacao.reclamacoes[0]}
                  questionamento={getQuestionamentoCodae(produto.logOrdenado)}
                />
                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      className="me-3"
                      style={BUTTON_STYLE.BLUE}
                      texto="Voltar"
                      icon={BUTTON_ICON.ARROW_LEFT}
                      onClick={() => navigate(-1)}
                      type={BUTTON_TYPE.BUTTON}
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
export default ResponderReclamacaoDetalheProduto;
