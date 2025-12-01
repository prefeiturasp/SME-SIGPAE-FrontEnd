import React from "react";
import "./styles.scss";

const InformacaoDeReclamante = ({ reclamacao, questionamento, showTitle }) => {
  return (
    <div
      className="componente-informacao-de-reclamante"
      data-testid="informacao-reclamante"
    >
      <hr />
      {!!showTitle && <div className="title">Informação de reclamante</div>}
      <div className="grid-detalhe">
        <div className="grid-detalhe-cell label-empresa">Nome da Escola</div>
        <div className="grid-detalhe-cell label-empresa">Código EOL</div>
        <div className="grid-detalhe-cell label-empresa" />
        <div className="grid-detalhe-cell value-empresa">
          {reclamacao.escola.nome}
        </div>
        <div className="grid-detalhe-cell value-empresa">XXXX</div>
        <div className="grid-detalhe-cell value-empresa" />
      </div>
      <div className="grid-detalhe">
        <div className="grid-detalhe-cell label-empresa">
          Nome do Reclamante
        </div>
        <div className="grid-detalhe-cell label-empresa">RF/CRN/CFN</div>
        <div className="grid-detalhe-cell label-empresa">Cargo</div>
        <div className="grid-detalhe-cell value-empresa">
          {reclamacao.reclamante_nome}
        </div>
        <div className="grid-detalhe-cell value-empresa">
          {reclamacao.reclamante_registro_funcional || ""}
        </div>
        <div className="grid-detalhe-cell value-empresa">
          {reclamacao.reclamante_cargo || ""}
        </div>
      </div>
      <hr />
      <div className="log-reclamacao">
        <div className="label-empresa">Reclamação</div>
        <div className="value-empresa mb-3">
          <p
            dangerouslySetInnerHTML={{
              __html: reclamacao.reclamacao,
            }}
          />
        </div>
        <div className="label-empresa">Questionamento CODAE</div>
        <div className="value-empresa">
          <p
            dangerouslySetInnerHTML={{
              __html: questionamento.justificativa,
            }}
          />
        </div>
      </div>
      <hr />

      {!!(reclamacao.anexos && reclamacao.anexos.length) && (
        <div className="responder-reclamacao-anexos row">
          <div className="col-12 report-label-value">
            <p>Anexos</p>
            {reclamacao.anexos.map((anexo, key) => {
              return (
                <div key={key}>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={anexo.arquivo}
                    className="link fw-bold"
                  >
                    {`Anexo ${key + 1}`}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InformacaoDeReclamante;
