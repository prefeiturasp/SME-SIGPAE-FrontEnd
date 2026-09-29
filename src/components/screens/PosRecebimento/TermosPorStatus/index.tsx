import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { debounce } from "lodash";
import { Field, Form } from "react-final-form";
import CardListarSolicitacoesCronograma from "src/components/Shareable/CardListarSolicitacoesCronograma";
import { Paginacao } from "src/components/Shareable/Paginacao";
import InputText from "src/components/Shareable/Input/InputText";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  POS_RECEBIMENTO,
  DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";
import { TermoRecebimentoAssinaturaDashboard } from "../PainelAssinaturaTermosRecebimento/interfaces";

interface Props {
  getSolicitacoes: (_params?: URLSearchParams) => Promise<any>;
  params: Record<string, any>;
  limit: number;
  titulo: string;
  icone: string;
  cardType: string;
}

interface ItemLista {
  texto: string;
  data: string;
  link: string;
}

const TermosPorStatus: React.FC<Props> = ({
  getSolicitacoes,
  params,
  limit,
  titulo,
  icone,
  cardType,
}) => {
  const [solicitacoes, setSolicitacoes] = useState<ItemLista[] | null>(null);
  const [filtrado, setFiltrado] = useState<boolean>(false);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PAGE_SIZE = limit || 10;

  const formataItens = (
    itens: TermoRecebimentoAssinaturaDashboard[],
  ): ItemLista[] =>
    itens.map((item) => {
      const empresa = item.razao_social
        ? `${item.empresa} - ${item.razao_social}`
        : item.empresa;
      const produtos = (item.nomes_produtos || []).join(" | ");

      return {
        texto: `${item.numero_contrato} - ${empresa} - ${produtos}`,
        data: item.criado_em,
        link: `/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO}?uuid=${item.uuid}`,
      };
    });

  const getSolicitacoesAsync = async (
    parametros: Record<string, any>,
  ): Promise<void> => {
    const response = await getSolicitacoes(gerarParametrosConsulta(parametros));

    if (response?.status === HTTP_STATUS.OK) {
      setSolicitacoes(formataItens(response.data?.results || []));
      setCount(response.data?.count || 0);
    }
    setLoading(false);
  };

  const filtrarRequisicao = debounce((values: Record<string, any>) => {
    const { numero_contrato, nome_produto, nome_empresa } = values;
    const podeFiltrar = [numero_contrato, nome_produto, nome_empresa].some(
      (value) => value && value.length > 2,
    );

    if (podeFiltrar) {
      setLoading(true);
      setFiltrado(true);
      getSolicitacoesAsync({ ...params, ...values });
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
    await getSolicitacoesAsync({ ...params, ...paramsPage });
    setCurrentPage(page);
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <Spin tip="Carregando..." spinning={loading}>
          <Form
            initialValues={{
              numero_contrato: "",
              nome_produto: "",
              nome_empresa: "",
            }}
            onSubmit={() => {}}
          >
            {({ form }) => (
              <div className="row">
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="numero_contrato"
                    placeholder="Pesquisar por Nº do Contrato"
                    inputOnChange={() =>
                      filtrarRequisicao(form.getState().values)
                    }
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="nome_produto"
                    placeholder="Pesquisar por Nome do Produto"
                    inputOnChange={() =>
                      filtrarRequisicao(form.getState().values)
                    }
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="nome_empresa"
                    placeholder="Pesquisar por Nome do Fornecedor"
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

export default TermosPorStatus;
