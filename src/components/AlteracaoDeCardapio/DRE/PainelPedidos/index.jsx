import { Select as SelectAntd, Spin } from "antd";
import { ASelect } from "components/Shareable/MakeField";
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
  formatarOpcoesLote,
  getError,
  safeConcatOn,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { dreListarSolicitacoesDeAlteracaoDeCardapio } from "services/alteracaoDeCardapio";
import { getLotesSimples } from "services/lote.service";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";

export const PainelPedidos = ({ ...props }) => {
  const [pedidosPrioritarios, setPedidosPrioritarios] = useState();
  const [pedidosNoPrazoLimite, setPedidosNoPrazoLimite] = useState();
  const [pedidosNoPrazoRegular, setPedidosNoPrazoRegular] = useState();

  const [lotes, setLotes] = useState();
  const [loading, setLoading] = useState(true);

  const { filtrosProps } = props;

  const fetchSolicitacoes = async (
    filtro,
    tipoSolicitacao,
    paramsFromPrevPage
  ) => {
    const response = await dreListarSolicitacoesDeAlteracaoDeCardapio(
      filtro,
      tipoSolicitacao,
      paramsFromPrevPage
    );

    if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError(
        `Erro ao carregar alterações ${tipoSolicitacao}: ${getError(
          response.data
        )}`
      );
    }

    return response;
  };

  const atualizarDadosDasAlteracoes = async (filtro, paramsFromPrevPage) => {
    setLoading(true);
    setPedidosPrioritarios();
    setPedidosNoPrazoLimite();
    setPedidosNoPrazoRegular();

    const [responseAvulsas, responseCEI, responseCEMEI] = await Promise.all([
      fetchSolicitacoes(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
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

    const alteracoes = safeConcatOn(
      "results",
      responseAvulsas,
      responseCEI,
      responseCEMEI
    );

    const processarPedidos = (alteracoes, filtro) => {
      return ordenarPedidosDataMaisRecente(filtro(alteracoes));
    };

    const pedidosPrioritarios = processarPedidos(
      alteracoes,
      filtraPrioritarios
    );
    const pedidosNoPrazoLimite = processarPedidos(alteracoes, filtraNoLimite);
    const pedidosNoPrazoRegular = processarPedidos(alteracoes, filtraRegular);

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

  const onSubmit = () => {};

  const filtrar = async (filtro, filtros) => {
    await atualizarDadosDasAlteracoes(filtro, filtros);
  };

  useEffect(() => {
    getLotesAsync();
    const paramsFromPrevPage = filtrosProps;
    const filtro = FiltroEnum.SEM_FILTRO;
    atualizarDadosDasAlteracoes(filtro, paramsFromPrevPage);
  }, []);

  const LOADING_INICIAL =
    !pedidosPrioritarios &&
    !pedidosNoPrazoLimite &&
    !pedidosNoPrazoRegular &&
    !lotes;

  return (
    <div>
      {LOADING_INICIAL ? (
        <div>Carregando...</div>
      ) : (
        <Form initialValues={{ ...filtrosProps }} onSubmit={onSubmit}>
          {({ handleSubmit, form }) => (
            <form onSubmit={handleSubmit}>
              <div className="card mt-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-3 font-10 my-auto">
                      Data: {dataAtualDDMMYYYY()}
                    </div>
                    <div className="offset-6 col-3">
                      <Field
                        component={ASelect}
                        showSearch
                        onChange={(value) => {
                          form.change(`lote`, value);
                          const filtros_ = {
                            lote: value,
                          };
                          filtrar(FiltroEnum.SEM_FILTRO, filtros_);
                        }}
                        name="lote"
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        dataTestId="select-lote"
                      >
                        {lotes}
                      </Field>
                    </div>
                  </div>
                  <Spin tip="Carregando solicitações..." spinning={loading}>
                    <div className="row pt-3">
                      <div className="col-12">
                        {pedidosPrioritarios && (
                          <CardPendenteAcao
                            titulo={
                              "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
                            }
                            tipoDeCard={TIPODECARD.PRIORIDADE}
                            pedidos={pedidosPrioritarios}
                            colunaDataLabel={"Data da Alteração"}
                            dataTestId="prioritario"
                          />
                        )}
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-12">
                        {pedidosNoPrazoLimite && (
                          <CardPendenteAcao
                            titulo={"Solicitações no prazo limite"}
                            tipoDeCard={TIPODECARD.NO_LIMITE}
                            pedidos={pedidosNoPrazoLimite}
                            colunaDataLabel={"Data da Alteração"}
                            dataTestId="limite"
                          />
                        )}
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-12">
                        {pedidosNoPrazoRegular && (
                          <CardPendenteAcao
                            titulo={"Solicitações no prazo regular"}
                            tipoDeCard={TIPODECARD.REGULAR}
                            pedidos={pedidosNoPrazoRegular}
                            colunaDataLabel={"Data da Alteração"}
                            dataTestId="regular"
                          />
                        )}
                      </div>
                    </div>
                  </Spin>
                </div>
              </div>
            </form>
          )}
        </Form>
      )}
    </div>
  );
};
