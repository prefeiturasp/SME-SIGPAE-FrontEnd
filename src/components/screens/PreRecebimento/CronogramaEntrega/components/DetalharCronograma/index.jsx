import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Spin } from "antd";
import {
  getCronogramaDetalhar,
  imprimirCronograma,
} from "src/services/cronograma.service";
import AcoesDetalhar from "../AcoesDetalhar";
import AcoesDetalharAbastecimento from "../AcoesDetalharAbastecimento";
import AcoesDetalharDilogDiretoria from "../AcoesDetalharDilogDiretoria";
import {
  usuarioEhEmpresaFornecedor,
  usuarioEhDilogDiretoria,
  usuarioEhDilogAbastecimento,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import "./styles.scss";
import DadosCronograma from "../DadosCronograma";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";

const TIPO_CARGA_MAP = {
  PALETIZADA: "Paletizada",
  ESTIVADA_BATIDA: "Estivada/Batida",
};

export default () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const [cronograma, setCronograma] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const esconderLogFornecedor = (logs) => {
    return logs.filter(
      (log) =>
        !["Assinado Abastecimento"].includes(log.status_evento_explicacao)
    );
  };

  const getDetalhes = async () => {
    if (uuid) {
      let responseCronograma = await getCronogramaDetalhar(uuid);
      if (responseCronograma.status === HTTP_STATUS.OK) {
        if (usuarioEhEmpresaFornecedor()) {
          responseCronograma.data.logs = esconderLogFornecedor(
            responseCronograma.data.logs
          );
        }
        setCronograma(responseCronograma.data);
      }
    }
  };

  const baixarPDFCronograma = () => {
    setCarregando(true);
    let uuid = cronograma.uuid;
    let numero = cronograma.numero;
    imprimirCronograma(uuid, numero)
      .then(() => {
        setCarregando(false);
      })
      .catch((error) => {
        error.response.data.text().then((text) => toastError(text));
        setCarregando(false);
      });
  };

  const botaoImprimir = cronograma &&
    cronograma.status === "Assinado CODAE" && (
      <Botao
        texto="Baixar PDF Cronograma"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN_OUTLINE}
        className="float-end ms-3"
        onClick={() => baixarPDFCronograma()}
      />
    );

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(-1);
  };

  useEffect(() => {
    getDetalhes();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={!cronograma || carregando}>
      <div className="card mt-3 card-detalhar-cronograma">
        <div className="card-body">
          {cronograma && (
            <>
              {cronograma.logs && (
                <>
                  <div className="row pb-3">
                    <p className="head-green mt-3 mb-5">Status do Cronograma</p>
                    <FluxoDeStatusPreRecebimento
                      listaDeStatus={cronograma.logs}
                      itensClicaveisCronograma
                    />
                  </div>
                  <hr className="hr-detalhar" />
                </>
              )}

              <DadosCronograma cronograma={cronograma} />

              <hr className="hr-detalhar" />

              <div className="row mt-3">
                <div className="col">
                  <p className="head-green">Dados do Recebimento</p>
                </div>
              </div>

              {cronograma.programacoes_de_recebimento.length > 0 &&
                cronograma.programacoes_de_recebimento
                  .reverse()
                  .map((programacao, key) => {
                    return (
                      <div key={key} className="row mb-3">
                        <div className="col-3">
                          <p>Data Programada:</p>
                          <p>
                            <b>{programacao.data_programada}</b>
                          </p>
                        </div>
                        <div className="col-3">
                          <p>Tipo de Carga:</p>
                          <p>
                            <b>{TIPO_CARGA_MAP[programacao.tipo_carga]}</b>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              {cronograma?.observacoes && (
                <>
                  <hr className="hr-detalhar" />

                  <div className="row mt-3">
                    <div className="col">
                      <p className="head-green">Observações</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-12">
                      <p>{cronograma.observacoes}</p>
                    </div>
                  </div>
                </>
              )}

              <br />
              <div className="mt-4 mb-4">
                {usuarioEhDilogAbastecimento() && (
                  <AcoesDetalharAbastecimento cronograma={cronograma} />
                )}
                {usuarioEhEmpresaFornecedor() && (
                  <AcoesDetalhar cronograma={cronograma} />
                )}
                {usuarioEhDilogDiretoria() && (
                  <AcoesDetalharDilogDiretoria cronograma={cronograma} />
                )}
                <Botao
                  texto="Voltar"
                  dataTestId="voltar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-end ms-3"
                  onClick={() => handleBack()}
                />
                {botaoImprimir}
              </div>
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
