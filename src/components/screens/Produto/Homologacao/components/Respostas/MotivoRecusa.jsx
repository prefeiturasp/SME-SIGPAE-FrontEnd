import { getLog } from "src/helpers/utilities";

const STATUS_SUSPENSAO = [
  "CODAE suspendeu o produto",
  "CODAE manteve o produto suspenso",
];

export const MotivoRecusa = ({ logs, motivo, titulo }) => {
  const ehSuspensao = motivo === "CODAE suspendeu o produto";
  const recusa = ehSuspensao
    ? logs
        .filter((log) =>
          STATUS_SUSPENSAO.includes(log.status_evento_explicacao),
        )
        .pop()
    : getLog(logs, motivo);
  if (!recusa) return false;
  return (
    <div className="row">
      <div className="col-12">
        <label className="col-form-label">
          {`${titulo} (Data: ${recusa.criado_em.split(" ")[0]})`}
        </label>
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

export default MotivoRecusa;
