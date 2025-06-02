import React, { Component } from "react";

import AutoCompleteFieldUnaccent from "src/components/Shareable/AutoCompleteField/unaccent";
import "./style.scss";
import { Form, Field } from "react-final-form";

import { podeEditarProduto } from "./helpers";

import {
  getNomesUnicosProdutos,
  getNomesUnicosMarcas,
  getNomesUnicosFabricantes,
} from "../../../../../services/produto.service";
import { getProdutosListagem } from "src/services/produto.service";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../Shareable/Botao/constants";
import Botao from "../../../../Shareable/Botao";
import { Link } from "react-router-dom";

export default class BuscaProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nomesProdutos: null,
      nomesMarcas: null,
      nomesFabricantes: null,

      resultadosProduto: [],
    };
  }

  retornaListaDeNomes = (arrayObjetos) => {
    let arrayNomes = [];
    arrayObjetos.forEach((objeto) => {
      arrayNomes.push(objeto.nome);
    });
    return arrayNomes;
  };

  componentDidUpdate = async () => {
    const { nomesProdutos, nomesMarcas, nomesFabricantes } = this.state;
    if (
      nomesProdutos === null &&
      nomesMarcas === null &&
      nomesFabricantes === null
    ) {
      const produtos = await getNomesUnicosProdutos();
      const marcas = await getNomesUnicosMarcas();
      const fabricantes = await getNomesUnicosFabricantes();

      this.setState({
        nomesProdutos: produtos.data.results,
        nomesMarcas: marcas.data.results,
        nomesFabricantes: fabricantes.data.results,
      });
    }
  };

  adicionaResponseAoResultadoProduto = (response) => {
    response.data.results.forEach((produto) => {
      produto["ativo"] = false;
    });
    this.setState({
      resultadosProduto: response.data.results,
    });
  };

  dropDownProduto = (indice) => {
    let { resultadosProduto } = this.state;
    resultadosProduto.forEach((produto, indiceProduto) => {
      if (indiceProduto === indice) {
        produto.ativo = !produto.ativo;
      } else if (produto.ativo) {
        produto.ativo = false;
      }
    });
    this.setState({ resultadosProduto });
  };

  cancelaPesquisa = () => {
    this.setState({
      resultadosProduto: [],
    });
  };

  onSubmit = async (values) => {
    const response = await getProdutosListagem({ ...values });
    this.adicionaResponseAoResultadoProduto(response);
  };

  render() {
    const { nomesProdutos, nomesMarcas, nomesFabricantes, resultadosProduto } =
      this.state;
    const { exibeFormularioInicial } = this.props;
    return (
      <Form
        onSubmit={this.onSubmit}
        render={({ form, submitting, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="busca-produtos-formulario">
            <section className="header-busca-produto">
              Confira se produto já está cadastrado no sistema
            </section>
            <div>
              <label>Nome do Produto</label>
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={nomesProdutos ? nomesProdutos : []}
                placeholder="Digite o nome do produto"
                className="input-busca-produto"
                onSelect={form.submit}
                name="nome_produto"
                disabled={submitting}
              />
            </div>
            <div className="marca-fabricante-inputs">
              <div>
                <label>Marca do Produto</label>
                <Field
                  component={AutoCompleteFieldUnaccent}
                  dataSource={nomesMarcas ? nomesMarcas : []}
                  placeholder="Digite a marca do produto"
                  className="input-busca-produto"
                  onSelect={form.submit}
                  name="nome_marca"
                  disabled={submitting}
                />
              </div>
              <div>
                <label>Fabricante do Produto</label>
                <Field
                  component={AutoCompleteFieldUnaccent}
                  dataSource={nomesFabricantes ? nomesFabricantes : []}
                  className="input-busca-produto"
                  placeholder="Digite o fabricante do produto"
                  onSelect={form.submit}
                  name="nome_fabricante"
                  disabled={submitting}
                />
              </div>
            </div>

            {resultadosProduto.length > 0 && (
              <section className="resultados-busca-produtos">
                <section className="">
                  <div className="tabela-produto tabela-header-produto">
                    <div>Nome do Produto</div>
                    <div>Marca do Produto</div>
                    <div>Fabricante do Produto</div>
                  </div>
                  {resultadosProduto.map((produto, indice) => {
                    return (
                      <div key={indice}>
                        <div className="tabela-produto tabela-body-produto">
                          <div
                            className={`item-produto ${
                              produto.ativo ? "" : "item-inativo"
                            }`}
                          >
                            {produto.nome}
                          </div>
                          <div
                            className={`item-produto ${
                              produto.ativo ? "" : "item-inativo"
                            }`}
                          >
                            {produto.marca.nome}
                          </div>
                          <div
                            className={`item-produto com-botao ${
                              produto.ativo ? "" : "item-inativo"
                            }`}
                          >
                            {produto.fabricante.nome}
                            {produto.ativo ? (
                              <>
                                {podeEditarProduto(produto) && (
                                  <div className="botoes-produto">
                                    <Link
                                      to={`/gestao-produto/editar?uuid=${produto.ultima_homologacao.uuid}`}
                                    >
                                      <i className="fas fa-pen editar" />
                                    </Link>
                                  </div>
                                )}
                                <div className="botoes-produto">
                                  <i
                                    className="fas fa-angle-up"
                                    onClick={() => {
                                      this.dropDownProduto(indice);
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <i
                                className="fas fa-angle-down"
                                onClick={() => {
                                  this.dropDownProduto(indice);
                                }}
                              />
                            )}
                          </div>
                        </div>
                        {produto.ativo && (
                          <div className="detalhe-produto">
                            {produto.terceirizada &&
                              produto.terceirizada.contatos.map(
                                (contato, indice) => {
                                  return (
                                    <div
                                      key={indice}
                                      className="contatos-terceirizada"
                                    >
                                      <div>
                                        <div className="label-item">
                                          Telefone
                                        </div>
                                        <div className="value-item">
                                          {contato.telefone}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="label-item">E-mail</div>
                                        <div className="value-item">
                                          {contato.email}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}

                            <div className="componentes-produto">
                              <div className="label-item">
                                Componentes do produto
                              </div>
                              <div className="value-item">
                                {produto.componentes}
                              </div>
                            </div>

                            <div className="componentes-produto">
                              <div className="label-item">
                                O produto contém ou pode conter
                                ingredientes/aditivos alergênicos?
                              </div>
                              <div className="value-item">
                                {produto.tem_aditivos_alergenicos
                                  ? "SIM"
                                  : "NÃO"}
                              </div>
                            </div>

                            {produto.tem_aditivos_alergenicos && (
                              <div className="componentes-produto">
                                <div className="label-item">Quais?</div>
                                <div className="value-item">
                                  {produto.aditivos}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              </section>
            )}

            <div className="botoes-busca">
              <Botao
                texto={"Limpar Filtros"}
                className="me-3"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={() => {
                  form.reset();
                  this.cancelaPesquisa();
                }}
              />
              <Botao
                texto={"Solicitar Homologação"}
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                onClick={() => {
                  exibeFormularioInicial();
                }}
              />
            </div>
          </form>
        )}
      />
    );
  }
}
