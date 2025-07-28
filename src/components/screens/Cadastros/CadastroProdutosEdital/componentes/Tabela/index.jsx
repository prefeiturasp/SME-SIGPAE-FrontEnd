import React, { Fragment, useState } from "react";
import "./style.scss";
import { FormOutlined } from "@ant-design/icons";
import ModalCadastrarProdutosEdital from "src/components/Shareable/ModalCadastrarProdutosEdital";

export default ({ resultado, changePage, fetchData }) => {
  const [selecionado, setSelecionado] = useState(undefined);
  const [showModal, setShowModal] = useState(false);

  const openModal = (produto) => {
    setSelecionado(produto);
    setShowModal(true);
  };

  return (
    <>
      {resultado.length === 0 ? (
        <div className="row">
          <div className="col-12 text-center">Nenhum resultado encontrado</div>
        </div>
      ) : (
        <div className="row" data-testid="tabela-produtos-edital">
          <div className="col-12">
            <p>
              <b>Produtos Cadastrados</b>
            </p>
          </div>
          <div className="col-12">
            <table className="table table-bordered table-produtos">
              <thead>
                <tr className="table-head-produtos">
                  <th className="nome">Nome do Produto</th>
                  <th className="tipo">Status</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {resultado.map((produto, idx) => {
                  return (
                    <Fragment key={idx}>
                      <tr className="table-body-produtos">
                        <td>{produto.nome}</td>
                        <td>{produto.status}</td>
                        <td className="acoes">
                          <button
                            className="botaoEditar me-2"
                            onClick={() => openModal(produto)}
                          >
                            <FormOutlined className="me-1" />
                            Editar
                          </button>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ModalCadastrarProdutosEdital
        closeModal={() => setShowModal(false)}
        showModal={showModal}
        produto={selecionado}
        changePage={() => changePage()}
        onFinish={fetchData}
      />
    </>
  );
};
