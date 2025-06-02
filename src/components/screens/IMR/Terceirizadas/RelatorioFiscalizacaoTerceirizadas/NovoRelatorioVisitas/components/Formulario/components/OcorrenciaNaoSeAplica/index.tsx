import React from "react";
import { Field } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { TipoOcorrenciaInterface } from "interfaces/imr.interface";

type OcorrenciaNaoSeAplicaType = {
  tipoOcorrencia: TipoOcorrenciaInterface;
  somenteLeitura: boolean;
};

export const OcorrenciaNaoSeAplica = ({
  ...props
}: OcorrenciaNaoSeAplicaType) => {
  const { tipoOcorrencia, somenteLeitura } = props;
  return (
    <tr>
      <td className="p-3" colSpan={2}>
        <Field
          component={TextArea}
          label="Descrição"
          name={`descricao_${tipoOcorrencia.uuid}`}
          placeholder="Descreva as observações"
          height="100"
          disabled={somenteLeitura}
        />
      </td>
    </tr>
  );
};
