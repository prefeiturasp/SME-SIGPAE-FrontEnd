import { getLog } from "../../../../../../helpers/utilities";

export const MotivoCancelamento = ({ logs }) => {
  const correcao = getLog(
    logs,
    "Terceirizada cancelou solicitação de homologação de produto"
  );
  return (
    <div className="row">
      <div className="col-12">
        <label className="col-form-label ">{`Motivo do cancelamento da homologação (Data: ${
          correcao.criado_em.split(" ")[0]
        }) `}</label>
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
  );
};
export default MotivoCancelamento;
