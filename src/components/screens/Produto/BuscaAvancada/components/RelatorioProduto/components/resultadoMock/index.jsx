import React from "react";
import { produto, informacoesNutricionais, logs } from "../helpers";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { fluxoPartindoTerceirizada } from "src/components/Shareable/FluxoDeStatus/helper";
import { Component } from "react";
import "../styles.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";

import { Modal } from "antd";

export default class ResultadoMock extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  itemLogAtivo = (index, ativo) => {
    logs.forEach((log) => {
      log.ativo = false;
    });
    logs[index].ativo = !ativo;
  };

  render() {
    return (
      <section className="corpo-reatorio-produto">
        <article className="flex-botoes-relatorio">
          <Botao
            type={BUTTON_TYPE.BUTTON}
            texto="Histórico"
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="me-2"
            onClick={this.showModal}
          />
          <Botao
            type={BUTTON_TYPE.BUTTON}
            texto="Imprimir"
            style={BUTTON_STYLE.GREEN}
            icon={BUTTON_ICON.PRINT}
          />
        </article>
        <header>
          <div className="label-relatorio">Nome do produto</div>
          <div className="label-relatorio">Marca</div>
          <div className="label-relatorio">Tipo</div>
          <div className="label-relatorio">Data</div>

          <div className="value-relatorio">{produto.nome}</div>
          <div className="value-relatorio">{produto.marca.nome}</div>
          <div className="value-relatorio">
            {produto.eh_para_alunos_com_dieta ? "DIETA ESPECIAL" : "COMUM"}
          </div>
          <div className="value-relatorio">
            {produto.criado_em.split(" ")[0]}
          </div>
        </header>
        <article>
          <hr />
          <FluxoDeStatus listaDeStatus={[]} fluxo={fluxoPartindoTerceirizada} />
          <hr />
        </article>
        <article className="informacoes-gerais">
          <div className="header-informacao">
            Informação de empresa solicitante (Terceirizada)
          </div>
          <div className="grid-empresa-info">
            <div className="label-relatorio">
              {" "}
              Empresa solicitante (Terceirizada)
            </div>
            <div className="label-relatorio">Telefone </div>
            <div className="label-relatorio">E-mail</div>
            <div className="value-relatorio">
              {produto.ultima_homologacao.rastro_terceirizada.nome_fantasia}
            </div>
            <div className="value-relatorio">
              {
                produto.ultima_homologacao.rastro_terceirizada.contatos[0]
                  .telefone
              }
            </div>
            <div className="value-relatorio">
              {produto.ultima_homologacao.rastro_terceirizada.contatos[0].email}
            </div>
          </div>
        </article>
        <hr />
        <article className="informacoes-gerais">
          <div className="header-informacao">Identificação do Produto</div>
          <div className="info-sem-grid">
            <div className="label-relatorio">
              O produto se destina a alimentação de alunos com dieta especial?
            </div>
            <div className="value-relatorio">
              {produto.eh_para_alunos_com_dieta ? "SIM" : "NÃO"}
            </div>
          </div>

          <div className="grid-marca-fabricante-info info-sem-grid">
            <div className="label-relatorio">Marca</div>
            <div className="label-relatorio">Fabricante</div>
            <div className="value-relatorio">{produto.marca.nome}</div>
            <div className="value-relatorio">{produto.fabricante.nome}</div>
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">Componentes do produto</div>
            <div className="value-relatorio">{produto.componentes}</div>
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">
              {" "}
              O produto contém ou pode conter ingredientes/aditivos alergênicos?
            </div>
            <div className="value-relatorio">
              {produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}
            </div>
          </div>

          <div className="info-sem-grid">
            <div className="informativo-importante">
              IMPORTANTE: Relacioná-los conforme dispõe a RDC nº 26 de 02/07/15
            </div>
          </div>
        </article>
        <hr />
        <article className="informacoes-gerais">
          <div className="header-informacao">Informações nutricionais</div>

          <div className="grid-marca-fabricante-info info-sem-grid">
            <div className="label-relatorio">Porção</div>
            <div className="label-relatorio">Unidade caseira</div>
            <div className="value-relatorio">{produto.porcao}</div>
            <div className="value-relatorio">{produto.unidade_caseira}</div>
          </div>

          <div className="listagem-proteinas">
            {informacoesNutricionais.map((informacao, index) => {
              const icone = informacao.ativo ? "angle-up" : "angle-down";
              return (
                <nav key={index} className="item-listagem">
                  <div className="header-listagem">
                    <div className="descricao-proteina">{informacao.nome}</div>
                    <i className={`fas fa-${icone}`} />
                  </div>
                </nav>
              );
            })}
          </div>
        </article>
        <div>
          <Modal
            title="Histórico"
            visible={this.state.visible}
            onOk={this.handleOk}
            okText={"Fechar"}
            onCancel={this.handleCancel}
            width={800}
            maskClosable={false}
          >
            <section className="body-modal-produto">
              <div>Usuario</div>
              <div>Ações</div>
              <article className="list-logs">
                <section className="body-logs">
                  {logs.map((log, index) => {
                    const { ativo } = log;
                    return (
                      <div
                        key={index}
                        className={`grid-item-log ${ativo && "ativo-item"}`}
                        onClick={() => {
                          this.itemLogAtivo(index, ativo);
                        }}
                      >
                        <div className="usuario">
                          <div>BB</div>
                        </div>
                        <div className="descricao">
                          <div className="descicao-titulo">
                            Análise Sensorial
                          </div>
                          <div className="descicao-entidade">CODAE</div>
                        </div>
                        <div className="descricao">
                          <div className="hora">27/04/2020</div>
                          <div className="hora">11:24</div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              </article>
              <article className="detail-log">
                <div />

                <div>
                  <header>
                    <div />
                    <div>fsdkljskfjdkljfsdjsdfjsfdljfsdkjlfdksj</div>
                  </header>
                </div>
              </article>
            </section>
          </Modal>
        </div>
      </section>
    );
  }
}
