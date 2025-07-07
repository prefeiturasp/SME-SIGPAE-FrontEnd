import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import CardListarSolicitacoesCronograma from "src/components/Shareable/CardListarSolicitacoesCronograma";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { debounce } from "lodash";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  FiltrosDashboardFichasTecnicas,
  VerMaisItem,
} from "src/interfaces/pre_recebimento.interface";
import { ResponseFichasTecnicasPorStatusDashboard } from "src/interfaces/responses.interface";
import { formataItensVerMais } from "../PreRecebimento/PainelFichasTecnicas/helpers";

interface Props {
  getSolicitacoes: (
    _params?: URLSearchParams
  ) => Promise<ResponseFichasTecnicasPorStatusDashboard>;
  params: FiltrosDashboardFichasTecnicas;
  limit: number;
  titulo: string;
  icone: string;
  cardType: string;
  urlBaseItem: string;
}

export const SolicitacoesFichaTecnicaStatusGenerico: React.FC<Props> = ({
  getSolicitacoes,
  params,
  limit,
  titulo,
  icone,
  cardType,
  urlBaseItem,
}) => {
  const [solicitacoes, setSolicitacoes] = useState<VerMaisItem[]>(null);
  const [filtrado, setFiltrado] = useState<boolean>(false);
  const [count, setCount] = useState<number>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const PAGE_SIZE = limit || 10;

  const getSolicitacoesAsync = async (
    params: FiltrosDashboardFichasTecnicas
  ): Promise<void> => {
    let parametros = gerarParametrosConsulta(params);
    let response = await getSolicitacoes(parametros);

    if (response.status === HTTP_STATUS.OK) {
      let solicitacoesFormatadas = formataItensVerMais(
        response.data.results.dados,
        urlBaseItem
      );
      setSolicitacoes(solicitacoesFormatadas);
      setCount(response.data.results.total);
    } else {
      toastError("Ocorreu um erro ao carregar o dashboard");
    }
    setLoading(false);
  };

  const filtrarRequisicao = debounce(
    (values: FiltrosDashboardFichasTecnicas) => {
      const { nome_empresa, nome_produto, numero_ficha } = values;
      const podeFiltrar = [nome_empresa, nome_produto, numero_ficha].some(
        (value) => value && value.length > 2
      );
      if (podeFiltrar) {
        setLoading(true);
        let newParams = Object.assign({}, params, { ...values });
        setFiltrado(true);
        getSolicitacoesAsync(newParams);
      } else if (filtrado) {
        setLoading(true);
        setFiltrado(false);
        getSolicitacoesAsync(params);
      }
    },
    500
  );

  useEffect(() => {
    setCurrentPage(1);
    getSolicitacoesAsync(params);
  }, []);

  const onPageChanged = async (page: number) => {
    const paramsPage = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
    let newParams = Object.assign({}, params, paramsPage);
    await getSolicitacoesAsync(newParams);
    setCurrentPage(page);
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <Spin tip="Carregando..." spinning={loading}>
          <Form
            initialValues={{
              nome_empresa: "",
              numero_cronograma: "",
              nome_produto: "",
            }}
            onSubmit={() => {}}
          >
            {({ form }) => (
              <div className="row">
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="numero_ficha"
                    placeholder="Filtrar por Nº da Ficha Técnica"
                    inputOnChange={() =>
                      filtrarRequisicao(form.getState().values)
                    }
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="nome_produto"
                    placeholder="Filtrar por Nome do Produto"
                    inputOnChange={() =>
                      filtrarRequisicao(form.getState().values)
                    }
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="nome_empresa"
                    placeholder="Filtrar por Nome do Fornecedor"
                    inputOnChange={() =>
                      filtrarRequisicao(form.getState().values)
                    }
                  />
                </div>
              </div>
            )}
          </Form>
          <CardListarSolicitacoesCronograma
            titulo={titulo}
            icone={icone}
            tipo={cardType}
            solicitacoes={solicitacoes}
            exibirTooltip
          />
          <Paginacao
            onChange={(page: number) => onPageChanged(page)}
            total={count}
            pageSize={PAGE_SIZE}
            current={currentPage}
          />
        </Spin>
      </div>
    </div>
  );
};
