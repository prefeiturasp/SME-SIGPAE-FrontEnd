import { ConsolidadoTotal } from "../ConsolidadoTotal";

export default () => {
  return (
    <div className="d-flex flex-column gap-4">
      <ConsolidadoTotal
        titulo="CONSOLIDADO TOTAL (A + B + C)"
        quantidade={0}
        valor={0}
      />
    </div>
  );
};
