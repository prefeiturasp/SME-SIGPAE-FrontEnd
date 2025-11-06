import "./styles.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ADICIONAR_PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
  EDITAR_PARAMETRIZACAO_FINANCEIRA,
} from "src/configs/constants";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Spin } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import Filtros from "./AdicionarParametrizacaoFinanceira/components/Filtros";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  GrupoUnidadeEscolar,
  ParametrizacaoFinanceiraInterface,
  ParametrizacaoFinanceiraParams,
  ParametrizacaoFinanceiraResponse,
  TipoUnidade,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";

export default () => {
  const navigate = useNavigate();

  const [responseParametrizacoes, setResponseParametrizacoes] =
    useState<ParametrizacaoFinanceiraResponse>();
  const [parametrizacoes, setParametrizacoes] = useState<
    ParametrizacaoFinanceiraInterface[]
  >([]);
  const [erroAPI, setErroAPI] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtros, setFiltros] = useState<ParametrizacaoFinanceiraParams>();
  const [carregando, setCarregando] = useState(false);

  const getParametrizacoes = async (
    page: number | null = null,
    filtros: ParametrizacaoFinanceiraParams = null,
  ) => {
    setCarregando(true);
    try {
      const response =
        await ParametrizacaoFinanceiraService.getParametrizacoesFinanceiras(
          page,
          filtros,
        );
      setResponseParametrizacoes(response);
      setParametrizacoes(response.results);
    } catch {
      setErroAPI(
        "Erro ao carregar parametrizações financeiras. Tente novamente mais tarde.",
      );
    } finally {
      setCarregando(false);
    }
  };

  const formataTiposUnidades = (grupo: GrupoUnidadeEscolar) => {
    return grupo.tipos_unidades.map((e: TipoUnidade) => e.iniciais).join(", ");
  };

  const onChangePage = async (
    page: number,
    filtros: ParametrizacaoFinanceiraParams,
  ) => {
    setPaginaAtual(page);
    await getParametrizacoes(page, filtros);
  };

  useEffect(() => {
    getParametrizacoes();
  }, []);

  return (
    <div className="parametrizacao-financeira">
      {erroAPI && <div>{erroAPI}</div>}
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="card mt-4">
          <div className="card-body">
            <CollapseFiltros
              onSubmit={async (values: ParametrizacaoFinanceiraParams) => {
                setFiltros(values);
                onChangePage(1, values);
              }}
              onClear={() => {
                setFiltros({});
                onChangePage(1, {});
              }}
              titulo="Filtrar Resultados"
            >
              {() => <Filtros />}
            </CollapseFiltros>

            <div className="mt-4">
              <Botao
                texto="Adicionar Parametrização"
                titulo="Adicionar Parametrização"
                className="mt-4"
                onClick={() => navigate(ADICIONAR_PARAMETRIZACAO_FINANCEIRA)}
                style={BUTTON_STYLE.GREEN}
                type={BUTTON_TYPE.BUTTON}
              />

              {parametrizacoes.length === 0 && !carregando ? (
                <div className="text-center mt-4 mb-4">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <div className="tabela mt-4 mb-4">
                  <div className="titulo-tabela mt-5 mb-3">
                    Parametrizações Cadastradas
                  </div>

                  <table>
                    <thead>
                      <tr className="row">
                        <th className="col-3">Edital</th>
                        <th className="col-4">DRE</th>
                        <th className="col-1">Lote</th>
                        <th className="col-3">Tipo de Unidade</th>
                        <th className="col-1"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {parametrizacoes.map((parametrizacao) => (
                        <tr className="row" key={parametrizacao.uuid}>
                          <td className="col-3">
                            {parametrizacao.edital.numero}
                          </td>
                          <td className="col-4">{parametrizacao.dre}</td>
                          <td className="col-1">{parametrizacao.lote.nome}</td>
                          <td className="col-3">
                            {formataTiposUnidades(
                              parametrizacao.grupo_unidade_escolar,
                            )}
                          </td>
                          <td className="col-1 d-flex justify-content-center align-item-center">
                            <Link
                              to={`/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/${EDITAR_PARAMETRIZACAO_FINANCEIRA}/?uuid=${parametrizacao.uuid}`}
                            >
                              <span className="px-2">
                                <i
                                  title="Editar Parametrização"
                                  className="verde fas fa-edit"
                                />
                              </span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginacao
                    onChange={(page: number) => onChangePage(page, filtros)}
                    total={responseParametrizacoes?.count}
                    pageSize={responseParametrizacoes?.page_size}
                    current={paginaAtual}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};
