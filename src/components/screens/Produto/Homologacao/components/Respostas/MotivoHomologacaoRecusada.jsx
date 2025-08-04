import { getLog } from "../../../../../../helpers/utilities";
export const MotivoHomologacaoRecusada = ({ logs }) => {
  const recusa = getLog(logs, "CODAE não homologou");
  return (
    <div className="row">
      <div className="col-12">
        <label className="col-form-label ">{`Motivo da recusa de homologação (Data: ${
          recusa.criado_em.split(" ")[0]
        })`}</label>
      </div>
      <div className="col-12">
        <p
          className="justificativa-ficha-produto no-margin"
          dangerouslySetInnerHTML={{
            __html: recusa.justificativa,
          }}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default MotivoHomologacaoRecusada;
