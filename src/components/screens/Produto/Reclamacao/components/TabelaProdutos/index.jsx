import React, { Component } from "react";
import "./style.scss";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

import ModalReclamacaoProduto from "../ModalReclamacaoProduto";
import Reclamacao from "../Reclamacao";
import { Link } from "react-router-dom";

export default class TabelaProdutos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostraModalReclamacao: false,
      escolasRequisicaoConcluida: false,
    };
  }

  abreModalReclamacao = () => {
    this.setState({ mostraModalReclamacao: true });
  };

  fechaModalReclamacao = () => {
    this.setState({ mostraModalReclamacao: false });
  };

  setEscolasRequisicaoConcluida = (concluido) => {
    this.setState({ escolasRequisicaoConcluida: concluido });
  };

  render() {
    const {
      listaProdutos,
      onAtualizarProduto,
      indiceProdutoAtivo,
      setIndiceProdutoAtivo,
      edital,
    } = this.props;
    const { mostraModalReclamacao, escolasRequisicaoConcluida } = this.state;
    return (
      <section className="resultados-busca-produtos-reclamacao">
        <div className="tabela-produto tabela-header-produto">
          <div>Nome do Produto</div>
          <div>Marca</div>
          <div>Tipo</div>
          <div>Qtde. Reclamações</div>
          <div>Data de cadastro</div>
          <div />
        </div>
        {listaProdutos.map((produto, indice) => {
          const isProdutoAtivo = indice === indiceProdutoAtivo;
          return (
            <div key={indice}>
              <div className="tabela-produto tabela-body-produto item-produto">
                <div>{produto.nome}</div>
                <div>{produto.marca.nome}</div>
                <div>
                  {produto.eh_para_alunos_com_dieta ? "D. Especial" : "Comum"}
                </div>
                <div>{produto.ultima_homologacao.reclamacoes.length}</div>
                <div>{produto.criado_em.split(" ")[0]}</div>
                <div className="botoes-produto">
                  <i
                    className={`fas fa-angle-${isProdutoAtivo ? "up" : "down"}`}
                    onClick={() => {
                      setIndiceProdutoAtivo(
                        isProdutoAtivo ? undefined : indice
                      );
                    }}
                  />
                </div>
              </div>
              {isProdutoAtivo && (
                <div className="container mt-3">
                  {produto.ultima_homologacao.reclamacoes.map(
                    (reclamacao, indice) => {
                      const deveMostrarBarraHorizontal =
                        indice <
                        produto.ultima_homologacao.reclamacoes.length - 1;
                      return [
                        <Reclamacao key={indice} reclamacao={reclamacao} />,
                        deveMostrarBarraHorizontal && <hr />,
                      ];
                    }
                  )}
                  <div className="botao-reclamacao mt-4">
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
                    <Botao
                      texto="Reclamação"
                      disabled={!escolasRequisicaoConcluida || !edital}
                      className="ms-3"
                      onClick={this.abreModalReclamacao}
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <ModalReclamacaoProduto
          showModal={mostraModalReclamacao}
          closeModal={this.fechaModalReclamacao}
          produto={listaProdutos[indiceProdutoAtivo]}
          onAtualizarProduto={onAtualizarProduto}
          setEscolasRequisicaoConcluida={this.setEscolasRequisicaoConcluida}
          edital={edital}
        />
      </section>
    );
  }
}
