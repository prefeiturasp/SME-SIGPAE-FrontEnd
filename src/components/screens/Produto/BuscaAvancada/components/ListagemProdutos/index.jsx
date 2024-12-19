import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";

const ListagemProdutos = ({ produtos, ativos, setAtivos }) => {
  return (
    <section className="resultado-busca-produto-avancada">
      <header>Veja os resultados para busca</header>
      <article>
        <div className="grid-produto-table header-table-produtos">
          <div>Tipo</div>
          <div>Status</div>
          <div>Data cadastro</div>
          <div>Nome do Produto</div>
          <div>Marca</div>
          <div>Fabricante</div>
          <div />
        </div>
        {produtos.map((produto, index) => {
          const terceirizada = produto.ultima_homologacao.rastro_terceirizada;
          const urlDetalhes = `/pesquisa-desenvolvimento/relatorio-produto?uuid=${produto.uuid}`;
          const bordas =
            ativos && ativos.includes(produto.uuid) ? "desativar-borda" : "";
          const icone =
            ativos && ativos.includes(produto.uuid) ? "angle-up" : "angle-down";
          return (
            <Fragment key={index}>
              <div className="grid-produto-table body-table-produtos">
                <div className={`${bordas}`}>
                  {produto.produto_edital_tipo_produto}
                </div>
                <div className={`${bordas}`}>{produto.status}</div>
                <div className={`${bordas}`}>
                  {produto.criado_em.split(" ")[0]}
                </div>
                <div className={`${bordas}`}>{produto.nome}</div>
                <div className={`${bordas}`}>{produto.marca.nome}</div>
                <div className={`${bordas}`}>{produto.fabricante.nome}</div>
                <div>
                  <i
                    className={`fas fa-${icone}`}
                    onClick={() => {
                      ativos && ativos.includes(produto.uuid)
                        ? setAtivos(ativos.filter((el) => el !== produto.uuid))
                        : setAtivos(
                            ativos ? [...ativos, produto.uuid] : [produto.uuid]
                          );
                    }}
                  />
                </div>
              </div>
              {ativos && ativos.includes(produto.uuid) && (
                <section className="resultado-busca-detalhe-produto">
                  <div className="grid-contatos-terceirizada">
                    <div className="label-empresa">
                      Empresa solicitante (Terceirizada)
                    </div>
                    <div className="label-empresa">Telefone</div>
                    <div className="label-empresa">E-mail</div>
                    <div className="value-empresa">
                      {terceirizada.nome_fantasia}
                    </div>
                    <div className="value-empresa template-contatos-terc">
                      {terceirizada.contatos.map((contato, index) => {
                        return <div key={index}>{contato.telefone}</div>;
                      })}
                    </div>
                    <div className="value-empresa template-contatos-terc">
                      {terceirizada.contatos.map((contato, index) => {
                        return <div key={index}>{contato.email}</div>;
                      })}
                    </div>
                    <div />
                  </div>
                  <div className="grid-do-produto">
                    <div className="label-empresa">Componentes do produto</div>
                    <div className="value-empresa">{produto.componentes}</div>
                  </div>
                  <div className="grid-do-produto">
                    <div className="label-empresa">
                      O produto contém ou pode conter ingredientes/aditivos
                      alergênicos?
                    </div>
                    <div className="value-empresa">
                      {produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}
                    </div>
                  </div>
                  <div className="grid-do-produto">
                    <div className="label-empresa">Quais?</div>
                    <div className="value-empresa">{produto.aditivos}</div>
                  </div>
                  <div className="grid-do-produto botao-produto-visualizar">
                    <NavLink
                      className="botao-visualizar-produto"
                      to={urlDetalhes}
                    >
                      Visualizar
                    </NavLink>
                  </div>
                </section>
              )}
            </Fragment>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemProdutos;
