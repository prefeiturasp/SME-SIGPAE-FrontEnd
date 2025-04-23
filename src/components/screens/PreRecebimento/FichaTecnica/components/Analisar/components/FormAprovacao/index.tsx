import React, { useState } from "react";
import { Field } from "react-final-form";
import { required } from "helpers/fieldValidators";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../../../Shareable/Botao/constants";
import Botao from "../../../../../../../Shareable/Botao";
import "./styles.scss";

interface Props {
  name: string;
  aprovaCollapse: (_name: string) => void;
  reprovaCollapse: (_name: string) => void;
  values: Record<string, any>;
}

const FormAprovacao: React.FC<Props> = ({
  name,
  aprovaCollapse,
  reprovaCollapse,
  values,
}) => {
  const [conferido, setConferido] = useState(null);
  return (
    <div className="form-aprovacao">
      {conferido !== false ? (
        <div className="mt-4">
          <Botao
            texto="Conferido"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="float-end ms-3"
            onClick={() => {
              setConferido(true);
              values[`${name}_correcoes`] = "";
              aprovaCollapse(name);
            }}
          />
          <Botao
            texto="Solicitar Correção"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-end ms-3"
            onClick={() => {
              setConferido(false);
            }}
          />
        </div>
      ) : (
        <div className="row mt-3">
          <div className="col">
            <Field
              component={TextArea}
              label="Solicitação de Correção"
              dataTestId={`${name}_correcoes`}
              name={`${name}_correcoes`}
              placeholder="Descreva as correções necessárias."
              className="textarea-ficha-tecnica"
              required
              validate={required}
            />
          </div>
          <div className="mt-4">
            <Botao
              texto="Salvar Correções"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              disabled={!values[`${name}_correcoes`]}
              onClick={() => {
                reprovaCollapse(name);
              }}
            />
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-end ms-3"
              onClick={() => {
                setConferido(null);
                delete values[`${name}_correcoes`];
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAprovacao;
