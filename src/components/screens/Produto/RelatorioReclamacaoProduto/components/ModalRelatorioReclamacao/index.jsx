import React, { useState } from "react";
import { Spin } from "antd";
import { Modal } from "antd";
import Botao from "src/components/Shareable/Botao";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getProdutosReclamacoes } from "src/services/produto.service";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { getRelatorioReclamacao } from "src/services/relatorios.service";
import { getConfigCabecario } from "./helpers";
import Reclamacao from "./Reclamacao";
import { Paginacao } from "src/components/Shareable/Paginacao";

const ModalRelatorioReclamacao = ({
  showModal,
  closeModal,
  produtos,
  setProdutos,
  produtosCount,
  filtros,
  pageSize,
  page,
  setPage,
}) => {
  const configCabecario = getConfigCabecario(filtros, produtos);
  const [carregando, setCarregando] = useState(false);

  const nextPage = (page) => {
    setCarregando(true);
    setPage(page);
    const params = gerarParametrosConsulta({
      ...filtros,
      page: page,
      page_size: pageSize,
    });
    getProdutosReclamacoes(params).then((response) => {
      setProdutos(response.data.results);
      setCarregando(false);
    });
  };

  return (
    <Modal
      visible={showModal}
      title="Relatório de acompanhamento de reclamação de produto"
      onCancel={closeModal}
      width={"95%"}
      className="modal-acompanhamento-reclamacao-produto"
      footer={[
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
        />,
        <Botao
          key={1}
          texto="Voltar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.ARROW_LEFT}
          onClick={closeModal}
        />,
        <Botao
          key={2}
          type={BUTTON_TYPE.BUTTON}
          texto="Imprimir"
          style={BUTTON_STYLE.GREEN}
          icon={BUTTON_ICON.PRINT}
          onClick={() => {
            const params = gerarParametrosConsulta({
              ...filtros,
              ...configCabecario,
            });
            getRelatorioReclamacao(params);
          }}
        />,
      ]}
    >
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="body-modal">
          <div className="header-modal">{configCabecario.titulo}</div>
          <div className="section-produtos-itens-relatorio">
            <div className="item-produto-modal">
              <div className="item-header-produto-modal">
                <div className="item-grid-produto">
                  <div>Nome do Produto</div>
                  <div>Marca</div>
                  <div>Fabricante</div>
                  <div>Data de cadastro </div>
                  <div>Qtde. Reclamações </div>
                  <div>Status do produto</div>
                </div>

                {produtos !== null &&
                  produtos.map((produto) => {
                    return (
                      <>
                        <div className="item-grid-produto item-prod-detalhe">
                          <div>{produto.nome}</div>
                          <div>{produto.marca.nome}</div>
                          <div>{produto.fabricante.nome}</div>
                          <div>{produto.criado_em.split(" ")[0]}</div>
                          <div>
                            {produto.ultima_homologacao.reclamacoes.length}
                          </div>
                          <div>{produto.ultima_homologacao.status_titulo}</div>
                        </div>
                        {produto.ultima_homologacao.reclamacoes.map(
                          (reclamacao, index, arr) => {
                            const deveMostrarBarraHorizontal =
                              index < arr.length - 1;
                            return (
                              <>
                                <Reclamacao
                                  key={index}
                                  reclamacao={reclamacao}
                                />
                                {deveMostrarBarraHorizontal && <hr />}
                              </>
                            );
                          }
                        )}
                        <hr />
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalRelatorioReclamacao;
