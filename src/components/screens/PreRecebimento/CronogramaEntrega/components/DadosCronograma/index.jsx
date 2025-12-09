import { deParaStatusAltCronograma } from "src/components/screens/helper";
import {
  usuarioEhEmpresaFornecedor,
  formataMilharDecimal,
} from "src/helpers/utilities";
import React from "react";
import "./styles.scss";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

export default ({
  cronograma,
  esconderInformacoesAdicionais,
  solicitacaoAlteracaoCronograma,
}) => {
  const enderecoFormatado = (armazem) =>
    armazem.endereco
      ? `${armazem.endereco} ${armazem.numero}, ${armazem.bairro}, ${armazem.estado} - CEP: ${armazem.cep}`
      : "";

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
              {cronograma.contrato.programa === "LEVE_LEITE" && (
                <TagLeveLeite />
              )}
            </div>
          </div>

          <hr />

          <div className="row my-2">
            <p className="head-green">
              {solicitacaoAlteracaoCronograma
                ? "Dados do Produto"
                : "Dados do produto e datas das entregas"}
            </p>
          </div>

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
                  {cronograma.ficha_tecnica?.peso_liquido_embalagem_primaria}{" "}
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
                  {cronograma.ficha_tecnica?.peso_liquido_embalagem_secundaria}{" "}
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
                  <b>{cronograma.ficha_tecnica?.volume_embalagem_primaria}</b>
                </p>
              </div>
            )}
          </div>

          <div className="row mb-4">
            <div className="col">
              <table className="table tabela-dados-cronograma">
                <thead className="head-crono">
                  <th className="borda-crono text-center">N° do Empenho</th>
                  <th className="borda-crono text-center">
                    Qtde. Total do Empenho
                  </th>
                  <th className="borda-crono text-center">Etapa</th>
                  <th className="borda-crono text-center">Parte</th>
                  <th className="borda-crono text-center">Data Programada</th>
                  <th className="borda-crono text-center">Quantidade</th>
                  <th className="borda-crono text-center">
                    Total de Embalagens
                  </th>
                </thead>
                <tbody>
                  {(() => {
                    let etapas = solicitacaoAlteracaoCronograma
                      ? solicitacaoAlteracaoCronograma.etapas_antigas
                      : cronograma.etapas;
                    return etapas.map((etapa, key) => {
                      return (
                        <tr key={key}>
                          <td className="borda-crono text-center">
                            {etapa.numero_empenho}
                          </td>
                          <td className="borda-crono text-center">
                            {formataMilharDecimal(etapa.qtd_total_empenho)}{" "}
                            {cronograma.unidade_medida?.abreviacao}
                          </td>
                          <td className="borda-crono text-center">
                            {etapa.etapa}
                          </td>
                          <td className="borda-crono text-center">
                            {etapa.parte}
                          </td>
                          <td className="borda-crono text-center">
                            {etapa.data_programada}
                          </td>
                          <td className="borda-crono text-center">
                            {formataMilharDecimal(etapa.quantidade)}{" "}
                            {cronograma.unidade_medida?.abreviacao}
                          </td>
                          <td className="borda-crono text-center">
                            {formataMilharDecimal(etapa.total_embalagens)}{" "}
                            {cronograma.tipo_embalagem_secundaria?.abreviacao}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          <hr />

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
                        {cronograma.ficha_tecnica?.produto?.nome}
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
