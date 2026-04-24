import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { getCronogramaSemanal } from "src/services/cronogramaSemanal.service";
import { CronogramaSemanalDetalhado } from "src/interfaces/cronograma_semanal.interface";
import { PRE_RECEBIMENTO, CRONOGRAMA_SEMANAL_FLV } from "src/configs/constants";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import { formataMilharDecimal } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import "./styles.scss";

const DetalharCronogramaSemanal: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const navigate = useNavigate();
  const [cronograma, setCronograma] =
    useState<CronogramaSemanalDetalhado | null>(null);
  const [carregando, setCarregando] = useState(false);

  const getDetalhes = async () => {
    if (uuid) {
      setCarregando(true);
      try {
        const response = await getCronogramaSemanal(uuid);
        if (response.status === HTTP_STATUS.OK) {
          setCronograma(response.data);
        }
      } catch {
        // Erro ao carregar cronograma semanal
      } finally {
        setCarregando(false);
      }
    }
  };

  useEffect(() => {
    getDetalhes();
  }, [uuid]);

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/${PRE_RECEBIMENTO}/${CRONOGRAMA_SEMANAL_FLV}`);
  };

  const getRotuloChamadaAta = () => {
    if (cronograma?.cronograma_mensal?.contrato?.numero_pregao) {
      return "Nº da Ata";
    }
    return "Nº da Chamada Pública";
  };

  return (
    <Spin tip="Carregando..." spinning={!cronograma || carregando}>
      <div className="card mt-3 card-detalhar-cronograma-semanal">
        <div className="card-body">
          {cronograma && (
            <div>
              {/* Status do Cronograma */}
              {cronograma.logs && cronograma.logs.length > 0 && (
                <>
                  <div className="row pb-3">
                    <div className="col-10">
                      <p className="head-green mt-3 mb-5">
                        Status do Cronograma
                      </p>
                    </div>
                    <div className="col-2 text-end">
                      <Botao
                        texto="Histórico"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="ms-3"
                        onClick={() => {}}
                        tooltipExterno="Funcionalidade em desenvolvimento"
                      />
                    </div>
                  </div>
                  <FluxoDeStatusPreRecebimento
                    listaDeStatus={cronograma.logs}
                  />
                  <hr className="hr-detalhar" />
                </>
              )}

              {/* Dados Gerais */}
              <div className="row my-3">
                <p className="head-green">Dados Gerais</p>
              </div>
              <div className="row detalhar-head">
                <div className="col-4">
                  <p>
                    <b>Nº do Cronograma Semanal:</b>
                  </p>
                  <p className="head-green">{cronograma.numero}</p>
                </div>
                <div className="col-4">
                  <p>
                    <b>{getRotuloChamadaAta()}:</b>
                  </p>
                  <p className="head-green">
                    {cronograma.cronograma_mensal.contrato?.ata ||
                      cronograma.cronograma_mensal.contrato
                        ?.numero_chamada_publica}
                  </p>
                </div>
                <div className="col-4">
                  <p>
                    <b>Nº do Contrato:</b>
                  </p>
                  <p className="head-green">
                    {cronograma.cronograma_mensal.contrato?.numero}
                  </p>
                </div>
              </div>
              <div className="row detalhar-head mt-4">
                <div className="col-4">
                  <p>
                    <b>Nº do Processo SEI - Contratos:</b>
                  </p>
                  <p className="head-green">
                    {cronograma.cronograma_mensal.contrato?.processo}
                  </p>
                </div>
              </div>

              <hr />

              <div className="row my-3">
                <p>Empresa Contratada:</p>
                <p>
                  <b>
                    {cronograma.cronograma_mensal.empresa?.nome_fantasia} /{" "}
                    {cronograma.cronograma_mensal.empresa?.razao_social}
                  </b>
                </p>
              </div>

              <hr />

              <div className="row my-3">
                <p>Produto:</p>
                <p>
                  <b>{cronograma.cronograma_mensal?.produto?.nome}</b>
                </p>
              </div>

              <hr />

              <div className="row my-3">
                <p>Local de Entrega:</p>
                <p>
                  <b>UNIDADE EDUCACIONAL DA RME - PONTO A PONTO</b>
                </p>
              </div>

              <hr />

              {/* Dados do Produto e Datas das Entregas */}
              <div className="row my-3">
                <p className="head-green">
                  Dados do Produto e Datas das Entregas
                </p>
              </div>

              <div className="row mb-4">
                <div className="col-4">
                  <p>Nº do Empenho:</p>
                  <p>
                    <b>{cronograma.cronograma_mensal.numero_empenho}</b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Quantidade Total do Empenho:</p>
                  <p>
                    <b>
                      {formataMilharDecimal(
                        cronograma.cronograma_mensal.qtd_total_empenho?.toString() ||
                          "0",
                      )}{" "}
                      {cronograma.cronograma_mensal.unidade_medida?.abreviacao}
                    </b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Custo Unitário do Produto:</p>
                  <p>
                    <b>
                      R${" "}
                      {formataMilharDecimal(
                        cronograma.cronograma_mensal.custo_unitario_produto?.toString() ||
                          "0",
                      )}
                    </b>
                  </p>
                </div>
              </div>

              {/* Tabela de Entregas Programadas */}
              <div className="row mb-4">
                <div className="col">
                  <table className="table tabela-dados-cronograma">
                    <thead className="head-crono">
                      <th className="borda-crono text-center">Quantidade</th>
                      <th className="borda-crono text-center">
                        Data Programada
                      </th>
                    </thead>
                    <tbody>
                      {cronograma.programacoes.map((programacao, key) => (
                        <tr key={key}>
                          <td className="borda-crono text-center">
                            {formataMilharDecimal(
                              programacao.quantidade.toString(),
                            )}{" "}
                            {
                              cronograma.cronograma_mensal.unidade_medida
                                ?.abreviacao
                            }
                          </td>
                          <td className="borda-crono text-center">
                            {programacao.data_inicio} a {programacao.data_fim}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <br />
              <div className="mt-4 mb-4">
                <Botao
                  texto="Baixar PDF"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-end ms-3"
                  onClick={() => {}}
                  tooltipExterno="Funcionalidade em desenvolvimento"
                />
                <Botao
                  texto="Voltar"
                  dataTestId="voltar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-end"
                  onClick={() => handleBack()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default DetalharCronogramaSemanal;
