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
import { gerarParametrosConsulta } from "../../../helpers/utilities";
import {
  DocumentosRecebimentoDashboard,
  FiltrosDashboardDocumentos,
  VerMaisItem,
} from "src/interfaces/pre_recebimento.interface";
import { ResponseDocumentosPorStatusDashboard } from "src/interfaces/responses.interface";

interface Props {
  getSolicitacoes: (
    _params?: URLSearchParams,
  ) => Promise<ResponseDocumentosPorStatusDashboard>;
  params: FiltrosDashboardDocumentos;
  limit: number;
  titulo: string;
  icone: string;
  cardType: string;
  urlBaseItem: string;
}

export const SolicitacoesDocumentoStatusGenerico: React.FC<Props> = ({
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

  const formataCardDocumento = (
    itens: DocumentosRecebimentoDashboard[],
  ): VerMaisItem[] => {
    return itens.map((item) => ({
      texto: `${item.numero_cronograma} - ${item.nome_produto} - ${item.nome_empresa}`,
      data: item.log_mais_recente.slice(0, 10),
      link: `${urlBaseItem}?uuid=${item.uuid}`,
      programa_leve_leite: item.programa_leve_leite,
    }));
  };

  const getSolicitacoesAsync = async (
    params: FiltrosDashboardDocumentos,
  ): Promise<void> => {
    let parametros = gerarParametrosConsulta(params);
    let response = await getSolicitacoes(parametros);

    if (response.status === HTTP_STATUS.OK) {
      let solicitacoes_new = formataCardDocumento(response.data.results.dados);
      setSolicitacoes(solicitacoes_new);
      setCount(response.data.results.total);
    } else {
      toastError("Ocorreu um erro ao carregar o dashboard!");
    }
    setLoading(false);
  };

  const filtrarRequisicao = debounce((values: FiltrosDashboardDocumentos) => {
    const { nome_fornecedor, nome_produto, numero_cronograma } = values;
    const podeFiltrar = [nome_fornecedor, nome_produto, numero_cronograma].some(
      (value) => value && value.length > 2,
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
  }, 500);

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
              nome_fornecedor: "",
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
                    name="numero_cronograma"
                    placeholder="Filtrar por Nº do Cronograma"
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
                    name="nome_fornecedor"
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
