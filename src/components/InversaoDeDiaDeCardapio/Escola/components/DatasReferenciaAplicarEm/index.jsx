import moment from "moment";
import { Field } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { JS_DATE_NOVEMBRO } from "src/constants/shared";
import { required, requiredMultiselect } from "src/helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  dateDelta,
  escolaEhCEMEI,
  fimDoCalendario,
} from "src/helpers/utilities";

export const DatasReferenciaAplicarEm = ({ ...props }) => {
  const {
    name_data_de,
    name_data_para,
    name_alunos,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    setShowModalDataPrioritaria,
    form,
    setAdicionarOutroDia,
    pode_remover = false,
  } = props;

  const values = form.getState().values;

  const validaDiasUteis = (value) => {
    if (!value) return;
    if (
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis
      )
    ) {
      setShowModalDataPrioritaria(true);
    }
  };

  const removerDiaAdicional = () => {
    form.change("data_de_2", undefined);
    form.change("data_para_2", undefined);
    form.change("alunos_da_cemei_2", undefined);
    setAdicionarOutroDia(false);
  };

  return (
    <div className="row w-100 pt-3">
      <div
        className={`inversao-datepicker col-md-12 col-lg-${
          escolaEhCEMEI() ? "3" : "4"
        }`}
      >
        <Field
          component={InputComData}
          name={name_data_de}
          label="Referência"
          placeholder="Cardápio dia"
          required
          validate={required}
          onBlur={(event) => validaDiasUteis(event.target.value)}
          onChange={(value) => {
            validaDiasUteis(value);
          }}
          excludeDates={[moment(values[name_data_para], "DD/MM/YYYY")["_d"]]}
          minDate={proximosDoisDiasUteis}
          maxDate={
            new Date().getMonth() === JS_DATE_NOVEMBRO
              ? fimDoCalendario()
              : dateDelta(60)
          }
        />
      </div>
      <div className={`col-md-12 col-lg-1 for-span`}>
        <i className="fas fa-arrow-left" />
        <span className="ps-1 pe-1">para</span>
        <i className="fas fa-arrow-right" />
      </div>
      <div
        className={`inversao-datepicker col-md-12 col-lg-${
          escolaEhCEMEI() ? "3" : "4"
        }`}
      >
        <Field
          component={InputComData}
          name={name_data_para}
          disabled={!values[name_data_de]}
          label="Aplicar em"
          placeholder="Cardápio dia"
          required
          validate={required}
          onBlur={(event) => validaDiasUteis(event.target.value)}
          onChange={(value) => validaDiasUteis(value)}
          minDate={proximosDoisDiasUteis}
          excludeDates={[moment(values[name_data_de], "DD/MM/YYYY")["_d"]]}
          maxDate={
            new Date().getMonth() === JS_DATE_NOVEMBRO
              ? fimDoCalendario()
              : dateDelta(60)
          }
        />
      </div>
      {escolaEhCEMEI() && (
        <div className="inversao-datepicker col-md-12 col-lg-3">
          <Field
            label="Alunos"
            component={MultiselectRaw}
            dataTestId={`select-${name_alunos}`}
            required
            validate={requiredMultiselect}
            name={name_alunos}
            placeholder="Selecione os tipos de alunos"
            options={[
              { value: "CEI", label: "CEI" },
              { value: "EMEI", label: "EMEI" },
            ]}
            selected={values[name_alunos] || []}
            onSelectedChanged={(values_) => {
              form.change(
                name_alunos,
                values_.map((value_) => value_.value)
              );
            }}
          />
        </div>
      )}
      {pode_remover && (
        <div className="col-md-12 col-lg-2">
          <Botao
            texto="Remover dia"
            titulo="remover_dia"
            icon={BUTTON_ICON.TRASH}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.BLUE_OUTLINE}
            className="w-100 py-0 btn-remover"
            onClick={() => removerDiaAdicional()}
          />
        </div>
      )}
    </div>
  );
};
