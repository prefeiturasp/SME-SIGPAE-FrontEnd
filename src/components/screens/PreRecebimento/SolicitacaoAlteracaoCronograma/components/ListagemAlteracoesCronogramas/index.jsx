import React, { useContext } from "react";

import "./styles.scss";
import { NavLink } from "react-router-dom";
import * as constants from "src/configs/constants";
import { deParaStatusAltCronograma } from "src/components/screens/helper";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

const ListagemAlteracoesCronogramas = ({
  alteracoesCronogramas,
  fornecedor,
}) => {
  const { meusDados } = useContext(MeusDadosContext);

  const STATUS_PRIORITARIO = {
    ADMINISTRADOR_EMPRESA: ["Alteração Enviada ao Fornecedor"],
    USUARIO_EMPRESA: ["Alteração Enviada ao Fornecedor"],
    COORDENADOR_CODAE_DILOG_LOGISTICA: ["Em análise"],
    DILOG_CRONOGRAMA: ["Em análise"],
    DILOG_DIRETORIA: ["Aprovado Abastecimento", "Reprovado Abastecimento"],
    DILOG_ABASTECIMENTO: ["Cronograma ciente"],
    DILOG_VISUALIZACAO: [],
    DILOG_QUALIDADE: [],
  };

  const ehStatusPrioritario = (status) =>
    STATUS_PRIORITARIO[meusDados.vinculo_atual.perfil.nome].includes(status);

  const getBotaoAcao = (status) => {
    if (ehStatusPrioritario(status)) {
      return (
        <span className={`link-acoes orange px-2`}>
          <i className="fas fa-edit" title="Analisar" />
        </span>
      );
    } else {
      return (
        <span className={`link-acoes green px-2`}>
          <i className="fas fa-eye" title="Detalhar" />
        </span>
      );
    }
  };

  return (
    <section className="resultado-solicitacao-alteracao-cronograma-de-entrega">
      <header>Resultados da Pesquisa</header>
      <article className="mt-3">
        <div
          className={`grid-table header-table ${
            fornecedor ? "fornecedor" : ""
          }`}
        >
          <div>Nº da Solicitação de Alteração</div>
          <div>Nº do Cronograma</div>
          {!fornecedor && <div>Nome do Fornecedor</div>}
          <div>Status</div>
          <div>Data da Solicitação</div>
          <div>Ações</div>
        </div>
        {alteracoesCronogramas.map((alteracaoCronograma, index) => {
          return (
            <div key={`${alteracaoCronograma.numero_solicitacao}_${index}`}>
              <div
                className={`grid-table body-table ${
                  fornecedor ? "fornecedor" : ""
                }`}
              >
                <div>{alteracaoCronograma.numero_solicitacao}</div>
                <div className="d-flex align-items-center justify-content-between">
                  {alteracaoCronograma.cronograma}
                  {alteracaoCronograma.programa_leve_leite && <TagLeveLeite />}
                </div>
                {!fornecedor && <div>{alteracaoCronograma.fornecedor}</div>}
                <div
                  className={`${
                    ehStatusPrioritario(alteracaoCronograma.status) && "orange"
                  }`}
                >
                  {fornecedor
                    ? deParaStatusAltCronograma(alteracaoCronograma.status)
                    : alteracaoCronograma.status}
                </div>
                <div>{alteracaoCronograma.criado_em.split(" ")[0]}</div>
                <div>
                  <NavLink
                    className="float-start"
                    to={`/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_ALTERACAO_CRONOGRAMA}?uuid=${alteracaoCronograma.uuid}`}
                  >
                    {getBotaoAcao(alteracaoCronograma.status)}
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemAlteracoesCronogramas;
