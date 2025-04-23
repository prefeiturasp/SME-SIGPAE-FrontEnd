import React from "react";
import { RECLAMACAO_PRODUTO_STATUS_EXPLICACAO } from "constants/shared";
import "./style.scss";
import { corrigeLinkAnexo } from "helpers/utilities";

const {
  CODAE_AUTORIZOU_RECLAMACAO,
  CODAE_RECUSOU_RECLAMACAO,
  CODAE_QUESTIONOU_TERCEIRIZADA,
  CODAE_QUESTIONOU_UE,
  CODAE_QUESTIONOU_NUTRISUPERVISOR,
  CODAE_RESPONDEU_RECLAMACAO,
  TERCEIRIZADA_RESPONDEU_RECLAMACAO,
  UE_RESPONDEU_RECLAMACAO,
  NUTRISUPERVISOR_RESPONDEU_RECLAMACAO,
  AGUARDANDO_ANALISE_SENSORIAL,
  ANALISE_SENSORIAL_RESPONDIDA,
} = RECLAMACAO_PRODUTO_STATUS_EXPLICACAO;

const anexosDoLog = (log) => {
  return (
    log.anexos &&
    log.anexos.length > 0 && (
      <div className="mb-3">
        <div key={1}>
          <p className="botao-reclamacao-title">Anexos da resposta</p>
        </div>
        <div key={2}>
          {log.anexos.map((anexo, key) => {
            return (
              <div key={key}>
                <a
                  href={corrigeLinkAnexo(anexo.arquivo)}
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
    )
  );
};

const Reclamacao = ({ reclamacao }) => {
  const blocoQuestionamentoCodae = (log) => {
    return (
      <>
        <div className="row">
          <div className="col-4">
            <div className="label-item">Data questionamento CODAE</div>
            <div className="value-item">{log.criado_em.split(" ")[0]}</div>
          </div>
          <div className="col-8">
            <div className="label-item">Questionamento CODAE</div>
            <div
              className="value-item value-uppercase"
              dangerouslySetInnerHTML={{
                __html: log.justificativa,
              }}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-4" />
          <div className="col-8">
            <div className="label-item">Empresa Questionada</div>
            <div className="value-item">
              {reclamacao.escola.lote && reclamacao.escola.lote.terceirizada
                ? reclamacao.escola.lote.terceirizada.nome_fantasia
                : "Escola sem lote Vinculado."}
            </div>
          </div>
        </div>
      </>
    );
  };

  const blocoQuestionamentoUE = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">Data questi. CODAE</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">
            CODAE questionou Unidade Educacional sobre reclamação
          </div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
        </div>
      </div>
    );
  };

  const blocoQuestionamentoNutrisupervisor = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">Data questi. CODAE</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">
            CODAE questionou Nutrisupervisão sobre reclamação
          </div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
        </div>
      </div>
    );
  };

  const blocoRespostaTerceirizada = (log) => {
    return (
      <>
        <div className="row mb-4">
          <div className="col-4">
            <div className="label-item">Data resposta Terceirizada</div>
            <div className="value-item">{log.criado_em.split(" ")[0]}</div>
          </div>
          <div className="col-8">
            <div className="label-item">Resposta terceirizada</div>
            <div
              className="value-item value-uppercase"
              dangerouslySetInnerHTML={{
                __html: log.justificativa,
              }}
            />
          </div>
        </div>
        {anexosDoLog(log)}
      </>
    );
  };

  const blocoRespostaUE = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">Data resposta U.E.</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">Resposta U.E.</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
          {anexosDoLog(log)}
        </div>
      </div>
    );
  };

  const blocoRespostaNutrisupervisor = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">Data resposta Nutrisupervisor</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">Resposta Nutrisupervisor</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
          {anexosDoLog(log)}
        </div>
      </div>
    );
  };

  const blocoAceiteOuRecusa = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">Data avaliação CODAE</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">Justificativa avaliação CODAE</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
          {anexosDoLog(log)}
        </div>
      </div>
    );
  };

  const blocoRespostaCodae = (log) => {
    return (
      <div className="row mb-4">
        <div />
        <div className="col-4">
          <div className="label-item">Data resposta CODAE</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">Resposta CODAE</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
          {anexosDoLog(log)}
        </div>
      </div>
    );
  };

  const blocoCodaePediuAnalise = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">
            Data da solicitação da Análise Sensorial
          </div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">
            Solicitação de Análise Sensorial CODAE
          </div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
        </div>
      </div>
    );
  };

  const blocoRespostaAnalise = (log) => {
    return (
      <div className="row mb-4">
        <div className="col-4">
          <div className="label-item">Data resposta terc.</div>
          <div className="value-item">{log.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">Resposta Análise Sensorial</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{
              __html: log.justificativa,
            }}
          />
          {anexosDoLog(log)}
        </div>
      </div>
    );
  };

  const blocoMensagem = (log) => {
    if (log.status_evento_explicacao === CODAE_QUESTIONOU_TERCEIRIZADA) {
      return blocoQuestionamentoCodae(log);
    } else if (log.status_evento_explicacao === CODAE_QUESTIONOU_UE) {
      return blocoQuestionamentoUE(log);
    } else if (
      log.status_evento_explicacao === CODAE_QUESTIONOU_NUTRISUPERVISOR
    ) {
      return blocoQuestionamentoNutrisupervisor(log);
    } else if (
      log.status_evento_explicacao === TERCEIRIZADA_RESPONDEU_RECLAMACAO
    ) {
      return blocoRespostaTerceirizada(log);
    } else if (
      log.status_evento_explicacao === CODAE_AUTORIZOU_RECLAMACAO ||
      log.status_evento_explicacao === CODAE_RECUSOU_RECLAMACAO
    ) {
      return blocoAceiteOuRecusa(log);
    } else if (log.status_evento_explicacao === CODAE_RESPONDEU_RECLAMACAO) {
      return blocoRespostaCodae(log);
    } else if (log.status_evento_explicacao === AGUARDANDO_ANALISE_SENSORIAL) {
      return blocoCodaePediuAnalise(log);
    } else if (log.status_evento_explicacao === ANALISE_SENSORIAL_RESPONDIDA) {
      return blocoRespostaAnalise(log);
    } else if (log.status_evento_explicacao === UE_RESPONDEU_RECLAMACAO) {
      return blocoRespostaUE(log);
    } else if (
      log.status_evento_explicacao === NUTRISUPERVISOR_RESPONDEU_RECLAMACAO
    ) {
      return blocoRespostaNutrisupervisor(log);
    }
  };

  return (
    <>
      <div className="row mt-3 mb-3">
        <div className="col-6">
          <div className="label-item">Reclamação #{reclamacao.id_externo}</div>
        </div>
        <div className="col-6">
          <div className="label-item right">
            Status Reclamação: <b>{reclamacao.status_titulo}</b>
          </div>
        </div>
      </div>
      <div className="row item-horizontal mt-3 mb-3">
        <div className="col-5">
          <div className="label-item">Nome Reclamante</div>
          <div className="value-item">{reclamacao.reclamante_nome}</div>
        </div>
        <div className="col-2">
          <div className="label-item">RF</div>
          <div className="value-item">
            {reclamacao.reclamante_registro_funcional}
          </div>
        </div>
      </div>
      <div className="row item-horizontal mt-3 mb-3">
        <div className="col-5">
          <div className="label-item">DRE</div>
          <div className="value-item">
            {reclamacao.escola.diretoria_regional.nome}
          </div>
        </div>
        <div className="col-5">
          <div className="label-item">Nome Escola</div>
          <div className="value-item">{reclamacao.escola.nome}</div>
        </div>
        <div className="col-2">
          <div className="right">
            <div className="label-item">Cód. EOL</div>
            <div className="value-item">{reclamacao.escola.codigo_eol}</div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row  mt-3 mb-3">
        <div className="col-12">
          <p className="reclamacao-title">Reclamação</p>
        </div>
        <div className="col-4">
          <div className="label-item">Data reclamação</div>
          <div className="value-item">{reclamacao.criado_em.split(" ")[0]}</div>
        </div>
        <div className="col-8">
          <div className="label-item">Justificativa reclamação</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{ __html: reclamacao.reclamacao }}
          />
        </div>
      </div>
      {reclamacao.logs.map((log) => {
        return blocoMensagem(log);
      })}
    </>
  );
};

export default Reclamacao;
