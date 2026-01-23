import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { Link } from "react-router-dom";
import Reclamacao from "src/components/screens/Produto/Reclamacao/components/Reclamacao";
import ModalJustificativa from "src/components/Shareable/ModalJustificativa";

import {
  responderQuestionamentoNutrisupervisor,
  filtrarReclamacoesNutrisupervisor,
} from "src/services/reclamacaoProduto.service";

import { ordenaPorCriadoEm } from "./helpers";
import "./styles.scss";

const TabelaProdutos = ({
  produtos,
  exibirModal,
  setExibirModal,
  setCarregando,
  filtros,
  setTotal,
  setProdutos,
  setShowBuscaVazia,
  filtradoPorParametro,
}) => {
  const [indiceProdutoAtivo, setIndiceProdutoAtivo] = useState();
  const [uuid, setUuid] = useState();
  const [produtoSelecionado, setProdutoSelecionado] = useState();

  const onSubmit = async (formValues) => {
    setCarregando(true);
    setExibirModal(false);
    const response = await responderQuestionamentoNutrisupervisor(
      formValues,
      uuid,
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Resposta enviada com sucesso");
    } else {
      toastError("Houve um erro ao enviar resposta");
    }
    updateResult();
  };

  const updateResult = async () => {
    setProdutos(undefined);
    const updated_result = await filtrarReclamacoesNutrisupervisor(filtros);
    if (updated_result.count > 0) {
      setProdutos(updated_result.results);
      setTotal(updated_result.count);
      setShowBuscaVazia(false);
    } else {
      setShowBuscaVazia(true);
    }
    setCarregando(false);
  };

  useEffect(() => {
    if (filtradoPorParametro) {
      setIndiceProdutoAtivo(0);
    }
  }, [filtradoPorParametro]);

  return (
    <>
      <div className="row">
        <div className="col-12 mt-3 mb-2">Veja os resultados para a busca:</div>
      </div>
      <section className="resultados-busca-questionamentos-ue">
        <div className="tabela-produto-ue tabela-header-produto-ue">
          <div>Nome do Produto</div>
          <div>Marca</div>
          <div>Fabricante</div>
          <div>Qtde. Reclamações</div>
          <div>Data de cadastro</div>
          <div />
        </div>
        {produtos &&
          produtos.map((produto, indice) => {
            const isProdutoAtivo = indice === indiceProdutoAtivo;
            return (
              <div key={indice}>
                <div className="tabela-produto-ue tabela-body-produto-ue item-produto-ue">
                  <div>{produto.nome}</div>
                  <div>{produto.marca.nome}</div>
                  <div>{produto.fabricante.nome}</div>
                  <div>{produto.ultima_homologacao.reclamacoes.length}</div>
                  <div className="com-botao">
                    {produto.criado_em.split(" ")[0]}
                  </div>
                  <div className="com-botao botoes-produto">
                    <i
                      className={`fas fa-angle-${
                        isProdutoAtivo ? "up" : "down"
                      }`}
                      onClick={() => {
                        setIndiceProdutoAtivo(
                          indice === indiceProdutoAtivo ? undefined : indice,
                        );
                      }}
                    />
                  </div>
                </div>
                {isProdutoAtivo && (
                  <div className="container">
                    <div className="botao-ver-produto mt-4">
                      <Link
                        to={`/gestao-produto/relatorio?uuid=${produto.ultima_homologacao.uuid}`}
                      >
                        <Botao
                          texto="Ver produto"
                          className="ms-3"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      </Link>
                    </div>
                    <hr />
                    {produto.ultima_homologacao.reclamacoes
                      .sort(ordenaPorCriadoEm)
                      .map((reclamacao) => {
                        const desabilitarResponder =
                          reclamacao.status === "RESPONDIDO_NUTRISUPERVISOR";
                        return (
                          <div key={reclamacao.uuid}>
                            <Reclamacao reclamacao={reclamacao} />
                            <div className="row">
                              <div className="col-12">
                                <div className="botao-responder mb-4">
                                  <Botao
                                    texto="Responder"
                                    type={BUTTON_TYPE.BUTTON}
                                    style={BUTTON_STYLE.GREEN}
                                    onClick={() => {
                                      setUuid(reclamacao.uuid);
                                      setProdutoSelecionado(produto);
                                      setExibirModal(true);
                                    }}
                                    disabled={desabilitarResponder}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        <ModalJustificativa
          titulo="Responder Questionamento da CODAE"
          state={{
            acao: "resposta_nutrisupervisor",
            uuidReclamacao: uuid,
            produto: produtoSelecionado,
          }}
          labelJustificativa="Responder"
          showModal={exibirModal}
          closeModal={() => setExibirModal(false)}
          onSubmit={onSubmit}
          comAnexo={true}
          produto={produtoSelecionado}
        />
      </section>
    </>
  );
};

export default TabelaProdutos;
