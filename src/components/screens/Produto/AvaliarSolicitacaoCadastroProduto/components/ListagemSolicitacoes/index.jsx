import moment from "moment";
import React, { Fragment } from "react";

import "./styles.scss";
import FormPrevisaoCadastro from "../FormPrevisaoCadastro";
import {
  usuarioEhCODAEDietaEspecial,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";

const ListagemProdutos = ({
  solicitacoes,
  setSolicitacoes,
  ativos,
  setAtivos,
}) => {
  const usuarioNutricionistaCodae = usuarioEhCODAEDietaEspecial();
  const usuarioTerceirizada = usuarioEhEmpresaTerceirizada();
  const onUpdateSolicitacao = (uuid, values) => {
    setSolicitacoes(
      solicitacoes.map((sol) => {
        if (sol.uuid === uuid) {
          sol.status = "CONFIRMADA";
          sol.status_title = "Confirmada";
          sol.data_previsao_cadastro = moment(
            values.data_previsao_cadastro
          ).format("DD/MM/YYYY");
          sol.justificativa_previsao_cadastro =
            values.justificativa_previsao_cadastro;
        }
        return sol;
      })
    );
  };
  const gridTableClassName = usuarioTerceirizada
    ? "grid-table-solicitacoes-terceirizada"
    : "grid-table-solicitacoes-nutricodae";
  return (
    <section className="resultado-busca-solic-cad-produto">
      <header>Veja os resultados para busca</header>
      <article>
        <div className={`${gridTableClassName} header-table-produtos`}>
          <div>Nome do Produto</div>
          <div>Marca</div>
          <div>Fabricante</div>
          <div>Data Solicitação</div>
          <div>Status</div>
          {usuarioNutricionistaCodae && <div>Data Previsão Cadastro</div>}
          <div />
        </div>
        {solicitacoes.map((solicitacao, index) => {
          const bordas =
            ativos && ativos.includes(solicitacao.uuid)
              ? "desativar-borda"
              : "";
          const icone =
            ativos && ativos.includes(solicitacao.uuid)
              ? "angle-up"
              : "angle-down";
          return (
            <Fragment key={index}>
              <div className={`${gridTableClassName} body-table-produtos`}>
                <div className={`${bordas}`}>{solicitacao.nome_produto}</div>
                <div className={`${bordas}`}>{solicitacao.marca_produto}</div>
                <div className={`${bordas}`}>
                  {solicitacao.fabricante_produto}
                </div>
                <div className={`${bordas}`}>
                  {solicitacao.criado_em.split(" ")[0]}
                </div>
                <div className={`${bordas}`}>{solicitacao.status_title}</div>
                {usuarioNutricionistaCodae && (
                  <div className={`${bordas}`}>
                    {solicitacao.data_previsao_cadastro}
                  </div>
                )}
                <div>
                  <i
                    className={`fas fa-${icone}`}
                    onClick={() => {
                      ativos && ativos.includes(solicitacao.uuid)
                        ? setAtivos(
                            ativos.filter((el) => el !== solicitacao.uuid)
                          )
                        : setAtivos(
                            ativos
                              ? [...ativos, solicitacao.uuid]
                              : [solicitacao.uuid]
                          );
                    }}
                  />
                </div>
              </div>
              {ativos && ativos.includes(solicitacao.uuid) && (
                <section className="resultado-busca-detalhe-produto">
                  <div className="cabecalho-empresa">
                    <b>Informações do Produto</b>
                  </div>
                  <div className="grid-escola">
                    <div
                      className="value-empresa"
                      dangerouslySetInnerHTML={{
                        __html: solicitacao.info_produto,
                      }}
                    />
                  </div>
                  <div className="cabecalho-empresa">Dados escolares</div>
                  <div className="grid-escola">
                    <div className="label-empresa">Nome</div>
                    <div className="label-empresa">Lote</div>
                    <div className="label-empresa">Tipo de gestão</div>
                    <div className="value-empresa">
                      {solicitacao.escola.nome}
                    </div>
                    <div className="value-empresa">
                      {solicitacao.escola.lote}
                    </div>
                    <div className="value-empresa">
                      {solicitacao.escola.tipo_gestao.nome}
                    </div>
                    <div className="label-empresa">E-mail</div>
                    <div className="label-empresa">Telefone</div>
                    <div />
                    <div className="value-empresa">
                      {solicitacao.escola.contato.email}
                    </div>
                    <div className="value-empresa">
                      {solicitacao.escola.contato.telefone} -{" "}
                      {solicitacao.escola.contato.telefone2}
                    </div>
                    <div />
                    <div className="label-empresa">Nome DRE</div>
                    <div className="label-empresa">Cód. DRE</div>
                    <div />
                    <div className="value-empresa">
                      {solicitacao.escola.diretoria_regional.nome}
                    </div>
                    <div className="value-empresa">
                      {solicitacao.escola.diretoria_regional.codigo_eol}
                    </div>
                    <div />
                  </div>
                  <div className="cabecalho-empresa">
                    <b>Dados do aluno</b>
                  </div>
                  <div className="grid-escola">
                    <div className="label-empresa">Nome</div>
                    <div className="label-empresa">Cód. EOL</div>
                    <div className="label-empresa">Data Nascimento</div>
                    <div className="value-empresa">
                      {solicitacao.aluno.nome}
                    </div>
                    <div className="value-empresa">
                      {solicitacao.aluno.codigo_eol}
                    </div>
                    <div className="value-empresa">
                      {solicitacao.aluno.data_nascimento}
                    </div>
                  </div>
                  {usuarioTerceirizada &&
                    solicitacao.status === "AGUARDANDO_CONFIRMACAO" && (
                      <FormPrevisaoCadastro
                        uuidSolicitacao={solicitacao.uuid}
                        onUpdate={(values) =>
                          onUpdateSolicitacao(solicitacao.uuid, values)
                        }
                      />
                    )}
                  {usuarioTerceirizada &&
                    solicitacao.status === "CONFIRMADA" && (
                      <>
                        <div className="cabecalho-empresa">
                          <b>Dados da confirmação</b>
                        </div>
                        <div className="grid-confirmacao">
                          <div className="label-empresa">Data prevista</div>
                          <div className="label-empresa">Justificativa</div>
                          <div className="value-empresa">
                            {solicitacao.data_previsao_cadastro}
                          </div>
                          <div
                            className="value-empresa"
                            dangerouslySetInnerHTML={{
                              __html:
                                solicitacao.justificativa_previsao_cadastro,
                            }}
                          />
                        </div>
                      </>
                    )}
                  {usuarioNutricionistaCodae &&
                    solicitacao.status === "CONFIRMADA" && (
                      <>
                        <div className="cabecalho-empresa">
                          <b>Justificativa</b>
                        </div>
                        <div
                          className="value-empresa"
                          dangerouslySetInnerHTML={{
                            __html: solicitacao.justificativa_previsao_cadastro,
                          }}
                        />
                      </>
                    )}
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
