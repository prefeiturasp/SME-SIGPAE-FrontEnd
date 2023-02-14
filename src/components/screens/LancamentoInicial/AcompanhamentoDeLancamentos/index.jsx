import React, { useContext, useEffect, useState } from "react";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import HTTP_STATUS from "http-status-codes";
import {
  getDashboardMedicaoInicial,
  getMesesAnosSolicitacoesMedicaoinicial
} from "services/medicaoInicial/dashboard.service";
import { CardMedicaoPorStatus } from "./components/CardMedicaoPorStatus";
import "./style.scss";
import { MEDICAO_CARD_NOME_POR_STATUS_DRE } from "./constants";
import { Spin } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { Paginacao } from "components/Shareable/Paginacao";
import { Field, Form } from "react-final-form";
import Select from "components/Shareable/Select";
import { MESES, TIPO_PERFIL } from "constants/shared";
import { getTiposUnidadeEscolar } from "services/cadastroTipoAlimentacao.service";
import MeusDadosContext from "context/MeusDadosContext";
import { getLotesSimples } from "services/lote.service";
import { getEscolasTrecTotal } from "services/escola.service";

export const AcompanhamentoDeLancamentos = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [statusSelecionado, setStatusSelecionado] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [mesesAnos, setMesesAnos] = useState(null);
  const [lotes, setLotes] = useState(null);
  const [tiposUnidades, setTiposUnidades] = useState(null);
  const [nomesEscolas, setNomesEscolas] = useState(null);

  const [erroAPI, setErroAPI] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingComFiltros, setLoadingComFiltros] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;
  const LOADING =
    !dadosDashboard ||
    !mesesAnos ||
    !tiposUnidades ||
    !lotes ||
    !nomesEscolas ||
    loading;

  const getDashboardMedicaoInicialAsync = async (params = null) => {
    setLoadingComFiltros(true);
    const response = await getDashboardMedicaoInicial(params);
    if (response.status === HTTP_STATUS.OK) {
      setDadosDashboard(response.data.results);
      if (statusSelecionado) {
        setResultados(
          response.data.results.find(res => res.status === statusSelecionado)
        );
      }
    } else {
      setErroAPI(
        "Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde."
      );
    }
    setLoading(false);
    setLoadingComFiltros(false);
  };

  useEffect(() => {
    const getMesesAnosSolicitacoesMedicaoinicialAsync = async () => {
      const response = await getMesesAnosSolicitacoesMedicaoinicial();
      if (response.status === HTTP_STATUS.OK) {
        setMesesAnos(response.data.results);
      } else {
        setErroAPI(
          "Erro ao carregar meses/anos das solicitações de medição inicial. Tente novamente mais tarde."
        );
      }
    };

    const getTiposUnidadeEscolarAsync = async () => {
      const response = await getTiposUnidadeEscolar();
      if (response.status === HTTP_STATUS.OK) {
        setTiposUnidades(response.data.results);
      } else {
        setErroAPI(
          "Erro ao carregar tipos de unidades. Tente novamente mais tarde."
        );
      }
    };

    getDashboardMedicaoInicialAsync();
    getMesesAnosSolicitacoesMedicaoinicialAsync();
    getTiposUnidadeEscolarAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const uuid = meusDados && meusDados.vinculo_atual.instituicao.uuid;

    const getLotesAsync = async () => {
      const response = await getLotesSimples({
        diretoria_regional__uuid: uuid
      });
      if (response.status === HTTP_STATUS.OK) {
        setLotes(response.data.results);
      } else {
        setErroAPI("Erro ao carregar lotes. Tente novamente mais tarde.");
      }
    };

    const getEscolasTrecTotalAsync = async () => {
      const response = await getEscolasTrecTotal(uuid);
      if (response.status === HTTP_STATUS.OK) {
        setNomesEscolas(
          response.data.map(escola => `${escola.codigo_eol} - ${escola.nome}`)
        );
      } else {
        setErroAPI("Erro ao carregar escolas. Tente novamente mais tarde.");
      }
    };

    meusDados && getLotesAsync();
    meusDados && getEscolasTrecTotalAsync();
  }, [meusDados]);

  const onPageChanged = async page => {
    setLoading(true);
    const params = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
    setCurrentPage(page);
    await getDashboardMedicaoInicialAsync(params);
    setLoading(false);
  };

  const getNomesItemsFiltrado = value => {
    if (value) {
      let value_ = value;
      if (localStorage.getItem("tipo_perfil") === TIPO_PERFIL.ESCOLA) {
        value_ = value[0];
      }
      return nomesEscolas.filter(a => a.includes(value_.toUpperCase()));
    }
    return [];
  };

  const onSubmit = values => {
    getDashboardMedicaoInicialAsync(values);
  };

  return (
    <div className="acompanhamento-de-lancamentos">
      {erroAPI && <div>{erroAPI}</div>}
      <Spin tip="Carregando..." spinning={LOADING}>
        {!erroAPI && !LOADING && (
          <div className="card mt-3">
            <div className="card-body">
              <div className="d-flex">
                {dadosDashboard.map((dadosPorStatus, key) => {
                  return (
                    <CardMedicaoPorStatus
                      key={key}
                      dados={dadosPorStatus}
                      page={currentPage}
                      onPageChanged={onPageChanged}
                      setResultados={setResultados}
                      setStatusSelecionado={setStatusSelecionado}
                      total={dadosPorStatus.total}
                      classeCor={
                        dadosPorStatus.total
                          ? MEDICAO_CARD_NOME_POR_STATUS_DRE[
                              dadosPorStatus.status
                            ].cor
                          : "cinza"
                      }
                    >
                      {
                        MEDICAO_CARD_NOME_POR_STATUS_DRE[dadosPorStatus.status]
                          .nome
                      }
                    </CardMedicaoPorStatus>
                  );
                })}
              </div>
              <div className="text-center mt-3">
                Selecione os status acima para visualizar a listagem detalhada
              </div>
              {statusSelecionado && (
                <>
                  <hr />
                  <Form onSubmit={onSubmit}>
                    {({ handleSubmit, form, values }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-4">
                            <Field
                              component={Select}
                              name="mes_ano"
                              label="Mês de referência"
                              options={[
                                { nome: "Selecione o mês", uuid: "" }
                              ].concat(
                                mesesAnos.map(mesAno => ({
                                  nome: `${MESES[parseInt(mesAno.mes) - 1]} - ${
                                    mesAno.ano
                                  }`,
                                  uuid: `${mesAno.mes}_${mesAno.ano}`
                                }))
                              )}
                              naoDesabilitarPrimeiraOpcao
                            />
                          </div>
                          <div className="col-4">
                            <label className="mb-2">Lote</label>
                            <Field
                              component={StatefulMultiSelect}
                              name="lotes"
                              selected={values.lotes_selecionados || []}
                              options={lotes.map(lote => ({
                                label: lote.nome,
                                value: lote.uuid
                              }))}
                              onSelectedChanged={values_ => {
                                form.change(`lotes_selecionados`, values_);
                              }}
                              disableSearch={true}
                              overrideStrings={{
                                selectSomeItems: "Selecione um ou mais lotes",
                                allItemsAreSelected:
                                  "Todos os lotes estão selecionados",
                                selectAll: "Todos"
                              }}
                            />
                          </div>
                          <div className="col-4">
                            <Field
                              component={Select}
                              name="tipo_unidade"
                              label="Tipo de unidade"
                              options={[
                                { nome: "Selecione o tipo de UE", uuid: "" }
                              ].concat(
                                tiposUnidades.map(tipoUnidade => ({
                                  nome: tipoUnidade.iniciais,
                                  uuid: tipoUnidade.uuid
                                }))
                              )}
                              naoDesabilitarPrimeiraOpcao
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-8">
                            <Field
                              dataSource={getNomesItemsFiltrado(values.escola)}
                              component={AutoCompleteField}
                              name="escola"
                              label="Unidade Educacional"
                              placeholder={"Digite um nome"}
                              className="input-busca-nome-item"
                            />
                          </div>
                          <div className="col-4 mt-auto text-right">
                            <Botao
                              type={BUTTON_TYPE.BUTTON}
                              onClick={() => form.reset()}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              texto="Limpar"
                              className="mr-3"
                            />
                            <Botao
                              type={BUTTON_TYPE.SUBMIT}
                              style={BUTTON_STYLE.GREEN}
                              texto="Filtrar"
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  </Form>
                </>
              )}
              <Spin tip="Carregando..." spinning={loadingComFiltros}>
                {resultados && (
                  <>
                    <div className="titulo-tabela mt-3 mb-3">Resultados</div>
                    <table className="resultados">
                      <thead>
                        <tr className="row">
                          <th className="col-6">Nome da UE</th>
                          <th className="col-2 text-center">Status</th>
                          <th className="col-2 text-center">
                            Última atualização
                          </th>
                          <th className="col-2 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultados.dados.map((dado, key) => {
                          return (
                            <tr key={key} className="row">
                              <td className="col-6 pt-3">{dado.escola}</td>
                              <td className="col-2 text-center pt-3">
                                {dado.status}
                              </td>
                              <td className="col-2 text-center pt-3">
                                {dado.log_mais_recente}
                              </td>
                              <td className="col-2 text-center">
                                <Botao
                                  type={BUTTON_TYPE.BUTTON}
                                  style={`${
                                    BUTTON_STYLE.GREEN_OUTLINE
                                  } no-border`}
                                  icon={BUTTON_ICON.EYE}
                                />
                                <Botao
                                  type={BUTTON_TYPE.BUTTON}
                                  style={`${
                                    BUTTON_STYLE.GREEN_OUTLINE
                                  } no-border`}
                                  icon={BUTTON_ICON.DOWNLOAD}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <Paginacao
                      onChange={page => onPageChanged(page)}
                      total={resultados.total}
                      pageSize={PAGE_SIZE}
                      current={currentPage}
                    />
                  </>
                )}
              </Spin>
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};
