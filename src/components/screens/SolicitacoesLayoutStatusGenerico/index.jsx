import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import CardListarSolicitacoesCronograma from "src/components/Shareable/CardListarSolicitacoesCronograma";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { debounce } from "lodash";
import { gerarParametrosConsulta } from "../../../helpers/utilities";

export const SolicitacoesLayoutStatusGenerico = ({ ...props }) => {
  const {
    getSolicitacoes,
    params,
    limit,
    titulo,
    icone,
    cardType,
    urlBaseItem,
  } = props;
  const [solicitacoes, setSolicitacoes] = useState(null);
  const [erro, setErro] = useState("");
  const [filtrado, setFiltrado] = useState(false);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = limit || 10;

  const formataCardLayout = (itens) => {
    return itens.map((item) => ({
      texto: `${item.numero_ficha_tecnica} - ${item.nome_produto} - ${item.nome_empresa}`,
      data: item.log_mais_recente.slice(0, 10),
      link: `${urlBaseItem}?uuid=${item.uuid}`,
      programa_leve_leite: item.programa_leve_leite,
    }));
  };

  const getSolicitacoesAsync = async (params) => {
    let parametros = gerarParametrosConsulta(params);
    let response = await getSolicitacoes(parametros);

    if (response.status === HTTP_STATUS.OK) {
      let solicitacoes_new = response.data.results.dados;
      solicitacoes_new = formataCardLayout(solicitacoes_new);
      setSolicitacoes(solicitacoes_new);
      setCount(response.data.results.total);
    } else {
      setErro(response.data);
    }
    setLoading(false);
  };

  const filtrarRequisicao = debounce((value, values) => {
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

  const onPageChanged = async (page) => {
    const paramsPage = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
    let newParams = Object.assign({}, params, paramsPage);
    await getSolicitacoesAsync(newParams);
    setCurrentPage(page);
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        {erro && <div>{erro}</div>}
        {!erro && (
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
                      inputOnChange={(e) =>
                        filtrarRequisicao(
                          e.target.value,
                          form.getState().values,
                        )
                      }
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      name="nome_produto"
                      placeholder="Filtrar por Nome do Produto"
                      inputOnChange={(e) =>
                        filtrarRequisicao(
                          e.target.value,
                          form.getState().values,
                        )
                      }
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      name="nome_fornecedor"
                      placeholder="Filtrar por Nome do Fornecedor"
                      inputOnChange={(e) =>
                        filtrarRequisicao(
                          e.target.value,
                          form.getState().values,
                        )
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
              onChange={(page) => onPageChanged(page)}
              total={count}
              pageSize={PAGE_SIZE}
              current={currentPage}
            />
          </Spin>
        )}
      </div>
    </div>
  );
};
