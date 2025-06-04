import React, { Component } from "react";
import { formataInformacoesNutricionais } from "src/components/screens/Produto/Homologacao/helper";
import { Collapse } from "react-collapse";
import "./style.scss";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";

export class DadosProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      informacoesNutricionais: null,
    };
  }

  componentDidMount() {
    const { produto } = this.props;
    this.setState({
      informacoesNutricionais: formataInformacoesNutricionais(produto),
    });
  }

  activateInformacao(key) {
    let informacoesNutricionais = this.state.informacoesNutricionais;
    informacoesNutricionais[key].active = !informacoesNutricionais[key].active;
    this.forceUpdate();
  }

  render() {
    const { produto } = this.props;
    const { informacoesNutricionais } = this.state;
    return (
      <div className="ver-dados-produto mt-3">
        <hr />
        <div className="title">Identificação do Produto</div>
        <div className="row">
          <div className="col-12 report-label-value">
            <p>
              O produto se destina a alimentação de alunos com dieta especial?
            </p>
            <p className="value">
              {produto.eh_para_alunos_com_dieta ? "SIM" : "NÃO"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-6 report-label-value">
            <p>Marca</p>
            <p className="value">
              {produto.marca ? produto.marca.nome : "Não possui marca"}
            </p>
          </div>
          <div className="col-6 report-label-value">
            <p>Fabricante</p>
            <p className="value">
              {produto.fabricante
                ? produto.fabricante.nome
                : "Não possui fabricante"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Componentes do produto</p>
            <p className="value">
              {produto.componentes || "Não possui componentes"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 report-label-value">
            <p>
              O produto contém ou pode conter ingredientes/aditivos alergênicos?
            </p>
            <p className="value">
              {produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}
            </p>
          </div>
        </div>
        {produto.tem_aditivos_alergenicos && (
          <div className="row">
            <div className="col-12 report-label-value">
              <p>Quais?</p>
              <p className="value">
                {produto.aditivos || "Não possui aditivos"}
              </p>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-6">
            <div className="card-warning mt-3">
              <strong>IMPORTANTE:</strong> Relacioná-los conforme dispõe a RDC
              nº 26 de 02/07/15
            </div>
          </div>
        </div>
        <hr />
        <div className="title">Informações nutricionais</div>
        <div className="row">
          <div className="col-6 report-label-value">
            <p>Porção</p>
            <p className="value">{produto.porcao}</p>
          </div>
          <div className="col-6 report-label-value">
            <p>Unidade Caseira</p>
            <p className="value">{produto.unidade_caseira}</p>
          </div>
        </div>
        {informacoesNutricionais &&
          informacoesNutricionais.map((informacao, key) => {
            return (
              <div className="pb-2" key={key}>
                <div className="school-container col-md-12 me-4">
                  <div className="row pt-2 pb-2 title">
                    <div className="title col-4">{informacao.nome}</div>
                    <div className="col-8 text-end">
                      <ToggleExpandir
                        onClick={() => this.activateInformacao(key)}
                        ativo={informacao.active}
                        className="float-end"
                      />
                    </div>
                  </div>
                  <Collapse isOpened={informacao.active}>
                    <table className="table-informacoes-nutricionais">
                      <thead>
                        <th className="row">
                          <td className="col-4">Título</td>
                          <td className="col-4">Quantidade por porção</td>
                          <td className="col-4">%VD(*)</td>
                        </th>
                      </thead>
                      <tbody>
                        {informacao.valores.map(
                          (informacaoNutricional, key) => {
                            return (
                              <tr className="row" key={key}>
                                <td className="col-4">
                                  {informacaoNutricional.nome}
                                </td>
                                <td className="col-4">
                                  <div className="row">
                                    <div className="col-8">
                                      {informacaoNutricional.quantidade_porcao}{" "}
                                      {informacaoNutricional.medida}
                                    </div>
                                  </div>
                                </td>
                                <td className="col-4">
                                  <div className="row">
                                    <div className="col-8">
                                      {informacaoNutricional.valor_diario
                                        ? `${informacaoNutricional.valor_diario} %`
                                        : ""}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </Collapse>
                </div>
              </div>
            );
          })}
        <div className="row">
          <div className="col-10">
            <div className="card-warning gray mt-3 mb-3">
              % Valores Diários com base em uma dieta de 2.000 Kcal ou 8.400 KJ.
              <br />
              Seus valores diários podem ser maiores ou menores dependendo de
              suas necessidades energéticas. (**) VD não estabelecidos
            </div>
          </div>
        </div>
        <hr />
        <div className="title">Informação do Produto (classificação)</div>
        <div className="row">
          <div className="col-6 report-label-value">
            <p>Tipo</p>
            <p className="value">{produto.tipo || "Sem tipo"}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-6 report-label-value">
            <p>Embalagem primária</p>
            <p className="value">{produto.embalagem || "Sem embalagem"}</p>
          </div>
          <div className="col-6 report-label-value">
            <p>Prazo de validade</p>
            <p className="value">
              {produto.prazo_validade || "Sem prazo validade"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 report-label-value">
            <p>
              Condições de armazenamento, conservação e prazo máximo para
              consumo após abertura da embalagem
            </p>
            <p className="value">
              {produto.info_armazenamento ||
                "Sem informações sobre armazenamento"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Outras informações que empresa julgar necessário</p>
            <p className="value">
              {produto.outras_informacoes || "Sem mais informações"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Nº de registro do produto de órgão competente</p>
            <p className="value">
              {produto.numero_registro || "Registro não encontrado"}
            </p>
          </div>
        </div>
        <section className="row attachments">
          <div className="col-12 report-label-value">
            <p>Fotos do produto</p>
            {produto.imagens.map((anexo, key) => {
              return (
                <div key={key}>
                  <a
                    href={anexo.arquivo}
                    className="value-important link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {`Anexo ${key + 1}`}
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }
}
