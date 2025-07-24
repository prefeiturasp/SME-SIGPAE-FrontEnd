export const MotivoCorrecaoHomologacao = ({ logs }) => {
  const correcao = logs
    .filter(
      (log) => log.status_evento_explicacao === "Questionamento pela CODAE"
    )
    .pop();

  return (
    correcao && (
      <div className="row">
        <div className="col-12">
          <label className="col-form-label ">{`Motivo da solicitação de correção do produto (Data: ${
            correcao.criado_em.split(" ")[0]
          }): `}</label>
        </div>
        <div className="col-12">
          <p
            className="justificativa-ficha-produto no-margin"
            dangerouslySetInnerHTML={{
              __html: correcao.justificativa,
            }}
          />
        </div>
        <div className="col-12">
          <hr />
        </div>
      </div>
    )
  );
};
export default MotivoCorrecaoHomologacao;
