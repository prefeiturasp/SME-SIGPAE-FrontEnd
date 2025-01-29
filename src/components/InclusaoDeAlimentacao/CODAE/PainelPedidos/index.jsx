import { Select as SelectAntd } from "antd";
import { ASelect } from "components/Shareable/MakeField";
import { Select } from "components/Shareable/Select";
import { toastError } from "components/Shareable/Toast/dialogs";
import { FiltroEnum, TIPODECARD, TIPO_SOLICITACAO } from "constants/shared";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  ordenarPedidosDataMaisRecente,
} from "helpers/painelPedidos";
import {
  dataAtualDDMMYYYY,
  formatarOpcoesDRE,
  formatarOpcoesLote,
  getError,
  safeConcatOn,
  usuarioEhCODAEGestaoAlimentacao,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { getDiretoriaregionalSimplissima } from "services/diretoriaRegional.service";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";
import { getLotesSimples } from "services/lote.service";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";

export const PainelPedidos = ({ ...props }) => {
  const [pedidosPrioritarios, setPedidosPrioritarios] = useState([]);
  const [pedidosNoPrazoLimite, setPedidosNoPrazoLimite] = useState([]);
  const [pedidosNoPrazoRegular, setPedidosNoPrazoRegular] = useState([]);

  const [lotes, setLotes] = useState([]);
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([]);
  const [loading, setLoading] = useState(true);

  const { filtrosProps, visaoPorCombo } = props;

  const [filtros, setFiltros] = useState(
    filtrosProps || {
      lote: undefined,
      diretoria_regional: undefined,
    }
  );

  const fetchSolicitacoes = async (
    filtro,
    tipoSolicitacao,
    paramsFromPrevPage
  ) => {
    const response = await codaeListarSolicitacoesDeInclusaoDeAlimentacao(
      filtro,
      tipoSolicitacao,
      paramsFromPrevPage
    );

    if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError(
        `Erro ao carregar inclusões ${tipoSolicitacao}: ${getError(
          response.data
        )}`
      );
    }

    return response;
  };

  const atualizarDadosDasInclusoes = async (
    filtro,
    paramsFromPrevPage = {}
  ) => {
    const [responseAvulsas, responseContinuas, responseCEI, responseCEMEI] =
      await Promise.all([
        fetchSolicitacoes(
          filtro,
          TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
          paramsFromPrevPage
        ),
        fetchSolicitacoes(
          filtro,
          TIPO_SOLICITACAO.SOLICITACAO_CONTINUA,
          paramsFromPrevPage
        ),
        fetchSolicitacoes(
          filtro,
          TIPO_SOLICITACAO.SOLICITACAO_CEI,
          paramsFromPrevPage
        ),
        fetchSolicitacoes(
          filtro,
          TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
          paramsFromPrevPage
        ),
      ]);

    const inclusoes = safeConcatOn(
      "results",
      responseAvulsas,
      responseContinuas,
      responseCEI,
      responseCEMEI
    );

    const processarPedidos = (inclusoes, filtro) => {
      return ordenarPedidosDataMaisRecente(filtro(inclusoes));
    };

    const pedidosPrioritarios = processarPedidos(inclusoes, filtraPrioritarios);
    const pedidosNoPrazoLimite = processarPedidos(inclusoes, filtraNoLimite);
    const pedidosNoPrazoRegular = processarPedidos(inclusoes, filtraRegular);

    setPedidosPrioritarios(pedidosPrioritarios);
    setPedidosNoPrazoLimite(pedidosNoPrazoLimite);
    setPedidosNoPrazoRegular(pedidosNoPrazoRegular);

    setLoading(false);
  };

  const getLotesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      const { Option } = SelectAntd;
      const lotes_ = formatarOpcoesLote(response.data.results).map((lote) => {
        return <Option key={lote.value}>{lote.label}</Option>;
      });
      setLotes(
        [
          <Option value="" key={0}>
            Filtrar por Lote
          </Option>,
        ].concat(lotes_)
      );
    }
  };

  const getDiretoriasRegionaisAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      const { Option } = SelectAntd;
      const dres = formatarOpcoesDRE(response.data.results).map((dre) => {
        return <Option key={dre.value}>{dre.label}</Option>;
      });
      setDiretoriasRegionais(
        [
          <Option value="" key={0}>
            Filtrar por DRE
          </Option>,
        ].concat(dres)
      );
    }
  };

  const onSubmit = () => {};

  const filtrar = async (filtro, filtros) => {
    await atualizarDadosDasInclusoes(filtro, filtros);
  };

  useEffect(() => {
    getLotesAsync();
    getDiretoriasRegionaisAsync();
    const paramsFromPrevPage = filtrosProps || {
      lote: undefined,
      diretoria_regional: undefined,
    };
    const filtro = FiltroEnum.SEM_FILTRO;
    atualizarDadosDasInclusoes(filtro, paramsFromPrevPage);
  }, []);

  return (
    <div>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, form }) => (
            <form onSubmit={handleSubmit}>
              <div className="card mt-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-3 font-10 my-auto">
                      Data: {dataAtualDDMMYYYY()}
                    </div>
                    {usuarioEhCODAEGestaoAlimentacao() ? (
                      <>
                        <div className="offset-3 col-3">
                          <Field
                            component={ASelect}
                            onChange={(value) => {
                              form.change(
                                `diretoria_regional`,
                                value || undefined
                              );
                              const filtros_ = {
                                diretoria_regional: value || undefined,
                                lote: filtros.lote,
                              };
                              setFiltros(filtros_);
                              filtrar(FiltroEnum.SEM_FILTRO, filtros_);
                            }}
                            onBlur={(e) => {
                              e.preventDefault();
                            }}
                            name="diretoria_regional"
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toString()
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            }
                          >
                            {diretoriasRegionais}
                          </Field>
                        </div>
                        <div className="col-3">
                          <Field
                            component={ASelect}
                            showSearch
                            onChange={(value) => {
                              form.change(`lote`, value || undefined);
                              const filtros_ = {
                                diretoria_regional: filtros.diretoria_regional,
                                lote: value || undefined,
                              };
                              setFiltros(filtros_);
                              filtrar(FiltroEnum.SEM_FILTRO, filtros_);
                            }}
                            onBlur={(e) => {
                              e.preventDefault();
                            }}
                            name="lote"
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toString()
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            }
                          >
                            {lotes}
                          </Field>
                        </div>
                      </>
                    ) : (
                      <div className="offset-6 col-3 text-end">
                        <Field
                          component={Select}
                          name="visao_por"
                          naoDesabilitarPrimeiraOpcao
                          onChangeEffect={(event) =>
                            filtrar(event.target.value, filtros)
                          }
                          placeholder={"Filtro por"}
                          options={visaoPorCombo}
                        />
                      </div>
                    )}
                  </div>
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={
                          "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
                        }
                        tipoDeCard={TIPODECARD.PRIORIDADE}
                        pedidos={pedidosPrioritarios}
                        colunaDataLabel={"Data da Inclusão"}
                      />
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={"Solicitações no prazo limite"}
                        tipoDeCard={TIPODECARD.NO_LIMITE}
                        pedidos={pedidosNoPrazoLimite}
                        colunaDataLabel={"Data da Inclusão"}
                      />
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={"Solicitações no prazo regular"}
                        tipoDeCard={TIPODECARD.REGULAR}
                        pedidos={pedidosNoPrazoRegular}
                        colunaDataLabel={"Data da Inclusão"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Form>
      )}
    </div>
  );
};
