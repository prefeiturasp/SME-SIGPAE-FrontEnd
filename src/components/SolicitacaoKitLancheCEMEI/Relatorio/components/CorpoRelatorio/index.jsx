import React, { useContext, useState, Fragment } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  corDaMensagem,
  deepCopy,
  justificativaAoAprovarSolicitacao,
  justificativaAoNegarSolicitacao,
  visualizaBotoesDoFluxo,
} from "src/helpers/utilities";
import {
  totalAlunosCEI,
  tempoPasseio,
  checaPrazo,
  getNumeroTotalKits,
} from "src/components/SolicitacaoKitLancheCEMEI/helpers";
import Botao from "src/components/Shareable/Botao";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { fluxoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import RelatorioHistoricoJustificativaEscola from "src/components/Shareable/RelatorioHistoricoJustificativaEscola";
import { CODAE, TERCEIRIZADA } from "src/configs/constants";
import {
  statusEnum,
  TIPO_PERFIL,
  TIPO_SOLICITACAO,
} from "src/constants/shared";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";
import RelatorioHistoricoQuestionamento from "src/components/Shareable/RelatorioHistoricoQuestionamento";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getSolicitacaoKitLancheCEMEI } from "src/services/kitLanche";
import { SolicitacaoAlimentacaoContext } from "src/context/SolicitacaoAlimentacao";
import "../../style.scss";
import { getRelatorioKitLancheCEMEI } from "src/services/relatorios";
import { SolicitacoesSimilaresKitLanche } from "src/components/Shareable/SolicitacoesSimilaresKitLanche";
import { ModalAprovarSolicitacaoKitLanche } from "../ModalAprovarSolicitacaoKitLanche";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";

