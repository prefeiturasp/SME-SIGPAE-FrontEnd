import { Spin } from "antd";
import { Dispatch, useState } from "react";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { deepCopy } from "src/helpers/utilities";
import {
  getGeraExcelRelatorioReclamacao,
  getGeraPdfRelatorioReclamacao,
} from "src/services/relatorios.service";
import { IFormValues } from "../../interfaces";
import { formatarValues } from "../Filtros/helpers";
import { Reclamacao } from "./components/Reclamacao";
import "./style.scss";
import HTTP_STATUS from "http-status-codes";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";

type ITabelaProps = {
  produtos: Array<any>;
  setProdutos: Dispatch<(_prevState: undefined) => undefined>;
  loadingTabela: boolean;
  produtosCount: number;
  page: number;
  setPage: (_page: number) => void;
  consultarProdutos: (_values: IFormValues, _page: number) => void;
  values: IFormValues;
};

export const Tabela = ({ ...props }: ITabelaProps) => {
  const {
    produtos,
    setProdutos,
    loadingTabela,
    produtosCount,
    page,
    setPage,
    values,
    consultarProdutos,
  } = props;

  const [baixandoExcel, setBaixandoExcel] = useState(false);
  const [baixandoPDF, setBaixandoPDF] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const setCollapse = (key: number) => {
    const copyProdutos = deepCopy(produtos);
    copyProdutos[key].collapsed = !copyProdutos[key].collapsed;
    setProdutos(copyProdutos);
  };

  const nextPage = (page: number) => {
    consultarProdutos(values, page);
    setPage(page);
  };

  const handleBaixarPDF = async (values: IFormValues) => {
    setBaixandoPDF(true);
    const values_ = formatarValues(values);
    const response = await getGeraPdfRelatorioReclamacao({ ...values_ });
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao baixar PDF. Tente novamente mais tarde");
    }
    setBaixandoPDF(false);
  };

  const handleBaixarExcel = async (values: IFormValues) => {
    setBaixandoExcel(true);
    const values_ = formatarValues(values);
    const response = await getGeraExcelRelatorioReclamacao({ ...values_ });
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao baixar Excel. Tente novamente mais tarde");
    }
    setBaixandoExcel(false);
  };

  return (
    <div className="tabela-relatorio-reclamacoes-produto">
      <Spin tip="Carregando tabela..." spinning={loadingTabela}>
        {produtos?.length > 0 && (
          <>
            <div className="titulo mt-5">
              Resultado da pesquisa - TOTAL DE PRODUTOS COM RECLAMAÇÕES:{" "}
              <span>{produtosCount}</span>
            </div>
            <table className="mt-3">
              <thead>
                <tr>
                  <th>Editais</th>
                  <th>Nome do Produto</th>
                  <th>Marca</th>
                  <th>Fabricante</th>
                  <th>Reclamações</th>
                  <th>Status Produto</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, key: number) => {
                  return [
                    <tr key={key}>
                      <td>
                        {produto.ultima_homologacao.editais_reclamacoes.join(
                          ", "
                        )}
                      </td>
                      <td>{produto.nome}</td>
                      <td>{produto.marca.nome}</td>
                      <td>{produto.fabricante.nome}</td>
                      <td>{produto.ultima_homologacao.reclamacoes.length}</td>
                      <td>{produto.ultima_homologacao.status_titulo}</td>
                      <td
                        className="text-center"
                        onClick={() => setCollapse(key)}
                      >
                        <i
                          data-testid={`i-collapsed-${key}`}
                          className={
                            produto.collapsed
                              ? "fas fa-chevron-up"
                              : "fas fa-chevron-down"
                          }
                        />
                      </td>
                    </tr>,
                    produto.collapsed &&
                      produto.ultima_homologacao.reclamacoes.map(
                        (reclamacao, index: number) => {
                          return (
                            <tr className="reclamacoes">
                              <td colSpan={7}>
                                <Reclamacao
                                  key={index}
                                  reclamacao={reclamacao}
                                />
                              </td>
                            </tr>
                          );
                        }
                      ),
                  ];
                })}
              </tbody>
            </table>
            <div className="row">
              <div className="col">
                <Paginacao
                  className="mt-3 mb-3"
                  current={page}
                  total={produtosCount}
                  showSizeChanger={false}
                  onChange={nextPage}
                  pageSize={10}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-end">
                <Botao
                  className="me-3"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  disabled={baixandoExcel}
                  icon={!baixandoExcel && BUTTON_ICON.FILE_EXCEL}
                  texto={
                    baixandoExcel ? (
                      <img
                        src="/assets/image/ajax-loader.gif"
                        alt="ajax-loader"
                      />
                    ) : (
                      "Baixar Excel"
                    )
                  }
                  onClick={() => handleBaixarExcel(values)}
                />
                <Botao
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  disabled={baixandoPDF}
                  icon={!baixandoPDF && BUTTON_ICON.PRINT}
                  texto={
                    baixandoPDF ? (
                      <img
                        src="/assets/image/ajax-loader.gif"
                        alt="ajax-loader"
                      />
                    ) : (
                      "Baixar PDF"
                    )
                  }
                  onClick={() => handleBaixarPDF(values)}
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
        {produtos?.length === 0 && (
          <div className="mt-3">
            Não foram encontrados resultados para estes filtros.
          </div>
        )}
      </Spin>
    </div>
  );
};
