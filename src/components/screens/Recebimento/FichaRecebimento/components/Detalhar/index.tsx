import "./styles.scss";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import {
  getFichaRecebimentoDetalhada,
  imprimirFichaRecebimento,
} from "src/services/fichaRecebimento.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  CronogramaFicha,
  EtapaFicha,
  FichaRecebimentoDetalhada,
  OcorrenciaFichaRecebimento,
  VeiculoPayload,
} from "../../interfaces";
import { getCronogramaPraCadastroRecebimento } from "src/services/cronograma.service";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import {
  formataData,
  formataMilhar,
  formataMilharDecimal,
} from "src/helpers/utilities";
import { NavLink } from "react-router-dom";
import { FICHA_RECEBIMENTO, RECEBIMENTO } from "src/configs/constants";

const COLLAPSES_FICHA_RECEBIMENTO = [
  "Dados do Cronograma de Entregas",
  "Etapas, Partes e Datas do Recebimento",
  "Laudos",
  "Veículos e Quantidade do Recebimento",
  "Conferência das Rotulagens",
  "Ocorrências",
  "Observações",
];

export default () => {
  const [carregando, setCarregando] = useState<boolean>(true);
  const [carregandoPdf, setCarregandoPdf] = useState<boolean>(false);
  const [fichaRecebimento, setFichaRecebimento] =
    useState<FichaRecebimentoDetalhada | null>(null);
  const [etapa, setEtapa] = useState<EtapaFicha | null>(null);
  const [dadosCronograma, setDadosCronograma] =
    useState<CronogramaFicha | null>(null);
  const [collapse, setCollapse] = useState<CollapseControl>({
    0: true,
  });

  const imprimirFicha = async () => {
    setCarregandoPdf(true);
    await imprimirFichaRecebimento(
      fichaRecebimento.uuid,
      fichaRecebimento.dados_cronograma.numero,
    );
    setCarregandoPdf(false);
  };

  const carregarFichaDeRecebimento = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (!uuid) return;

    try {
      setCarregando(true);
      const resposta = await getFichaRecebimentoDetalhada(uuid);
      if (resposta?.status === 200) {
        setFichaRecebimento(resposta.data);
        setEtapa(resposta.data.etapa);
        getCronogramaPraCadastroRecebimento(
          resposta.data.dados_cronograma.uuid,
        ).then((resp) => {
          if (resp?.status === 200) setDadosCronograma(resp?.data?.results);
          else toastError("Erro ao carregar dados do cronograma.");
        });
      } else toastError("Erro ao carregar ficha de recebimento.");
    } catch (error) {
      toastError("Erro ao carregar ficha de recebimento:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFichaDeRecebimento();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 detalhes-ficha">
        <div className="card-body">
          <div className="d-flex justify-content-between registro-info">
            <span>
              <strong>Data do Registro do Recebimento:</strong>{" "}
              {fichaRecebimento?.data_recebimento}
            </span>
            <span>
              <strong>Última modificação em:</strong>{" "}
              {formataData(
                fichaRecebimento?.alterado_em,
                "DD/MM/YYYY HH:mm:ss",
                "DD/MM/YYYY",
              )}
            </span>
          </div>
          {fichaRecebimento && (
            <div className="collapse-wrapper">
              <Collapse
                collapse={collapse}
                setCollapse={setCollapse}
                titulos={COLLAPSES_FICHA_RECEBIMENTO.map((titulo, index) => (
                  <span key={index}>{titulo}</span>
                ))}
                collapseConfigs={COLLAPSES_FICHA_RECEBIMENTO.map((titulo) => ({
                  titulo,
                  camposObrigatorios: false,
                }))}
                id="collapseFichaRecebimento"
              >
                {dadosCronograma && (
                  <section id="cronogramaEntregas">
                    <div className="linha-dupla">
                      <p>
                        Cronograma:{" "}
                        <strong>
                          {fichaRecebimento.dados_cronograma?.numero}
                        </strong>
                      </p>
                      <p>
                        Nº do Contrato:{" "}
                        <strong>{dadosCronograma?.contrato}</strong>
                      </p>
                    </div>
                    <p>
                      Nº da Ata/Chamada Pública:{" "}
                      <strong>{dadosCronograma?.ata}</strong>
                    </p>
                    <p>
                      Fornecedor: <strong>{dadosCronograma?.fornecedor}</strong>
                    </p>
                    <p>
                      Produto: <strong>{dadosCronograma?.produto}</strong>
                    </p>
                    <p>
                      Marca: <strong>{dadosCronograma?.marca}</strong>
                    </p>
                  </section>
                )}
                <section id="etapasPartesDatas">
                  <p>
                    Etapa/Parte do Recebimento:{" "}
                    <strong>
                      {etapa.etapa.toUpperCase()}{" "}
                      {etapa.parte ? `- ${etapa.parte.toUpperCase()}` : ""}
                    </strong>
                  </p>
                  <div className="linha-dupla">
                    <p>
                      Data Programada: <strong>{etapa.data_programada}</strong>
                    </p>
                    <p>
                      Data Entrega:{" "}
                      <strong>{fichaRecebimento.data_entrega}</strong>
                    </p>
                  </div>
                  <div className="linha-dupla">
                    <p>
                      Quantidade Programada: <strong>{etapa.quantidade}</strong>
                    </p>
                    <p>
                      Embalagens Programadas:{" "}
                      <strong>{etapa.total_embalagens}</strong>
                    </p>
                  </div>
                  <div className="linha-dupla">
                    <p>
                      Peso Embalagem Primária:{" "}
                      <strong>
                        {dadosCronograma?.peso_liquido_embalagem_primaria}
                      </strong>
                    </p>
                    <p>
                      Peso Embalagem Secundária:{" "}
                      <strong>
                        {dadosCronograma?.peso_liquido_embalagem_secundaria}
                      </strong>
                    </p>
                  </div>
                  <p>
                    Embalagem Primária:{" "}
                    <strong>{dadosCronograma?.embalagem_primaria}</strong>
                  </p>
                  <p>
                    Embalagem Secundária:{" "}
                    <strong>{dadosCronograma?.embalagem_secundaria}</strong>
                  </p>
                  {fichaRecebimento?.reposicao_cronograma && (
                    <>
                      <p>
                        Referente a ocorrência registrada nesta etapa, o
                        Fornecedor optou por:{" "}
                        <strong>
                          {fichaRecebimento?.reposicao_cronograma.descricao}
                        </strong>
                      </p>
                      {fichaRecebimento?.reposicao_cronograma?.tipo ===
                        "Credito" && (
                        <>
                          <p>
                            Observações:{" "}
                            <strong>{fichaRecebimento.observacao}</strong>
                          </p>
                          <div className="col-6">
                            {fichaRecebimento.arquivos.map(({ arquivo }) => (
                              <BotaoAnexo urlAnexo={arquivo} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </section>
                {fichaRecebimento?.reposicao_cronograma?.tipo !== "Credito" && (
                  <section id="laudos">
                    {
                      <table className="table tabela-dados-cronograma">
                        <thead className="head-crono">
                          <th className="borda-crono">N° do Laudo</th>
                          <th className="borda-crono">Lote(s) do Laudo</th>
                          <th className="borda-crono">Data(s) Fabricação</th>
                          <th className="borda-crono">Data(s) Validade</th>
                        </thead>
                        <tbody>
                          {dadosCronograma?.documentos_de_recebimento?.map(
                            (documento, key) => {
                              return (
                                <tr key={key}>
                                  <td className="borda-crono">
                                    {documento.numero_laudo}
                                  </td>
                                  <td className="borda-crono">
                                    {documento.numero_lote_laudo}
                                  </td>
                                  <td className="borda-crono">
                                    {documento.datas_fabricacao}
                                  </td>
                                  <td className="borda-crono">
                                    {documento.datas_validade}
                                  </td>
                                </tr>
                              );
                            },
                          )}
                        </tbody>
                      </table>
                    }
                    <p>
                      Lote(s) do Fabricante Observado(s):{" "}
                      <strong>
                        {fichaRecebimento.lote_fabricante_de_acordo
                          ? "DE ACORDO COM O LAUDO"
                          : "DIVERGÊNCIA"}
                      </strong>
                    </p>
                    {!fichaRecebimento.lote_fabricante_de_acordo && (
                      <p>
                        Descrição da Divergência Observada:{" "}
                        <strong>
                          {fichaRecebimento?.lote_fabricante_divergencia}
                        </strong>
                      </p>
                    )}
                    <hr />
                    <p>
                      Data(s) de Fabricação Observado(s):{" "}
                      <strong>
                        {fichaRecebimento.data_fabricacao_de_acordo
                          ? "DE ACORDO COM O LAUDO"
                          : "DIVERGÊNCIA"}
                      </strong>
                    </p>
                    {!fichaRecebimento.data_fabricacao_de_acordo && (
                      <p>
                        Descrição da Divergência Observada:{" "}
                        <strong>
                          {fichaRecebimento?.data_fabricacao_divergencia}
                        </strong>
                      </p>
                    )}
                    <hr />
                    <p>
                      Data(s) de Validade Obeservada(s):{" "}
                      <strong>
                        {fichaRecebimento.data_validade_de_acordo
                          ? "DE ACORDO COM O LAUDO"
                          : "DIVERGÊNCIA"}
                      </strong>
                    </p>
                    {!fichaRecebimento.data_validade_de_acordo && (
                      <p>
                        Descrição da Divergência Observada:{" "}
                        <strong>
                          {fichaRecebimento?.data_validade_divergencia}
                        </strong>
                      </p>
                    )}
                    <hr />
                    <div className="linha-dupla">
                      <p>
                        Nº Lote Armazenagem:{" "}
                        <strong>
                          {fichaRecebimento?.numero_lote_armazenagem}
                        </strong>
                      </p>
                      <p>
                        Nº de Paletes:{" "}
                        <strong>
                          {formataMilhar(fichaRecebimento?.numero_paletes)}
                        </strong>
                      </p>
                    </div>
                    <p>
                      Peso da Embalagem Primária:{" "}
                      <strong>
                        <span>
                          {formataMilharDecimal(
                            fichaRecebimento?.peso_embalagem_primaria_1,
                          )}
                          kg
                        </span>
                        <span>
                          {formataMilharDecimal(
                            fichaRecebimento?.peso_embalagem_primaria_2,
                          )}
                          kg
                        </span>
                        <span>
                          {formataMilharDecimal(
                            fichaRecebimento?.peso_embalagem_primaria_3,
                          )}
                          kg
                        </span>
                        <span>
                          {formataMilharDecimal(
                            fichaRecebimento?.peso_embalagem_primaria_4,
                          )}
                          kg
                        </span>
                      </strong>
                    </p>
                  </section>
                )}
                {fichaRecebimento?.reposicao_cronograma?.tipo !== "Credito" && (
                  <section id="veiculosQuantidadeRecebimento">
                    {fichaRecebimento.veiculos.map(
                      (veiculo: VeiculoPayload) => {
                        return (
                          <>
                            <div className="linha-dupla">
                              <p>
                                Nº do Veículo: <strong>{veiculo.numero}</strong>
                              </p>
                              <p>
                                Placa do Veículo:{" "}
                                <strong>{veiculo.placa}</strong>
                              </p>
                            </div>
                            <div className="linha-dupla">
                              <p>
                                T ºC (Área de Recebimento):{" "}
                                <strong>
                                  + {veiculo.temperatura_recebimento}
                                </strong>
                              </p>
                              <p>
                                T ºC (Produto):{" "}
                                <strong>- {veiculo.temperatura_produto}</strong>
                              </p>
                            </div>
                            <div className="linha-dupla">
                              <p>
                                Lacre: <strong>{veiculo.lacre}</strong>
                              </p>
                              <p>
                                Nº SIF, SISBI ou SISP:{" "}
                                <strong>{veiculo.numero_sif_sisbi_sisp}</strong>
                              </p>
                            </div>
                            <div className="linha-dupla">
                              <p>
                                Embalagens da Nota Fiscal:{" "}
                                <strong>
                                  {veiculo.embalagens_nota_fiscal}
                                </strong>
                              </p>
                              <p>
                                Quantidade da Nota Fiscal:{" "}
                                <strong>
                                  {veiculo.quantidade_nota_fiscal}
                                </strong>
                              </p>
                            </div>
                            <div className="linha-dupla">
                              <p>
                                Embalagens Recebidas:{" "}
                                <strong>{veiculo.embalagens_recebidas}</strong>
                              </p>
                              <p>
                                Estado Higiênico-Sanitário:{" "}
                                <strong>
                                  {veiculo.estado_higienico_adequado
                                    ? "ADEQUADO"
                                    : "INADEQUADO"}
                                </strong>
                              </p>
                            </div>
                            <p>
                              Termógrafo:{" "}
                              <strong>
                                {veiculo.termografo ? "SIM" : "NÃO"}
                              </strong>
                            </p>
                            <hr />
                          </>
                        );
                      },
                    )}
                    <p>
                      Sistema de Vedação da Embalagem Secundária:{" "}
                      <strong>
                        {fichaRecebimento.sistema_vedacao_embalagem_secundaria}
                      </strong>
                    </p>
                  </section>
                )}
                {fichaRecebimento?.reposicao_cronograma?.tipo !== "Credito" && (
                  <section id="conferenciaRotulagens">
                    <div className="divisao-colunas">
                      <div>
                        <p>
                          <strong>Conferência Embalagem Secundária</strong>
                        </p>
                        {fichaRecebimento.questoes
                          .filter((e) => e.tipo_questao === "SECUNDARIA")
                          .map(({ questao_conferencia, resposta }, idx) => (
                            <p key={idx}>
                              {questao_conferencia.questao}:{" "}
                              <strong>{resposta ? "SIM" : "NÃO"}</strong>
                            </p>
                          ))}
                      </div>
                      <div>
                        <p>
                          <strong>Conferência Embalagem Primária</strong>
                        </p>
                        {fichaRecebimento.questoes
                          .filter((e) => e.tipo_questao === "PRIMARIA")
                          .map(({ questao_conferencia, resposta }, idx) => (
                            <p key={idx}>
                              {questao_conferencia.questao}:{" "}
                              <strong>{resposta ? "SIM" : "NÃO"}</strong>
                            </p>
                          ))}
                      </div>
                    </div>
                    <hr />
                    <p>
                      Observações da Conferência:{" "}
                      <strong>
                        {fichaRecebimento.observacoes_conferencia}
                      </strong>
                    </p>
                  </section>
                )}
                {fichaRecebimento?.reposicao_cronograma?.tipo !== "Credito" && (
                  <section id="ocorrencias">
                    <>
                      <p>
                        HOUVE OCORRÊNCIA(S) NO RECEBIMENTO:{" "}
                        <strong>
                          {fichaRecebimento.houve_ocorrencia ? "SIM" : "NÃO"}
                        </strong>
                      </p>
                      {fichaRecebimento.ocorrencias.length > 0 &&
                        fichaRecebimento.ocorrencias.map(
                          (ocorrencia: OcorrenciaFichaRecebimento) => {
                            if (ocorrencia.tipo === "OUTROS_MOTIVOS")
                              return (
                                <>
                                  <p>
                                    Tipo de Ocorrência:{" "}
                                    <strong>OUTROS MOTIVOS</strong>
                                  </p>
                                  <p>
                                    Descrever a ocorrência:{" "}
                                    <strong>{ocorrencia.descricao}</strong>
                                  </p>
                                </>
                              );
                            return (
                              <>
                                <p>
                                  Tipo de Ocorrência:{" "}
                                  <strong>{ocorrencia.tipo}</strong>
                                </p>
                                <p>
                                  Ocorrência em relação a:{" "}
                                  <strong>{ocorrencia.relacao}</strong>
                                </p>
                                {ocorrencia?.numero_nota && (
                                  <p>
                                    Nº das Notas Fiscais Sujeitas a Pagamento
                                    Parcial:{" "}
                                    <strong>{ocorrencia.relacao}</strong>
                                  </p>
                                )}
                                <p>
                                  Quantidade Faltante:{" "}
                                  <strong>{ocorrencia.quantidade}</strong>
                                </p>
                                <p>
                                  Descrever a ocorrência:{" "}
                                  <strong>{ocorrencia.descricao}</strong>
                                </p>
                                <hr />
                              </>
                            );
                          },
                        )}
                    </>
                  </section>
                )}
                {fichaRecebimento?.reposicao_cronograma?.tipo !== "Credito" && (
                  <section id="observacoes">
                    <p>
                      Descreva as observações necessárias:{" "}
                      <strong>{fichaRecebimento.observacao}</strong>
                    </p>
                    <p>Documentos anexados:</p>
                    <div className="col-3">
                      {fichaRecebimento.arquivos.map(({ arquivo }) => (
                        <BotaoAnexo urlAnexo={arquivo} />
                      ))}
                    </div>
                  </section>
                )}
              </Collapse>
            </div>
          )}
          <hr />
          <div className="mt-4 mb-4">
            <div className="mt-4 mb-4">
              <Botao
                texto={
                  carregandoPdf ? (
                    <img
                      src="/assets/image/ajax-loader.gif"
                      alt="ajax-loader"
                    />
                  ) : (
                    "Ficha em PDF"
                  )
                }
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                icon={BUTTON_ICON.FILE_PDF}
                className="float-end ms-3"
                onClick={() => imprimirFicha()}
                disabled={carregandoPdf}
              />
            </div>
            <div className="mt-4 mb-4">
              <NavLink to={`/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`}>
                <Botao
                  texto="Voltar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  icon={BUTTON_ICON.ARROW_LEFT}
                  className="float-end ms-3"
                />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
