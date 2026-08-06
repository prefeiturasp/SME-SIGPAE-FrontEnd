import React, { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import { Field } from "react-final-form";
import moment from "moment";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { InputText } from "src/components/Shareable/Input/InputText";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import {
  exportarExcelRelatorioFichasTecnicas,
  getRelatorioFichasTecnicas,
} from "src/services/fichaTecnica.service";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";
import { getListaCompletaProdutosLogistica } from "src/services/produto.service";
import { getEmpresasCronograma } from "src/services/terceirizada.service";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import "./styles.scss";

const CATEGORIA_CHOICES = [
  { label: "Perecíveis", value: "PERECIVEIS" },
  { label: "Não Perecíveis", value: "NAO_PERECIVEIS" },
  // FLV propositalmente omitido — não deve aparecer no relatório
];

const PROGRAMA_CHOICES = [
  { label: "Alimentação Escolar", value: "ALIMENTACAO_ESCOLAR" },
  { label: "Leve Leite", value: "LEVE_LEITE" },
];

const STATUS_CHOICES = [
  { label: "Aprovada", value: "APROVADA" },
  { label: "Enviada para Análise", value: "ENVIADA_PARA_ANALISE" },
  { label: "Enviada para Correção", value: "ENVIADA_PARA_CORRECAO" },
];

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [totalizadores, setTotalizadores] = useState(null);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const buscarResultados = async (pageNumber) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: pageNumber, ...filtros });
    try {
      const response = await getRelatorioFichasTecnicas(params);
      setFichas(response.data.results);
      setTotalizadores(response.data.totalizadores);
      setTotalResultados(response.data.count);
      setConsultaRealizada(true);
    } catch (error) {
      toastError(getMensagemDeErro(error.response?.status));
    } finally {
      setCarregando(false);
    }
  };

  const nextPage = (pageNumber) => {
    buscarResultados(pageNumber);
    setPage(pageNumber);
  };

  useEffect(() => {
    if (filtros) {
      buscarResultados(1);
      setPage(1);
    }
  }, [filtros]);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      await Promise.all([
        (async () => {
          const response = await getListaCompletaProdutosLogistica();
          setListaProdutos(response.data.results);
        })(),
        (async () => {
          const response = await getEmpresasCronograma();
          setFornecedores(
            response.data.results.map((fornecedor) => ({
              value: fornecedor.uuid,
              label: fornecedor.nome_fantasia,
            })),
          );
        })(),
      ]);
      setCarregando(false);
    })();
  }, []);

  const onSubmit = (values) => {
    const novosFiltros = { ...values };
    // Remove campos vazios
    Object.keys(novosFiltros).forEach(
      (key) =>
        (novosFiltros[key] === undefined ||
          novosFiltros[key] === null ||
          novosFiltros[key] === "" ||
          (Array.isArray(novosFiltros[key]) &&
            novosFiltros[key].length === 0)) &&
        delete novosFiltros[key],
    );
    setFiltros(novosFiltros);
  };

  const onClear = () => {
    setFichas([]);
    setConsultaRealizada(false);
    setFiltros({});
  };

  const baixarRelatorio = async () => {
    setEnviandoArquivo(true);
    try {
      const params = gerarParametrosConsulta(filtros);
      const response = await exportarExcelRelatorioFichasTecnicas(params);
      response?.status === 200 && setExibirModalCentralDownloads(true);
      centralDownloadContext.getQtdeDownloadsNaoLidas();
    } catch {
      toastError("Erro ao exportar. Tente novamente mais tarde.");
    } finally {
      setEnviandoArquivo(false);
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-relatorio-ficha-tecnica">
        <div className="card-body relatorio-ficha-tecnica">
          <div className="filtros-relatorio-ficha-tecnica">
            <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
              {(values) => (
                <div className="row">
                  <div className="col-6 mt-2">
                    <Field
                      component={AutoCompleteSelectField}
                      options={getListaFiltradaAutoCompleteSelect(
                        listaProdutos.map((p) => p.nome),
                        values?.nome_produto,
                        true,
                      )}
                      label="Produto"
                      name="nome_produto"
                      placeholder="Selecione um Produto"
                    />
                  </div>
                  <div className="col-6 mt-2">
                    <Field
                      label="Empresa"
                      component={MultiSelect}
                      name="empresa"
                      multiple
                      nomeDoItemNoPlural="empresas"
                      options={fornecedores}
                      placeholder="Selecione uma ou mais Empresas"
                    />
                  </div>
                  <div className="col-4 mt-2">
                    <Field
                      label="Categoria"
                      component={MultiSelect}
                      name="categoria"
                      multiple
                      nomeDoItemNoPlural="categorias"
                      options={CATEGORIA_CHOICES}
                      placeholder="Selecione uma Categoria"
                    />
                  </div>
                  <div className="col-4 mt-2">
                    <Field
                      label="Programa"
                      component={MultiSelect}
                      name="programa"
                      multiple
                      nomeDoItemNoPlural="programas"
                      options={PROGRAMA_CHOICES}
                      placeholder="Selecione um Programa"
                    />
                  </div>
                  <div className="col-4 mt-2">
                    <Field
                      component={InputText}
                      label="Nº de Pregão / Chamada Pública"
                      name="pregao"
                      placeholder="Digite o Nº de Pregão / Chamada Pública"
                    />
                  </div>
                  <div className="col-4 mt-2">
                    <Field
                      component={MultiSelect}
                      disableSearch
                      options={STATUS_CHOICES}
                      label="Status"
                      name="status"
                      multiple
                      nomeDoItemNoPlural="Status"
                      placeholder="Selecione os status"
                    />
                  </div>
                </div>
              )}
            </CollapseFiltros>
          </div>

          {consultaRealizada && (
            <>
              {totalizadores && (
                <div className="row mt-4">
                  <div className="col-12 titulo-cards">
                    TOTAL DE FICHAS TÉCNICAS - ATÉ{" "}
                    {moment(new Date()).format("DD/MM/YYYY")}
                  </div>
                  {Object.keys(totalizadores).map((totalizador, key) => (
                    <div key={key} className="col-4 mt-3">
                      <div className="totalizador ps-3 pe-3">
                        <div className="d-flex justify-content-between">
                          <div className="titulo">{totalizador}</div>
                          <div className="valor">
                            {totalizadores[totalizador]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {fichas.length === 0 ? (
                <div className="text-center mt-4 mb-4">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <>
                  <div className="titulo-verde mt-4 mb-3">
                    Resultado da Pesquisa
                  </div>
                  <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Produto</th>
                          <th scope="col">Empresa</th>
                          <th scope="col">Categoria</th>
                          <th scope="col">Programa</th>
                          <th scope="col">Nº de Pregão / Chamada Pública</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fichas.map((ficha) => (
                          <tr key={ficha.uuid}>
                            <td>{ficha.produto?.nome || "-"}</td>
                            <td>{ficha.empresa?.nome_fantasia || "-"}</td>
                            <td>{ficha.categoria || "-"}</td>
                            <td>{ficha.programa || "-"}</td>
                            <td>{ficha.pregao_chamada_publica || "-"}</td>
                            <td>{ficha.status || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="row">
                    <div className="col">
                      <Paginacao
                        current={page}
                        total={totalResultados}
                        onChange={nextPage}
                      />
                    </div>
                  </div>

                  <div className="row mt-4 mb-2">
                    <div className="col p-0">
                      <Botao
                        texto="Baixar em Excel"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.FILE_EXCEL}
                        type={BUTTON_TYPE.BUTTON}
                        disabled={enviandoArquivo}
                        onClick={baixarRelatorio}
                        className="float-end"
                      />
                      {exibirModalCentralDownloads && (
                        <ModalSolicitacaoDownload
                          show={exibirModalCentralDownloads}
                          setShow={setExibirModalCentralDownloads}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
