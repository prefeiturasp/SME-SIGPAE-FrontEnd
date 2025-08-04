import React from "react";
import "./styles.scss";
import { getLog } from "src/helpers/utilities";

interface LogEvento {
  criado_em: string;
  justificativa: string;
  status_evento_explicacao: string;
  [key: string]: any;
}

interface MotivoProps {
  logs: LogEvento[];
  motivo: string;
  titulo: string;
}

const MotivoEvento: React.FC<MotivoProps> = ({ logs, motivo, titulo }) => {
  const evento: LogEvento | undefined = getLog(logs, motivo);
  if (!evento) return null;
  return (
    <div className="componente-motivo-do-evento row">
      <div className="col-12">
        <div className="titulo-evento">
          <p className="mb-1">
            {`${titulo} (Data: ${evento.criado_em.split(" ")[0]}): `}
          </p>
          <p
            className="texto-wysiwyg-evento"
            dangerouslySetInnerHTML={{
              __html: evento.justificativa,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MotivoEvento;
