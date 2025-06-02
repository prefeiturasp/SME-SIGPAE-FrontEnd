import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import React, { useContext, useEffect, useState } from "react";
import { getInitalState } from "src/components/Shareable/FormBuscaProduto/helper";
import {
  gerarExcelRelatorioProdutosHomologados,
  getNomesUnicosEditais,
} from "src/services/produto.service";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import FormBuscaProduto from "src/components/Shareable/FormBuscaProduto";
import { gerarParametrosConsulta } from "src/helpers/utilities";

import TabelaAgrupadaProdutosTerceirizadas from "./TabelaAgrupadaProdutosTerceirizadas";
import {
  getProdutosPorTerceirizada,
  getPDFRelatorioProdutosHomologados,
} from "src/services/produto.service";

import "./style.scss";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { formataParams } from "./helper";

const RelatorioProdutosHomologados = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [dadosProdutos, setDadosProdutos] = useState(null);
  const [quantidadeHomologados, setQuantidadeHomologados] = useState(null);
  const [quantidadeMarcas, setQuantidadeMarcas] = useState(null);
  const [filtros, setFiltros] = useState(null);
  const [valoresIniciais, setValoresIniciais] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [erroAPI, setErroAPI] = useState("");

  useEffect(() => {
    const getValoresIniciaisAsync = async () => {
      let responseEditais = await getNomesUnicosEditais();
      let instituicaoNome = meusDados.vinculo_atual.instituicao.nome;
      let valores = getInitalState(
        responseEditais.data.results,
        instituicaoNome
      );
      setValoresIniciais(valores);
      setCarregando(false);
    };

    meusDados && getValoresIniciaisAsync();
  }, [meusDados]);

  const getProdutosHomologados = async (filtros_ = filtros) => {
    setCarregando(true);
    const response = await getProdutosPorTerceirizada(formataParams(filtros_));
    if (response.status === HTTP_STATUS.OK) {
      setDadosProdutos(response.data.results);
      setQuantidadeHomologados(response.data.count);
      setQuantidadeMarcas(response.data.total_marcas);
    } else {
      setErroAPI(
        "Erro ao carregar produtos homologados. Tente novamente mais tarde."
      );
    }
    setCarregando(false);
  };

  const onSubmitForm = async (formValues) => {
    setFiltros(formValues);
    await getProdutosHomologados(formValues);
  };

  const exportarXLSX = async (params) => {
    setExportando(true);
    const response = await gerarExcelRelatorioProdutosHomologados(params);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar xlsx. Tente novamente mais tarde.");
    }
    setExportando(false);
  };

  const exportarPDF = async (params) => {
    setExportando(true);
    const response = await getPDFRelatorioProdutosHomologados(params);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
    setExportando(false);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 page-relatorio-produtos-homologados">
        <div className="card-body">
          {erroAPI && <>{erroAPI}</>}
          {!erroAPI && (
            <>
              {valoresIniciais && (
                <FormBuscaProduto
                  onSubmit={onSubmitForm}
                  onAtualizaProdutos={() => {}}
                  onLimparDados={() => {
                    setDadosProdutos(null);
                  }}
                  valoresIniciais={valoresIniciais}
                  setErroAPI={setErroAPI}
                />
              )}

              {quantidadeHomologados > 0 && !carregando && (
                <div className="row">
                  <div className="col-12 mt-3 ">
                    <p className="quantitativo">
                      QUANTITATIVO DE PRODUTOS HOMOLOGADOS DO EDITAL
                    </p>
                  </div>
                  <div className="col-12 mt-1">
                    <p className="totalHomologadosValor">
                      Total de produtos homologados:{" "}
                      <b>{quantidadeHomologados}</b>
                      <span className="ms-5">
                        Total de marcas homologadas: <b>{quantidadeMarcas}</b>{" "}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {filtros && dadosProdutos && dadosProdutos.length > 0 && (
                <div className="mt-3">
                  <p className="resultadoTitle">Resultado detalhado</p>
                  <TabelaAgrupadaProdutosTerceirizadas
                    dadosProdutos={dadosProdutos}
                    quantidadeHomologados={quantidadeHomologados}
                    getProdutosHomologados={getProdutosHomologados}
                    filtros={filtros}
                  />
                  <hr />
                  <div className="row">
                    <div className="col-12 text-end">
                      <Botao
                        texto="Exportar Excel"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.FILE_EXCEL}
                        type={BUTTON_TYPE.BUTTON}
                        disabled={exportando}
                        onClick={() => {
                          exportarXLSX(formataParams(filtros));
                        }}
                        className="me-3"
                      />
                      {exibirModalCentralDownloads && (
                        <ModalSolicitacaoDownload
                          show={exibirModalCentralDownloads}
                          setShow={setExibirModalCentralDownloads}
                        />
                      )}
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        titulo="Imprimir"
                        texto="Imprimir"
                        style={BUTTON_STYLE.GREEN}
                        icon={BUTTON_ICON.PRINT}
                        onClick={async () => {
                          const params = gerarParametrosConsulta(
                            formataParams(filtros)
                          );
                          setCarregando(true);
                          await exportarPDF(params);
                          setCarregando(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {dadosProdutos && dadosProdutos.length === 0 && (
                <div className="mt-5">
                  Não existem dados para filtragem informada.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default RelatorioProdutosHomologados;
