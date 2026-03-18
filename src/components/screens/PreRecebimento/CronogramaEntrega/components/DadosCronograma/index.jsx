import { deParaStatusAltCronograma } from "src/components/screens/helper";
import {
  usuarioEhEmpresaFornecedor,
  formataMilharDecimal,
  formataMesNome,
} from "src/helpers/utilities";
import React from "react";
import "./styles.scss";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

export default ({
  cronograma,
  esconderInformacoesAdicionais,
  solicitacaoAlteracaoCronograma,
}) => {
  const ehFLVPontoAPonto = cronograma.ficha_tecnica?.flv_ponto_a_ponto;

  const enderecoFormatado = (armazem) =>
    armazem?.endereco
      ? `${armazem.endereco} ${armazem.numero}, ${armazem.bairro}, ${armazem.estado} - CEP: ${armazem.cep}`
      : "";

  const formatarDataFLV = (data) => {
    if (!data) return "";
    const partes = data.split("/");
    if (partes.length < 3) return data;
    const mes = partes[1];
    const ano = partes[2];
    return `${formataMesNome(mes)} ${ano}`;
  };

  return (
    <>
      <div className="row my-3">
        <p className="head-green">Dados Gerais</p>
      </div>

      {solicitacaoAlteracaoCronograma ? (
        <div className="row detalhar-head">
          <div className="col-3">
            <p>
              <b>Data da Solicitação:</b>
            </p>
            <p className="head-green">
              {solicitacaoAlteracaoCronograma.criado_em.split(" ")[0]}
            </p>
          </div>
          <div className="col-3">
            <p>
              <b>Nº da Solicitação:</b>
            </p>
            <p className="head-green">
              {solicitacaoAlteracaoCronograma.numero_solicitacao}
            </p>
          </div>
          <div className="col-3">
            <p>
              <b>Nº do Cronograma:</b>
            </p>
            <p className="head-green">{cronograma.numero}</p>
          </div>
          <div className="col-3">
            <p>
              <b>Status:</b>
            </p>
            <p className="head-green">
              {usuarioEhEmpresaFornecedor()
                ? deParaStatusAltCronograma(
                    solicitacaoAlteracaoCronograma.status,
                  )
                : solicitacaoAlteracaoCronograma.status}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="row detalhar-head">
            <div className="col-4">
              <p>
                <b>Nº do Cronograma:</b>
              </p>
              <p className="head-green">{cronograma.numero}</p>
            </div>
            <div className="col-4">
              <p>
                <b>Nº do Pregão Eletrônico/Chamada Pública:</b>
              </p>
              <p className="head-green">
                {cronograma.contrato.numero_pregao ||
                  cronograma.contrato.numero_chamada_publica}
              </p>
            </div>
            <div className="col-4">
              <p>
                <b>Nº do Contrato:</b>
              </p>
              {cronograma.contrato && (
                <p className="head-green">{cronograma.contrato.numero}</p>
              )}
            </div>
          </div>

          <div className="row detalhar-head mt-4">
            <div className="col-4">
              <p>
                <b>Nº do Processo SEI - Contratos:</b>
              </p>
              {cronograma.contrato && (
                <p className="head-green">{cronograma.contrato.processo}</p>
              )}
            </div>
            {cronograma.contrato?.ata && (
              <div className="col-4">
                <p>
                  <b>Nº da ATA:</b>
                </p>
                <p className="head-green">{cronograma.contrato.ata}</p>
              </div>
            )}
          </div>
        </>
      )}

      <hr />

      {!esconderInformacoesAdicionais ? (
        <>
          <div className="row my-3">
            <p>Empresa:</p>
            <p>
              <b>{`${cronograma.empresa?.nome_fantasia} / ${cronograma.empresa?.razao_social}`}</b>
            </p>
          </div>

          <hr />

          <div className="row my-3">
            <p>Produto:</p>
            <div className="d-flex align-items-center gap-3">
              <b>{cronograma.ficha_tecnica?.produto.nome}</b>
              {cronograma.ficha_tecnica?.programa === "LEVE_LEITE" && (
                <TagLeveLeite />
              )}
            </div>
          </div>

          <hr />

          <div className="row my-2">
            <p className="head-green">
              {solicitacaoAlteracaoCronograma
                ? "Dados do Produto"
                : ehFLVPontoAPonto
                  ? "Dados do Produto e Data de Entrega"
                  : "Dados do produto e datas das entregas"}
            </p>
          </div>

          {!ehFLVPontoAPonto ? (
            <>
              <div className="row mb-4">
                <div className="col-4">
                  <p>Marca:</p>
                  <p>
                    <b>{cronograma.ficha_tecnica?.marca.nome}</b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Quantidade Total Programada:</p>
                  <p>
                    <b>
                      {formataMilharDecimal(cronograma.qtd_total_programada)}{" "}
                      {cronograma.unidade_medida?.abreviacao}
                    </b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Custo Unitário do Produto:</p>
                  <p>
                    <b>
                      R$
                      {cronograma.custo_unitario_produto
                        ?.toFixed(2)
                        .replace(".", ",")}
                    </b>
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-4">
                  <p>Embalagem Primária:</p>
                  <p>
                    <b>
                      {
                        cronograma.ficha_tecnica
                          ?.peso_liquido_embalagem_primaria
                      }{" "}
                      {
                        cronograma.ficha_tecnica?.unidade_medida_primaria
                          ?.abreviacao
                      }
                    </b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Embalagem Secundária:</p>
                  <p>
                    <b>
                      {
                        cronograma.ficha_tecnica
                          ?.peso_liquido_embalagem_secundaria
                      }{" "}
                      {
                        cronograma.ficha_tecnica?.unidade_medida_secundaria
                          ?.abreviacao
                      }
                    </b>
                  </p>
                </div>
                {cronograma.ficha_tecnica?.volume_embalagem_primaria && (
                  <div className="col-4">
                    <p>Volume da Embalagem Primária:</p>
                    <p>
                      <b>
                        {cronograma.ficha_tecnica?.volume_embalagem_primaria}
                      </b>
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-4">
                  <p>Nº do Empenho:</p>
                  <p>
                    <b>
                      {cronograma.etapas?.[0]?.numero_empenho ||
                        cronograma.numero_empenho}
                    </b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Quantidade total do empenho:</p>
                  <p>
                    <b>
                      {formataMilharDecimal(
                        cronograma.etapas?.[0]?.qtd_total_empenho ||
                          cronograma.qtd_total_empenho,
                      )}{" "}
                      {cronograma.unidade_medida?.abreviacao}
                    </b>
                  </p>
                </div>
                <div className="col-4">
                  <p>Custo unitário do produto:</p>
                  <p>
                    <b>
                      R${" "}
                      {formataMilharDecimal(cronograma.custo_unitario_produto)}
                    </b>
                  </p>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-4">
                  <p>Quantidade total do produto:</p>
                  <p>
                    <b>
                      {formataMilharDecimal(cronograma.qtd_total_programada)}{" "}
                      {cronograma.unidade_medida?.abreviacao}
                    </b>
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="row mb-4">
            <div className="col">
              {ehFLVPontoAPonto ? (
                <p className="head-green mb-3">
                  <b>Tabela de Distribuição de Etapas</b>
                </p>
              ) : null}
              <table className="table tabela-dados-cronograma">
                <thead className="head-crono">
                  {!ehFLVPontoAPonto && (
                    <th className="borda-crono text-center">N° do Empenho</th>
                  )}
                  {!ehFLVPontoAPonto && (
                    <th className="borda-crono text-center">
                      Qtde. Total do Empenho
                    </th>
                  )}
                  <th className="borda-crono text-center">Etapa</th>
                  {!ehFLVPontoAPonto && (
                    <th className="borda-crono text-center">Parte</th>
                  )}
                  <th className="borda-crono text-center">Data Programada</th>
                  <th className="borda-crono text-center">Quantidade</th>
                  {!ehFLVPontoAPonto && (
                    <th className="borda-crono text-center">
                      Total de Embalagens
                    </th>
                  )}
                </thead>
                <tbody>
                  {(() => {
                    let etapas = solicitacaoAlteracaoCronograma
                      ? solicitacaoAlteracaoCronograma.etapas_antigas
                      : cronograma.etapas;
                    return etapas.map((etapa, key) => {
                      return (
                        <tr key={key}>
                          {!ehFLVPontoAPonto && (
                            <td className="borda-crono text-center">
                              {etapa.numero_empenho}
                            </td>
                          )}
                          {!ehFLVPontoAPonto && (
                            <td className="borda-crono text-center">
                              {formataMilharDecimal(etapa.qtd_total_empenho)}{" "}
                              {cronograma.unidade_medida?.abreviacao}
                            </td>
                          )}
                          <td className="borda-crono text-center">
                            {ehFLVPontoAPonto
                              ? `Etapa ${key + 1}`
                              : etapa.etapa}
                          </td>
                          {!ehFLVPontoAPonto && (
                            <td className="borda-crono text-center">
                              {etapa.parte}
                            </td>
                          )}
                          <td className="borda-crono text-center">
                            {ehFLVPontoAPonto
                              ? formatarDataFLV(etapa.data_programada)
                              : etapa.data_programada}
                          </td>
                          <td className="borda-crono text-center">
                            {formataMilharDecimal(etapa.quantidade)}{" "}
                            {cronograma.unidade_medida?.abreviacao}
                          </td>
                          {!ehFLVPontoAPonto && (
                            <td className="borda-crono text-center">
                              {formataMilharDecimal(etapa.total_embalagens)}{" "}
                              {cronograma.tipo_embalagem_secundaria?.abreviacao}
                            </td>
                          )}
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          <hr />

          {!ehFLVPontoAPonto && (
            <>
              <div className="row head-green my-3">
                <div className="col">Armazém</div>
              </div>
              <div className="row">
                <p>
                  <b>{cronograma.armazem?.nome_fantasia}</b>{" "}
                  <span className="mx-2">|</span>
                  {enderecoFormatado(cronograma.armazem)}
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p className="head-green my-3">
            <strong>Dados do Produto e Datas das Entregas</strong>
          </p>
          <table className="table mt-4 mb-3">
            <thead className="head-crono">
              <th className="borda-crono text-center">Fornecedor</th>
              <th className="borda-crono text-center">Produto</th>
              <th className="borda-crono text-center">Data</th>
              <th className="borda-crono text-center">Etapa</th>
              <th className="borda-crono text-center">Parte</th>
              <th className="borda-crono text-center">Quantidade</th>
              <th className="borda-crono text-center">Armazém</th>
              <th className="borda-crono text-center">Status</th>
            </thead>
            <tbody>
              {cronograma.etapas.length > 0 &&
                cronograma.etapas.map((etapa, key) => {
                  return (
                    <tr key={key}>
                      <td className="borda-crono text-center">
                        {cronograma.empresa && cronograma.empresa.nome_fantasia}
                      </td>
                      <td className="borda-crono text-center">
                        <div className="d-flex justify-content-center align-items-center gap-4">
                          {cronograma.ficha_tecnica?.produto?.nome}
                          {cronograma.ficha_tecnica?.programa ===
                            "LEVE_LEITE" && <TagLeveLeite />}
                        </div>
                      </td>
                      <td className="borda-crono text-center">
                        {etapa.data_programada}
                      </td>
                      <td className="borda-crono text-center">{etapa.etapa}</td>
                      <td className="borda-crono text-center">{etapa.parte}</td>
                      <td className="borda-crono text-center">
                        {formataMilharDecimal(etapa.quantidade)}
                      </td>
                      <td className="borda-crono text-center">
                        {cronograma.armazem && cronograma.armazem.nome_fantasia}
                      </td>
                      <td className="borda-crono text-center">
                        {cronograma.status}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}
      <div />
    </>
  );
};
