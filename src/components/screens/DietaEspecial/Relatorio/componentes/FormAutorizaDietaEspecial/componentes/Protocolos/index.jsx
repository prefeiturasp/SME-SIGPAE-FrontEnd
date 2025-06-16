import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Field } from "react-final-form";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { getProtocoloPadrao } from "src/services/dietaEspecial.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { selectValidate } from "src/helpers/fieldValidators";

const Protocolos = ({ protocolos, setProtocoloPadrao, form }) => {
  const [open, setOpen] = useState(false);

  const { Option } = SelectAntd;

  const getProtocolo = async (payload, form) => {
    if (payload.length > 0 && payload !== "selecione") {
      const respProtocoloPadrao = await getProtocoloPadrao(payload);
      if (respProtocoloPadrao.status === HTTP_STATUS.OK) {
        setProtocoloPadrao(respProtocoloPadrao.data);
        const substituicoes = respProtocoloPadrao.data.substituicoes.map(
          (substituicao) => {
            const alimentos_substitutos =
              substituicao.alimentos_substitutos.map(
                (alimento) => alimento.uuid
              );
            const substitutos = substituicao.substitutos.map(
              (alimento) => alimento.uuid
            );
            return {
              alimento: String(substituicao.alimento.id),
              tipo: substituicao.tipo === "Substituir" ? "S" : "I",
              substitutos: alimentos_substitutos.concat(substitutos),
            };
          }
        );
        form.change("substituicoes", undefined);
        form.change("substituicoes", substituicoes);
        form.change(
          "orientacoes_gerais",
          respProtocoloPadrao.data.orientacoes_gerais
        );
      } else {
        toastError("Houve um erro ao carregar Protocolo Padrão");
      }
    } else {
      setProtocoloPadrao(undefined);
      form.change("substituicoes", undefined);
      form.change("orientacoes_gerais", undefined);
    }
  };

  return (
    <div className="row">
      <div className="col-12 input title">
        <span className="required-asterisk">*</span>
        <label>Nome do Protocolo Padrão</label>
      </div>
      <div className="col-12">
        <Field
          component={ASelect}
          className={"select-form-produto"}
          suffixIcon={<CaretDownOutlined onClick={() => setOpen(!open)} />}
          open={open}
          onClick={() => setOpen(!open)}
          onBlur={() => setOpen(false)}
          showSearch
          required
          validate={selectValidate}
          name="protocolo_padrao"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          onChange={(value) => {
            getProtocolo(value, form);
            form.change("protocolo_padrao", value);
          }}
        >
          {protocolos.map((protocolo) => {
            return (
              <Option key={protocolo.uuid}>{protocolo.nome_protocolo}</Option>
            );
          })}
        </Field>
      </div>
    </div>
  );
};

export default Protocolos;
