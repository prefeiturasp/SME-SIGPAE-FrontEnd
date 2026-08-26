import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { getTermoRecebimentoDefinitivo } from "src/services/posRecebimento.service";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";
import { formataMilharDecimal } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import { Parser } from "html-to-react";
import { CronogramaTermoItem, TermoRecebimentoDetalhe } from "../../interfaces";
import "./styles.scss";

const htmlParser = Parser();

const montarObjetoContrato = (
  cronogramas: CronogramaTermoItem[],
): React.ReactNode => {
  const itens = (cronogramas ?? []).filter(
    (item) => item.cronograma?.ficha_tecnica?.produto?.nome,
  );

  if (itens.length === 0) return null;

  return (
    <>
      Aquisição de{" "}
      {itens.map((item, index) => {
        // Junção: ", " entre os itens e " e " antes do último.
        const separador =
          index === 0 ? "" : index === itens.length - 1 ? " e " : ", ";
        const abreviacao = item.cronograma.unidade_medida?.abreviacao;
        const unidade = abreviacao ? ` ${abreviacao}` : "";
        return (
          <React.Fragment key={item.cronograma.uuid ?? index}>
            {separador}
            <b>
              {formataMilharDecimal(item.quantidade_total_recebida)}
              {unidade}
            </b>{" "}
            de <b>{item.cronograma.ficha_tecnica.produto.nome}</b>
          </React.Fragment>
        );
      })}
      , para atendimento ao Programa Nacional de Alimentação Escolar - PNAE.
    </>
  );
};

const DetalharTermoRecebimentoDefinitivo: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const navigate = useNavigate();
  const [termo, setTermo] = useState<TermoRecebimentoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(false);

  const getDetalhes = async () => {
    if (uuid) {
      setCarregando(true);
      try {
        const response = await getTermoRecebimentoDefinitivo(uuid);
        if (response.status === HTTP_STATUS.OK) {
          setTermo(response.data);
        }
      } catch {
        // Erro ao carregar termo de recebimento definitivo
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
    navigate(`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`);
  };

  return (
    <Spin tip="Carregando..." spinning={!termo || carregando}>
      <div className="card mt-3 card-detalhar-cronograma-semanal">
        <div className="card-body">
          {termo && (
            <div>
              <div className="row detalhar-head my-3">
                <div>
                  <p>
                    <b>EMPRESA CONTRATADA:</b>
                  </p>
                  <p className="head-green">{termo.empresa?.nome_fantasia}</p>
                </div>
              </div>

              <hr />

              <div className="row my-3">
                <p>
                  <b>CRONOGRAMAS:</b>
                </p>
                <p className="head-green">
                  {termo.cronogramas
                    ?.map((item) => item.cronograma?.numero)
                    .join(" | ")}
                </p>
              </div>

              <hr />

              <div className="row my-3">
                <p className="head-green">
                  <b>Objeto do Contrato:</b>
                </p>
                <p className="objeto-contrato">
                  {montarObjetoContrato(termo.cronogramas)}
                </p>
              </div>

              <div className="dados-contrato">
                <div className="row">
                  <div className="col-4">
                    <p>
                      <b>PROCESSO SEI Nº:</b>
                    </p>
                    <p>{termo.contrato?.processo}</p>
                  </div>
                  <div className="col-4">
                    <p>
                      <b>TC Nº:</b>
                    </p>
                    <p>{termo.contrato?.numero}</p>
                  </div>
                  <div className="col-4">
                    <p>
                      <b>VALOR DO CONTRATO:</b>
                    </p>
                    <p>
                      R${" "}
                      {formataMilharDecimal(
                        termo.cronogramas?.[0]?.valor_contrato ?? 0,
                      )}
                    </p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-12">
                    <p>
                      <b>QUANTIDADE TOTAL RECEBIDA:</b>
                    </p>
                    {termo.cronogramas
                      ?.filter(
                        (item) => item.cronograma?.ficha_tecnica?.produto?.nome,
                      )
                      .map((item, index) => {
                        const abreviacao =
                          item.cronograma.unidade_medida?.abreviacao;
                        return (
                          <p key={item.cronograma.uuid ?? index}>
                            {item.cronograma.numero} -{" "}
                            {item.cronograma.ficha_tecnica.produto.nome}:{" "}
                            <b>
                              {formataMilharDecimal(
                                item.quantidade_total_recebida,
                              )}
                              {abreviacao ? ` ${abreviacao}` : ""}
                            </b>
                          </p>
                        );
                      })}
                  </div>
                </div>
              </div>

              <hr />

              <div className="row detalhar-head my-3">
                <div className="col-4">
                  <p>
                    <b>Fiscal 1:</b>
                  </p>
                  <p className="head-green">{termo.fiscal_1?.nome}</p>
                </div>
                <div className="col-4">
                  <p>
                    <b>Fiscal 2:</b>
                  </p>
                  <p className="head-green">{termo.fiscal_2?.nome}</p>
                </div>
                <div className="col-4">
                  <p>
                    <b>Fiscal 3:</b>
                  </p>
                  <p className="head-green">{termo.fiscal_3?.nome}</p>
                </div>
              </div>

              <hr />

              <div className="row my-3">
                <div>
                  {termo.texto_termo && htmlParser.parse(termo.texto_termo)}
                </div>
              </div>

              <div className="mt-4 mb-4">
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

export default DetalharTermoRecebimentoDefinitivo;
