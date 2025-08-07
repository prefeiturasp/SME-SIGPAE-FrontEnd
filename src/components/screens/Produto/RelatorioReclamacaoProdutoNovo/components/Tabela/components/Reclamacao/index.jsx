import { RECLAMACAO_PRODUTO_STATUS_EXPLICACAO } from "src/constants/shared";
import "./style.scss";

const {
  CODAE_AUTORIZOU_RECLAMACAO,
  CODAE_RECUSOU_RECLAMACAO,
  CODAE_QUESTIONOU_TERCEIRIZADA,
  CODAE_RESPONDEU_RECLAMACAO,
  TERCEIRIZADA_RESPONDEU_RECLAMACAO,
} = RECLAMACAO_PRODUTO_STATUS_EXPLICACAO;

const obterTituloLog = (status_evento) => {
  switch (status_evento) {
    case TERCEIRIZADA_RESPONDEU_RECLAMACAO:
      return "Resposta terceirizada";

    case CODAE_QUESTIONOU_TERCEIRIZADA:
      return "Questionamento CODAE";

    case CODAE_AUTORIZOU_RECLAMACAO:
      return "Justificativa avaliação CODAE";

    case CODAE_RECUSOU_RECLAMACAO:
      return "Justificativa avaliação CODAE";

    case CODAE_RESPONDEU_RECLAMACAO:
      return "Resposta CODAE";

    default:
      return status_evento;
  }
};

const obterRotuloDataLog = (log) => {
  if (log.status_evento_explicacao === CODAE_QUESTIONOU_TERCEIRIZADA)
    return "Data quest. CODAE";
  if (log.status_evento_explicacao === TERCEIRIZADA_RESPONDEU_RECLAMACAO)
    return "Data resposta terc.";
  if (
    log.status_evento_explicacao === CODAE_AUTORIZOU_RECLAMACAO ||
    log.status_evento_explicacao === CODAE_RECUSOU_RECLAMACAO
  )
    return "Data avaliação CODAE";
  if (log.status_evento_explicacao === CODAE_RESPONDEU_RECLAMACAO)
    return "Data resposta CODAE";
  return "Data reclamação";
};

const LogReclamacao = ({ log }) => {
  return (
    <div className="linha linha-3 mt-1">
      <div className="item">
        <div className="label-item">{obterRotuloDataLog(log)}</div>
        <div className="value-item">{log.criado_em.split(" ")[0]}</div>
      </div>
      <div className="item">
        <div className="label-item">
          {obterTituloLog(log.status_evento_explicacao)}
        </div>
        <div
          className="value-item value-uppercase"
          dangerouslySetInnerHTML={{ __html: log.justificativa }}
        />
      </div>
    </div>
  );
};

export const Reclamacao = ({ reclamacao }) => {
  return (
    <div className="detalhes-reclamacao-relatorio">
      <div className="linha linha-1">
        <div className="item">
          <div className="label-item">
            Reclamação <b>#{reclamacao.id_externo}</b>
          </div>
        </div>
        <div className="item item-horizontal">
          <div className="label-item">Status Reclamação:{"\u00A0"}</div>
          <div className="value-item">{reclamacao.status_titulo}</div>
        </div>
      </div>
      <div className="linha linha-2">
        <div className="item">
          <div className="label-item">DRE/LOTE:</div>
          <div className="value-item">
            {reclamacao.escola.diretoria_regional.iniciais} -{" "}
            {reclamacao.escola.lote.nome}
          </div>
        </div>
        <div className="item">
          <div className="label-item">Empresa:</div>
          <div className="value-item">
            {reclamacao.escola.lote.terceirizada.nome_fantasia}
          </div>
        </div>
      </div>
      <div className="linha linha-2">
        <div className="item">
          <div className="label-item">RF e Nome do Reclamante:</div>
          <div className="value-item">
            {reclamacao.reclamante_registro_funcional} -{" "}
            {reclamacao.reclamante_nome}
          </div>
        </div>
        <div className="item">
          <div className="label-item">Código EOL e Nome da Escola:</div>
          <div className="value-item">
            {reclamacao.escola.codigo_eol} - {reclamacao.escola.nome}
          </div>
        </div>
      </div>
      <div className="linha linha-2 mt-3">
        <div className="item">
          <div className="label-item">Data reclamação</div>
          <div className="value-item">{reclamacao.criado_em.split(" ")[0]}</div>
        </div>
        <div className="item">
          <div className="label-item">Justificativa reclamação</div>
          <div
            className="value-item value-uppercase"
            dangerouslySetInnerHTML={{ __html: reclamacao.reclamacao }}
          />
        </div>
      </div>
      {reclamacao.logs.map((log, index) => {
        return <LogReclamacao key={index} log={log} />;
      })}
    </div>
  );
};
