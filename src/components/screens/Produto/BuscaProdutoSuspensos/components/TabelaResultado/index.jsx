import React, { Fragment, useState } from "react";
import {
  getProdutosRelatorioSuspenso,
  relatorioProdutosSuspensosPDF,
} from "src/services/produto.service";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Spin } from "antd";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";

const TabelaResultado = ({
  produtosCount,
  filtros,
  produtos,
  setProdutos,
  pageSize,
  setPage,
  page,
}) => {
  const [carregando, setCarregando] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const handleClickDownload = async () => {
    const response = await relatorioProdutosSuspensosPDF(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
  };

  const nextPage = (page) => {
    setCarregando(true);
    setPage(page);
    const params = gerarParametrosConsulta({
      ...filtros,
      page: page,
      page_size: pageSize,
    });
    getProdutosRelatorioSuspenso(params).then((response) => {
      setProdutos(response.data.results);
      setCarregando(false);
    });
  };

  return (
    <div className="card-body">
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="row">
          <div className="col-12">
            <p>Resultado detalhado</p>
          </div>
          <div className="col-12">
            <table className="table table-bordered table-items">
              <thead>
                <tr className="table-head-items">
                  <th>Produto</th>
                  <th>Marca</th>
                  <th>Edital</th>
                  <th>Tipo</th>
                  <th>Cadastro</th>
                  <th>Suspensão</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, idx) => {
                  return (
                    <Fragment key={idx}>
                      <tr className="table-body-items">
                        <td>{produto.nome}</td>
                        <td>{produto.marca}</td>
                        <td>{produto.edital.nome}</td>
                        <td>{produto.edital.tipo}</td>
                        <td>{produto.data_cadastro}</td>
                        <td>{produto.edital.data_suspensao}</td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col-12">
            <Paginacao
              className="mt-3 mb-3"
              key={0}
              current={page}
              total={produtosCount}
              showSizeChanger={false}
              onChange={(page) => {
                nextPage(page);
              }}
              pageSize={pageSize}
            />
          </div>
          <div className="col-12">
            <Botao
              texto="Exportar PDF"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => handleClickDownload()}
            />
          </div>
          <ModalSolicitacaoDownload
            show={exibirModalCentralDownloads}
            setShow={setExibirModalCentralDownloads}
          />
        </div>
      </Spin>
    </div>
  );
};

export default TabelaResultado;
