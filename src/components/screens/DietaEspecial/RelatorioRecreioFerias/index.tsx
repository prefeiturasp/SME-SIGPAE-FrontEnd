import HTTP_STATUS from "http-status-codes";
import { useContext, useState } from "react";
import {
  gerarExcelRelatorioRecreioFerias,
  gerarPdfRelatorioRecreioFerias,
  getRelatorioRecreioFerias,
} from "src/services/dietaEspecial.service";
import { Tabela } from "./components/Tabela";
import { IRelatorioDietaRecreioFerias } from "./interfaces";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Filtros } from "./components/Filtros";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { normalizarValores } from "./helpers";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";

export const RelatorioRecreioFerias = () => {
  const [dietas, setDietas] = useState<IRelatorioDietaRecreioFerias[] | null>(
    null
  );
  const [erro, setErro] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [valuesForm, setValuesForm] = useState<object>(null);
  const { meusDados } = useContext(MeusDadosContext);

  const getRelatorioRecreioFeriasAsync = async (values: object) => {
    const params = normalizarValores(values, page);
    const response = await getRelatorioRecreioFerias(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietas(
        response.data.results.map((obj: IRelatorioDietaRecreioFerias) => ({
          ...obj,
          collapsed: false,
        }))
      );
      setTotal(response.data.count);
    } else {
      setErro(
        "Erro ao carregar relatório de dietas recreio nas férias. Tente novamente mais tarde."
      );
      setDietas(null);
      setTotal(0);
    }
  };

  const buscaResultado = async (params: object) => {
    setLoading(true);
    await getRelatorioRecreioFeriasAsync(params);
    setLoading(false);
  };

  const nextPage = (page: number) => {
    buscaResultado({ ...valuesForm, page: page });
    setPage(page);
  };

  const exportarPDF = async (values: object) => {
    setLoadingPdf(true);
    const response = await gerarPdfRelatorioRecreioFerias(
      normalizarValores(values)
    );
    if (response.status === HTTP_STATUS.OK)
      setExibirModalCentralDownloads(true);
    else toastError("Erro ao baixar PDF, tente novamente mais tarde.");
    setLoadingPdf(false);
  };

  const exportarExcel = async (values: object) => {
    setLoadingExcel(true);
    const response = await gerarExcelRelatorioRecreioFerias(
      normalizarValores(values)
    );
    if (response.status === HTTP_STATUS.OK)
      setExibirModalCentralDownloads(true);
    else toastError("Erro ao baixar Excel, tente novamente mais tarde.");
    setLoadingExcel(false);
  };

  return (
    <div className="relatorio-recreio-nas-ferias">
      <Spin tip="Carregando..." spinning={loading}>
        {erro && <div>{erro}</div>}
        {!erro && (
          <div className="card mt-3">
            <div className="card-body">
              <Filtros
                meusDados={meusDados}
                setDietas={setDietas}
                setValuesForm={setValuesForm}
                carregaDietas={getRelatorioRecreioFeriasAsync}
                setErro={setErro}
                setPage={setPage}
              />
              {dietas && (
                <>
                  <Tabela dietas={dietas} setDietas={setDietas} total={total} />
                  <div className="row">
                    <div className="col">
                      <Paginacao
                        className="mt-3 mb-3"
                        current={page}
                        total={total}
                        showSizeChanger={false}
                        onChange={nextPage}
                        pageSize={10}
                      />
                    </div>
                  </div>
                  {total === 0 && (
                    <div className="text-center mt-5">
                      Nenhum resultado encontrado
                    </div>
                  )}
                  {total > 0 && (
                    <div className="row">
                      <div className="col-12 text-end">
                        <Botao
                          dataTestId="botao-gerar-excel"
                          texto="Baixar Excel"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN}
                          icon={BUTTON_ICON.FILE_EXCEL}
                          onClick={() => exportarExcel(valuesForm)}
                          disabled={loadingExcel}
                        />
                        <Botao
                          dataTestId="botao-gerar-pdf"
                          texto="Baixar PDF"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN}
                          icon={BUTTON_ICON.FILE_PDF}
                          onClick={() => exportarPDF(valuesForm)}
                          className="ms-3"
                          disabled={loadingPdf}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {exibirModalCentralDownloads && (
          <ModalSolicitacaoDownload
            show={exibirModalCentralDownloads}
            setShow={setExibirModalCentralDownloads}
            callbackClose={() => {}}
          />
        )}
      </Spin>
    </div>
  );
};
