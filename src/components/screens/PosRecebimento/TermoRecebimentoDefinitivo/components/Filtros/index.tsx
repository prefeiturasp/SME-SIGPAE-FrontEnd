import { Dispatch, SetStateAction } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO,
  POS_RECEBIMENTO,
} from "src/configs/constants";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import { usuarioEhCronogramaOuCodae } from "src/helpers/utilities";
import { FiltrosTermoRecebimento } from "../../interfaces";

interface Props {
  setFiltros: Dispatch<SetStateAction<FiltrosTermoRecebimento>>;
}

export default ({ setFiltros }: Props) => {
  const opcoesStatus = [
    {
      label: "Rascunho",
      value: "RASCUNHO",
    },
    {
      label: "Enviado Fiscais",
      value: "ENVIADO_FISCAIS",
    },
    {
      label: "Enviado DILOG",
      value: "ENVIADO_DILOG",
    },
    {
      label: "Enviado Coordenador",
      value: "ENVIADO_COORDENADOR",
    },
    {
      label: "Enviado Fornecedor",
      value: "ENVIADO_FORNECEDOR",
    },
    {
      label: "Assinado Fornecedor",
      value: "ASSINADO_FORNECEDOR",
    },
  ];

  const onSubmit = async (values: Record<string, any>) => {
    const filtros = { ...values };
    if (filtros?.status) filtros.status = filtros.status.flat();

    if (!filtros.data_inicial) {
      delete filtros.data_inicial;
    }
    if (!filtros.data_final) {
      delete filtros.data_final;
    }

    setFiltros({ ...filtros });
  };

  const onClear = () => {};

  return (
    <div className="filtros-termos-recebimento">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values: Record<string, any>) => (
          <>
            <div className="row">
              <div className="col-6 mt-2">
                <Field
                  component={InputText}
                  label="Filtrar por Produto"
                  name="nome_produto"
                  placeholder="Digite o Produto"
                />
              </div>

              <div className="col-6 mt-2">
                <Field
                  component={InputText}
                  label="Filtrar por Empresa"
                  dataTestId="nome_empresa"
                  name="nome_empresa"
                  placeholder="Digite o Nome da Empresa"
                  className="input-busca-termo"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <Field
                  component={InputText}
                  label="Filtrar por Nº do Cronograma"
                  name="numero_cronograma"
                  placeholder="Digite o Nº do Cronograma"
                  className="input-busca-termo"
                />
              </div>

              <div className="col-3">
                <Field
                  component={MultiSelect}
                  disableSearch
                  options={opcoesStatus}
                  label="Filtrar por Status"
                  name="status"
                  nomeDoItemNoPlural="Status"
                  placeholder="Selecione os Status"
                />
              </div>

              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Filtrar por Período de Recebimento"
                  name="data_inicial"
                  className="data-field-termo"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : null
                  }
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  className="data-field-termo"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={null}
                />
              </div>
            </div>
          </>
        )}
      </CollapseFiltros>

      {usuarioEhCronogramaOuCodae() && (
        <div className="pt-4 pb-4">
          <NavLink
            to={`/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`}
          >
            <Botao
              texto="Cadastrar Termo"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              dataTestId="cadastrar-termo"
              onClick={() => {}}
            />
          </NavLink>
        </div>
      )}
    </div>
  );
};
