import React, { Component } from "react";

export default class DetalheProduto extends Component {
  exibir_protocolo_dieta = (protocolo, posicao, lista) => {
    const ultimo_item = lista.length === posicao + 1;
    return (
      <b>
        {protocolo.nome}
        {ultimo_item ? "." : "; "}
      </b>
    );
  };

  render() {
    const { homologacao } = this.props;
    const { produto } = homologacao;
    const justificativa =
      homologacao.logs[homologacao.logs.length - 1].justificativa;
    return (
      <article className="info-produto-homologacao">
        <section className="duas-informacoes">
          <div>
            <label>
              O produto se destina ao atendimento de alunos com dieta especial?
            </label>
            <p>{produto.eh_para_alunos_com_dieta ? "SIM" : "NÃO"}</p>
          </div>
        </section>

        <section>
          <div>
            <label>Componentes do produto</label>
            <p>{produto.componentes}</p>
          </div>
        </section>

        <section>
          <div>
            <label>
              O produto contém ou pode conter ingredientes/aditivos alergênicos?{" "}
            </label>
            <p>{produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}</p>
          </div>
        </section>

        {produto.tem_aditivos_alergenicos && (
          <section>
            <div>
              <label>Quais?</label>
              <p className="texto-em-upper">{produto.aditivos}</p>
            </div>
          </section>
        )}

        <section className="duas-informacoes">
          <div>
            <label>Embalagem primária</label>
            <p>{produto.embalagem}</p>
          </div>
          <div>
            <label>Prazo de validade</label>
            <p>{produto.prazo_validade}</p>
          </div>
        </section>

        <section>
          <div>
            <label>
              Condições de armazenamento, conservação e prazo máximo para
              consumo após abertura da embalagem
            </label>
            <p className="texto-em-upper">{produto.info_armazenamento}</p>
          </div>
        </section>

        <section>
          <div>
            <label>Outras informações que empresa julgar necessário</label>
            <p className="texto-em-upper">{produto.outras_informacoes}</p>
          </div>
        </section>

        <hr />

        <section className="duas-colunas">
          <div>
            <label>Solicitação de análise sensorial </label>
            <p
              className="texto-em-upper"
              dangerouslySetInnerHTML={{
                __html: justificativa,
              }}
            />
          </div>

          <div>
            <label>Protocolo de análise sensorial</label>
            <p>{homologacao.protocolo_analise_sensorial}</p>
          </div>
        </section>

        <hr />

        <section>
          <div>
            <label>Anexo</label>
            <div>
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
          </div>
        </section>
      </article>
    );
  }
}