export const CorpoRelatorio = ({ ...props }) => {
  const {
    solicitacoesSimilares,
    setSolicitacoesSimilares,
    solicitacaoKitLancheCEMEI,
    ModalNaoAprova,
    endpointNaoAprovaSolicitacao,
    visao,
    textoBotaoNaoAprova,
    textoBotaoAprova,
    motivosDREnaoValida,
    endpointAprovaSolicitacao,
    toastAprovaMensagem,
    toastAprovaMensagemErro,
    fetchData,
    ModalQuestionamento,
    endpointQuestionamento,
  } = props;

  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);
  const [showModalObservacaoCodae, setShowModalObservacaoCodae] =
    useState(false);
  const [showQuestionamentoModal, setShowQuestionamentoModal] = useState(false);
  const [respostaSimNao, setRespostaSimNao] = useState(null);
  const [imprimindo, setImprimindo] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  const tipoSolicitacao = urlParams.get("tipoSolicitacao");

  const EXIBIR_BOTAO_NAO_APROVAR =
    visao !== TERCEIRIZADA ||
    (solicitacaoKitLancheCEMEI &&
      solicitacaoKitLancheCEMEI.prioridade !== "REGULAR" &&
      solicitacaoKitLancheCEMEI.status === statusEnum.CODAE_QUESTIONADO &&
      textoBotaoNaoAprova);
  const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
    visao === TERCEIRIZADA &&
    solicitacaoKitLancheCEMEI &&
    [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
      solicitacaoKitLancheCEMEI.status
    );
  const EXIBIR_BOTAO_APROVAR =
    (![
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
      textoBotaoAprova) ||
    (solicitacaoKitLancheCEMEI &&
      (solicitacaoKitLancheCEMEI.prioridade === "REGULAR" ||
        [
          statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
          statusEnum.CODAE_AUTORIZADO,
        ].includes(solicitacaoKitLancheCEMEI.status)) &&
      textoBotaoAprova);
  const EXIBIR_BOTAO_QUESTIONAMENTO =
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
    solicitacaoKitLancheCEMEI &&
    (solicitacaoKitLancheCEMEI.prioridade !== "REGULAR" ||
      (visao === CODAE &&
        solicitacaoKitLancheCEMEI.prioridade !== "REGULAR")) &&
    [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
      solicitacaoKitLancheCEMEI.status
    );

  const solicitacaoAlimentacaoContext = useContext(
    SolicitacaoAlimentacaoContext
  );

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    solicitacaoKitLancheCEMEI.logs
  );

  const justificativaAprovacao = justificativaAoAprovarSolicitacao(
    solicitacaoKitLancheCEMEI.logs
  );

  const EXIBIR_HISTORICO =
    solicitacaoKitLancheCEMEI.prioridade !== "REGULAR" &&
    existeLogDeQuestionamentoDaCODAE(solicitacaoKitLancheCEMEI.logs);

  const onClickBotaoAprovar = async () => {
    const resp = await endpointAprovaSolicitacao(
      solicitacaoKitLancheCEMEI.uuid,
      {}
    );
    if (resp.status === HTTP_STATUS.OK) {
      toastSuccess(toastAprovaMensagem);
      const response = await getSolicitacaoKitLancheCEMEI(
        solicitacaoKitLancheCEMEI.uuid
      );
      if (response.status === HTTP_STATUS.OK) {
        solicitacaoAlimentacaoContext.updateSolicitacaoAlimentacao(
          response.data
        );
      }
    } else {
      toastError(toastAprovaMensagemErro);
    }
  };

  const collapseSolicitacaoSimilar = (idxSolicitacaoSimilar) => {
    let _solicitacoesSimilares = deepCopy(solicitacoesSimilares);
    _solicitacoesSimilares[idxSolicitacaoSimilar]["collapsed"] =
      !_solicitacoesSimilares[idxSolicitacaoSimilar]["collapsed"];
    setSolicitacoesSimilares(_solicitacoesSimilares);
  };

  const kitsSelecionados = (kits) => {
    let nomeKits = [];
    kits.forEach((kit) => nomeKits.push(kit.nome));
    return nomeKits.join(", ");
  };

  return (
    <>
      <div className="row mb-2">
        <p
          className={`col-6 ${corDaMensagem(
            checaPrazo(solicitacaoKitLancheCEMEI.prioridade)
          )}`}
        >
          <b>{checaPrazo(solicitacaoKitLancheCEMEI.prioridade)}</b>
        </p>
        <div className="col-6">
          <Botao
            type={BUTTON_TYPE.BUTTON}
            style={imprimindo ? BUTTON_STYLE.GREEN_OUTLINE : BUTTON_STYLE.GREEN}
            disabled={imprimindo}
            icon={imprimindo ? BUTTON_ICON.LOADING : BUTTON_ICON.PRINT}
            onClick={async () => {
              setImprimindo(true);
              await getRelatorioKitLancheCEMEI(
                tipoSolicitacao,
                solicitacaoKitLancheCEMEI.uuid,
                solicitacaoKitLancheCEMEI?.escola?.nome
              );
              setImprimindo(false);
            }}
            className="float-end"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-3 my-auto">
          <div className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {solicitacaoKitLancheCEMEI.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </div>
        </div>
        <div className="col-5 my-auto report-label-value">
          <p className="mb-2">Escola Solicitante</p>
          <p className="value-important">
            {solicitacaoKitLancheCEMEI.escola.nome}
          </p>
        </div>
        <div className="col-2 my-auto report-label-value">
          <p className="mb-2">Código EOL</p>
          <p className="value-important">
            {solicitacaoKitLancheCEMEI.escola.codigo_eol}
          </p>
        </div>
        <div className="col-2 my-auto" />
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacaoKitLancheCEMEI.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {solicitacaoKitLancheCEMEI.escola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {solicitacaoKitLancheCEMEI.escola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {solicitacaoKitLancheCEMEI.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <FluxoDeStatus
          listaDeStatus={solicitacaoKitLancheCEMEI.logs}
          fluxo={fluxoPartindoEscola}
          eh_gestao_alimentacao={true}
        />
      </div>
      <hr />
      <div className="row mt-3">
        <div className="col-2">
          <p>Solicitação Similar:</p>
        </div>
        <div className="col-10">
          {solicitacoesSimilares &&
            solicitacoesSimilares.map((solicitacao, idxSolicitacaoSimilar) => {
              return (
                <p className="gatilho-style" key={idxSolicitacaoSimilar}>
                  <b>
                    {`#${solicitacao.id_externo}`}
                    <ToggleExpandir
                      onClick={() =>
                        collapseSolicitacaoSimilar(idxSolicitacaoSimilar)
                      }
                      ativo={!solicitacao.collapsed}
                      className="icon-padding"
                    />
                  </b>
                </p>
              );
            })}
        </div>
      </div>
      {solicitacoesSimilares &&
        solicitacoesSimilares.length > 0 &&
        solicitacoesSimilares.map((s, idxSolicitacaoSimilar) => {
          return (
            <SolicitacoesSimilaresKitLanche
              key={idxSolicitacaoSimilar}
              solicitacao={s}
              index={idxSolicitacaoSimilar}
            />
          );
        })}
      <hr />
      <div className="row">
        <div className="col">
          <p>
            <b>Solicitação de Kit Lanche Passeio</b>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-4 report-label-value mt-0">
          <p className="mb-2">Data do passeio:</p>
          <p className="value-important">{solicitacaoKitLancheCEMEI.data}</p>
        </div>
        <div className="col-4 report-label-value mt-0">
          <p className="mb-2">Local do passeio:</p>
          <p className="value-important">{solicitacaoKitLancheCEMEI.local}</p>
        </div>
        <div className="col-4 report-label-value mt-0">
          <p className="mb-2">Evento/Atividade</p>
          <p className="value-important">{solicitacaoKitLancheCEMEI.evento}</p>
        </div>
      </div>
      {solicitacaoKitLancheCEMEI.solicitacao_cei && (
        <>
          <div className="alunos-label mt-3">Alunos CEI</div>
          <div className="row">
            <div className="col">
              <p className="mt-3">
                Número de alunos:{" "}
                <b className="green ms-1">
                  {
                    totalAlunosCEI(solicitacaoKitLancheCEMEI)
                      .totalQuantidadeAlunos
                  }
                </b>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p>
                Tempo previsto de passeio:{" "}
                <b className="green ms-1">
                  {tempoPasseio(solicitacaoKitLancheCEMEI.solicitacao_cei)}
                </b>
              </p>
            </div>
            <div className="col-6">
              <p>
                Opção desejada:{" "}
                <b className="green ms-1">
                  {kitsSelecionados(
                    solicitacaoKitLancheCEMEI.solicitacao_cei.kits
                  )}
                </b>
              </p>
            </div>
          </div>
          <section className="tabela-faixa-etaria-cei">
            <article>
              <div className="faixa-etaria">Faixa etária</div>
              <div className="alunos-matriculados">Alunos matriculados</div>
              <div className="quantidade">Quantidade</div>
            </article>
            {solicitacaoKitLancheCEMEI.solicitacao_cei.faixas_quantidades.map(
              (faixa, key) => (
                <article key={key}>
                  <div className="faixa-etaria">
                    {faixa.faixa_etaria.__str__}
                  </div>
                  <div className="alunos-matriculados">
                    {faixa.matriculados_quando_criado}
                  </div>
                  <div className="quantidade">{faixa.quantidade_alunos}</div>
                </article>
              )
            )}
            <article>
              <div className="faixa-etaria">Total</div>
              <div className="alunos-matriculados">
                {totalAlunosCEI(solicitacaoKitLancheCEMEI).totalMatriculados}
              </div>
              <div className="quantidade">
                {
                  totalAlunosCEI(solicitacaoKitLancheCEMEI)
                    .totalQuantidadeAlunos
                }
              </div>
            </article>
          </section>
        </>
      )}
      {solicitacaoKitLancheCEMEI.solicitacao_cei &&
        solicitacaoKitLancheCEMEI.solicitacao_cei
          .alunos_com_dieta_especial_participantes.length > 0 && (
          <Fragment>
            <div className="row report-label-value">
              <div className="col-12 report-label-value">
                <p>
                  <b>Aluno(s) com dieta especial</b>
                </p>
              </div>
            </div>
            <section className="table-report-dieta-especial">
              <article>
                <div className="codigo-eol">Código EOL</div>
                <div className="nome">Nome do Aluno</div>
              </article>
              {solicitacaoKitLancheCEMEI.solicitacao_cei.alunos_com_dieta_especial_participantes.map(
                (aluno, key) => {
                  return (
                    <article key={key}>
                      <div className="codigo-eol">{aluno.codigo_eol}</div>
                      <div className="nome">{aluno.nome}</div>
                    </article>
                  );
                }
              )}
            </section>
          </Fragment>
        )}
      {solicitacaoKitLancheCEMEI.solicitacao_emei && (
        <>
          <div className="alunos-label mt-6">Alunos EMEI</div>
          <div className="row">
            <div className="col">
              <p className="mt-3">
                Número de alunos:{" "}
                <b className="green ms-1">
                  {solicitacaoKitLancheCEMEI.solicitacao_emei.quantidade_alunos}
                </b>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p>
                Tempo previsto de passeio:{" "}
                <b className="green ms-1">
                  {tempoPasseio(solicitacaoKitLancheCEMEI.solicitacao_emei)}
                </b>
              </p>
            </div>
            <div className="col-6">
              <p>
                Opção desejada:{" "}
                <b className="green ms-1">
                  {kitsSelecionados(
                    solicitacaoKitLancheCEMEI.solicitacao_emei.kits
                  )}
                </b>
              </p>
            </div>
          </div>
          <section className="tabela-matriculados">
            <article>
              <div className="alunos-matriculados">
                Alunos Matriculados:{" "}
                {
                  solicitacaoKitLancheCEMEI.solicitacao_emei
                    .matriculados_quando_criado
                }
              </div>
              <div className="quantidade">
                Quantidade:{" "}
                {solicitacaoKitLancheCEMEI.solicitacao_emei.quantidade_alunos}
              </div>
            </article>
          </section>
        </>
      )}
      {solicitacaoKitLancheCEMEI.solicitacao_emei &&
        solicitacaoKitLancheCEMEI.solicitacao_emei
          .alunos_com_dieta_especial_participantes.length > 0 && (
          <Fragment>
            <div className="row report-label-value">
              <div className="col-12 report-label-value">
                <p>
                  <b>Aluno(s) com dieta especial</b>
                </p>
              </div>
            </div>
            <section className="table-report-dieta-especial">
              <article>
                <div className="codigo-eol">Código EOL</div>
                <div className="nome">Nome do Aluno</div>
              </article>
              {solicitacaoKitLancheCEMEI.solicitacao_emei.alunos_com_dieta_especial_participantes.map(
                (aluno, key) => {
                  return (
                    <article key={key}>
                      <div className="codigo-eol">{aluno.codigo_eol}</div>
                      <div className="nome">{aluno.nome}</div>
                    </article>
                  );
                }
              )}
            </section>
          </Fragment>
        )}
      <div className="row">
        <div className="col">
          <p className="total-kits">
            Número total de kits:{" "}
            <b className="green ms-1">
              {getNumeroTotalKits(solicitacaoKitLancheCEMEI, true)}
            </b>
          </p>
        </div>
      </div>
      {solicitacaoKitLancheCEMEI && solicitacaoKitLancheCEMEI.observacao && (
        <div className="row">
          <div className="col">
            <p>Observações:</p>
            <p
              dangerouslySetInnerHTML={{
                __html: solicitacaoKitLancheCEMEI.observacao,
              }}
            />
          </div>
        </div>
      )}
      {justificativaNegacao && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Justificativa da negação</p>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: justificativaNegacao,
              }}
            />
          </div>
        </div>
      )}
      {justificativaAprovacao && !EXIBIR_HISTORICO && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>
              <b>Autorizou</b>
            </p>
            <p>{`${
              solicitacaoKitLancheCEMEI.logs.find(
                (log) => log.status_evento_explicacao === "CODAE autorizou"
              ).criado_em
            } - Informações da CODAE`}</p>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: justificativaAprovacao,
              }}
            />
          </div>
        </div>
      )}
      <RelatorioHistoricoJustificativaEscola
        solicitacao={solicitacaoKitLancheCEMEI}
      />
      <RelatorioHistoricoQuestionamento
        solicitacao={solicitacaoKitLancheCEMEI}
      />
      {visualizaBotoesDoFluxo(solicitacaoKitLancheCEMEI) && (
        <>
          <div className="form-group d-flex justify-content-end mt-4">
            {EXIBIR_BOTAO_NAO_APROVAR && (
              <Botao
                texto={textoBotaoNaoAprova}
                className="float-end"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={() => {
                  setRespostaSimNao("Não");
                  setShowNaoAprovaModal(true);
                }}
              />
            )}
            {ModalNaoAprova && (
              <ModalNaoAprova
                showModal={showNaoAprovaModal}
                closeModal={() => setShowNaoAprovaModal(false)}
                motivosDREnaoValida={motivosDREnaoValida}
                endpoint={endpointNaoAprovaSolicitacao}
                solicitacao={solicitacaoKitLancheCEMEI}
                resposta_sim_nao={respostaSimNao}
                loadSolicitacao={
                  visao === TERCEIRIZADA
                    ? fetchData
                    : getSolicitacaoKitLancheCEMEI
                }
                tipoSolicitacao={tipoSolicitacao}
              />
            )}
            {EXIBIR_BOTAO_APROVAR &&
              textoBotaoAprova !== "Ciente" &&
              (visao === CODAE &&
              solicitacaoKitLancheCEMEI.logs.filter(
                (log) =>
                  log.status_evento_explicacao ===
                    "Terceirizada respondeu questionamento" &&
                  !log.resposta_sim_nao
              ).length > 0 ? null : (
                <Botao
                  texto={textoBotaoAprova}
                  type={BUTTON_TYPE.SUBMIT}
                  onClick={() =>
                    tipoPerfil === TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
                      ? setShowModalObservacaoCodae(true)
                      : onClickBotaoAprovar()
                  }
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
                />
              ))}
            {EXIBIR_BOTAO_QUESTIONAMENTO && (
              <Botao
                texto={
                  tipoPerfil === TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
                    ? "Questionar"
                    : "Sim"
                }
                type={BUTTON_TYPE.SUBMIT}
                onClick={() => {
                  setRespostaSimNao("Sim");
                  setShowQuestionamentoModal(true);
                }}
                style={BUTTON_STYLE.GREEN}
                className="ms-3"
              />
            )}
            {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
              <div className="form-group float-end mt-4">
                {solicitacaoKitLancheCEMEI.terceirizada_conferiu_gestao ? (
                  <label className="ms-3 conferido">
                    <i className="fas fa-check me-2" />
                    Solicitação Conferida
                  </label>
                ) : (
                  <Botao
                    texto="Marcar Conferência"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                    onClick={() => {
                      setShowModalMarcarConferencia(true);
                    }}
                  />
                )}
              </div>
            )}
            <ModalMarcarConferencia
              showModal={showModalMarcarConferencia}
              closeModal={() => setShowModalMarcarConferencia(false)}
              onMarcarConferencia={() => {
                fetchData();
              }}
              uuid={solicitacaoKitLancheCEMEI.uuid}
              endpoint={
                tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI
                  ? "solicitacoes-kit-lanche-cei-avulsa"
                  : tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEMEI
                  ? "solicitacao-kit-lanche-cemei"
                  : "solicitacoes-kit-lanche-avulsa"
              }
            />
            {showQuestionamentoModal && ModalQuestionamento && (
              <ModalQuestionamento
                closeModal={() => setShowQuestionamentoModal(false)}
                showModal={showQuestionamentoModal}
                loadSolicitacao={fetchData}
                resposta_sim_nao={respostaSimNao}
                endpoint={endpointQuestionamento}
                tipoSolicitacao={tipoSolicitacao}
                solicitacao={solicitacaoKitLancheCEMEI}
              />
            )}
            {showModalObservacaoCodae && (
              <ModalAprovarSolicitacaoKitLanche
                closeModal={() => setShowModalObservacaoCodae(false)}
                showModal={showModalObservacaoCodae}
                loadSolicitacao={fetchData}
                endpoint={endpointAprovaSolicitacao}
                tipoSolicitacao={tipoSolicitacao}
                solicitacao={solicitacaoKitLancheCEMEI}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
