import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { formataInformacoesNutricionais } from "src/components/screens/Produto/Homologacao/helper";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import InformacaoDeReclamante from "src/components/Shareable/InformacaoDeReclamante";
import TabelaEspecificacoesProduto from "../TabelaEspecificacoesProduto";
import "./styles.scss";

const DetalheDoProduto = ({
  produto,
  status,
  reclamacao,
  questionamento,
  suspenso,
}) => {
  const [ativos, setAtivos] = useState([]);
  const infoNutri = formataInformacoesNutricionais(produto);
  const terceirizada = produto.ultima_homologacao.rastro_terceirizada;
  const { logs } = produto.ultima_homologacao;
  const ultimoLog = logs[logs.length - 1];

  return (
    <div className="shareable-detalhe-produto">
      <header>
        <div className="label-relatorio">Nome do produto</div>
        <div className="label-relatorio">Marca</div>
        <div className="label-relatorio">Fabricante</div>
        <div className="label-relatorio">Tipo</div>
        <div className="label-relatorio">Data</div>

        <div className="value-relatorio">{produto.nome}</div>
        <div className="value-relatorio">{produto.marca.nome}</div>
        <div className="value-relatorio">{produto.fabricante.nome}</div>
        <div className="value-relatorio">
          {produto.eh_para_alunos_com_dieta ? "DIETA ESPECIAL" : "COMUM"}
        </div>
        <div className="value-relatorio">{produto.criado_em.split(" ")[0]}</div>
      </header>
      {!!status && (
        <>
          <hr />
          <div className="row">
            <div className="col-4 report-label-value value-uppercase">
              <p>Status do produto </p>
              <p className="value text-uppercase"> {status} </p>
            </div>
            {(status === "suspenso" || suspenso) && (
              <>
                <div className="col-4 report-label-value">
                  <p>Motivo da supensão</p>
                  <p className="value">
                    <div
                      className="value-item value-uppercase"
                      dangerouslySetInnerHTML={{
                        __html: suspenso
                          ? ultimoLog.justificativa.split("<br>")[0]
                          : ultimoLog.justificativa,
                      }}
                    />
                  </p>
                </div>

                <div className="col-4 report-label-value">
                  <p>Data</p>

                  <p className="value">{ultimoLog.criado_em.split(" ")[0]}</p>
                </div>
              </>
            )}
          </div>
          <hr />
        </>
      )}

      {!!reclamacao && (
        <>
          <InformacaoDeReclamante
            reclamacao={reclamacao}
            questionamento={questionamento}
            showTitle
          />
          <div className="mb-4 mt-4">
            <hr />
          </div>
        </>
      )}
      <div className="title">
        Informação de empresa solicitante (Terceirizada)
      </div>
      <div className="row">
        <div className="col-4 report-label-value">
          <p>Empresa solicitante (Terceirizada)</p>
          <p className="value">{terceirizada.nome_fantasia}</p>
        </div>
        <div className="col-4 report-label-value">
          <p>Telefone</p>
          <p className="value">{terceirizada.contatos[0].telefone}</p>
        </div>
        <div className="col-4 report-label-value">
          <p>E-mail</p>
          <p className="value">{terceirizada.contatos[0].email}</p>
        </div>
      </div>
      <div className="mb-4 mt-4">
        <hr />
      </div>
      <div className="report-label-value ps-0">
        <p>
          {status === "suspenso" || suspenso
            ? "Produto Suspenso nos Editais"
            : "Editais Vinculados ao Produto"}
        </p>
        <p className="value">
          {produto.vinculos_produto_edital
            .filter((vinculo) =>
              status === "suspenso" || suspenso
                ? vinculo.suspenso
                : !vinculo.suspenso,
            )
            .map((vinculo) => vinculo.edital.numero)
            .join(", ")}
        </p>
      </div>
      <div className="mb-4 mt-4">
        <hr />
      </div>
      <div className="title">Identificação do Produto</div>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>
            O produto se destina a alimentação de alunos com dieta especial?
          </p>
          <p className="value" data-testid="produto-dieta-especial">
            {produto.eh_para_alunos_com_dieta ? "SIM" : "NÃO"}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 report-label-value">
          <p>Marca</p>
          <p className="value" data-testid="produto-marca">
            {produto.marca ? produto.marca.nome : "Não possui marca"}
          </p>
        </div>
        <div className="col-6 report-label-value">
          <p>Fabricante</p>
          <p className="value" data-testid="produto-fabricante">
            {produto.fabricante
              ? produto.fabricante.nome
              : "Não possui fabricante"}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>Componentes do produto</p>
          <p className="value" data-testid="produto-componentes">
            {produto.componentes || "Não possui componentes"}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>
            O produto contém ou pode conter ingredientes/aditivos alergênicos?
          </p>
          <p className="value" data-testid="produto-com-aditivos">
            {produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}
          </p>
        </div>
      </div>
      {produto.tem_aditivos_alergenicos && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Quais Alergênicos?</p>
            <p className="value">{produto.aditivos || "Não possui aditivos"}</p>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-5">
          <div className="card-warning mt-3">
            <strong>IMPORTANTE:</strong> Relacioná-los conforme dispõe a RDC nº
            26 de 02/07/15
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>O produto contém glúten?</p>
          <p className="value" data-testid="produto-com-gluten">
            {produto.tem_gluten ? "SIM" : "NÃO"}
          </p>
        </div>
      </div>
      <div className="mb-4 mt-4">
        <hr />
      </div>
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
      {infoNutri &&
        infoNutri.map((informacao, index) => {
          return (
            <div className="pb-2" key={index}>
              <div className="school-container col-md-12 me-4">
                <div className="row pt-2 pb-2 title">
                  <div className="title col-4">{informacao.nome}</div>
                  <div className="col-8 text-end">
                    <ToggleExpandir
                      onClick={() => {
                        ativos.includes(index)
                          ? setAtivos(ativos.filter((el) => el !== index))
                          : setAtivos([...ativos, index]);
                      }}
                      ativo={ativos.includes(index)}
                      className="float-end"
                    />
                  </div>
                </div>
                <Collapse isOpened={ativos.includes(index)}>
                  <table className="table-informacoes-nutricionais">
                    <thead>
                      <tr className="row">
                        <th className="col-4">Título</th>
                        <th className="col-4">Quantidade por porção</th>
                        <th className="col-4">%VD(*)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {informacao.valores.map((informacaoNutricional, key) => {
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
                      })}
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
            Seus valores diários podem ser maiores ou menores dependendo de suas
            necessidades energéticas. (**) VD não estabelecidos
          </div>
        </div>
      </div>
      <div className="mb-4 mt-4">
        <hr />
      </div>
      <div className="title">Informação do Produto (classificação)</div>
      <div className="row">
        <div className="col-6 report-label-value">
          <p>Nº de registro do produto de órgão competente</p>
          <p className="value">
            {produto.numero_registro || "Registro não encontrado"}
          </p>
        </div>
        <div className="col-6 report-label-value">
          <p>Prazo de validade</p>
          <p className="value">
            {produto.prazo_validade || "Sem prazo validade"}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 report-label-value">
          <p>Classificação de Grãos</p>
          <p className="value">{produto.tipo || "Sem classificação"}</p>
        </div>
      </div>
      {produto.embalagem ? (
        <div className="row" data-testid="produto-com-embalagem">
          <div className="col-6 report-label-value">
            <p>Embalagem primária</p>
            <p className="value">{produto.embalagem || "Sem embalagem"}</p>
          </div>
        </div>
      ) : (
        TabelaEspecificacoesProduto(produto)
      )}
      <div className="row">
        <div className="col-12 report-label-value">
          <p>
            Condições de armazenamento, conservação e prazo máximo para consumo
            após abertura da embalagem
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
};

export default DetalheDoProduto;
