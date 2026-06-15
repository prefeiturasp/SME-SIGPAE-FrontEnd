import React, { useState, useEffect } from "react";
import { Field } from "react-final-form";
import { Multiselect } from "multiselect-react-dropdown";
import $ from "jquery";
import { slugify } from "../../../../../../helper";

export class MultiselectDiagnosticos extends Multiselect {
  componentDidUpdate(prevProps) {
    // sobreescreve o método de update para ajustar
    // o negrito dos diagnósticos selecionados

    const { options, selectedValues } = this.props;
    const { options: prevOptions, selectedValues: prevSelectedvalues } =
      prevProps;
    if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
      this.setState(
        { options, filteredOptions: options, unfilteredOptions: options },
        this.initialSetValue,
      );
    }
    if (JSON.stringify(prevSelectedvalues) !== JSON.stringify(selectedValues)) {
      this.setState(
        {
          selectedValues: Object.assign([], selectedValues),
          preSelectedValues: Object.assign([], selectedValues),
        },
        this.initialSetValue,
      );
    }

    // Retirada do negrito dos diagnóticos
    let lis = $(
      `.optionContainer li:nth-child(-n+${
        this.state.selectedValues.length + 1
      })`,
    );
    $(lis).each((_, element) => {
      $(element).css("font-weight", "");
    });

    // Negrito colocado só nos que estão selecionados
    lis = $(
      `.optionContainer li:nth-child(-n+${this.state.selectedValues.length})`,
    );
    $(lis).each((index, element) => {
      if (
        this.state.selectedValues
          .map((o) => o.nome)
          .includes(this.state.options[index].nome)
      ) {
        $(element).css("font-weight", "900");
      }
    });
  }

  compare = (a, b) => {
    return a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;
  };

  filterOptionsByInput() {
    // modificação do método de filtragem
    let { options, filteredOptions, inputValue, selectedValues } = this.state;

    const wordToFilter = slugify(inputValue.toLowerCase());
    const stateOptions = filteredOptions.filter(
      (op) => !selectedValues.find((o) => o.uuid === op.uuid),
    );
    const orderedNewOptions = selectedValues.sort(this.compare);
    options = orderedNewOptions
      .concat(stateOptions.sort(this.compare))
      .filter(
        (item) => slugify(item.nome.toLowerCase()).search(wordToFilter) !== -1,
      );

    this.groupByOptions(options);
    this.setState({ options });
  }
}

const Diagnosticos = ({
  diagnosticos,
  setDiagnosticosSelecionados,
  selectedValues,
  alergiasError,
  setAlergiasError,
}) => {
  const [diags, setDiags] = useState(diagnosticos);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(diags);
  }, [diags]);

  const compare = (a, b) => {
    return a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;
  };

  const onSelect = (values) => {
    if (alergiasError) {
      setAlergiasError(false);
    }
    setDiagnosticosSelecionados(formatarDiagnostico(values));
    const stateOptions = diagnosticos.filter(
      (op) => !values.find((o) => o.uuid === op.uuid),
    );
    const orderedNewOptions = values.sort(compare);
    setDiags(orderedNewOptions.concat(stateOptions.sort(compare)));
  };

  const onRemove = (values) => {
    setDiagnosticosSelecionados(formatarDiagnostico(values));
    const stateOptions = diagnosticos.filter(
      (op) => !values.find((o) => o.uuid === op.uuid),
    );
    const orderedNewOptions = values.sort(compare);
    setDiags(orderedNewOptions.concat(stateOptions.sort(compare)));
  };

  const formatarDiagnostico = (values) => {
    return values.map((value) => value.uuid);
  };

  return (
    <div className="row">
      <div className="col-12 pt-2 input title">
        <span className="required-asterisk">*</span>
        <label>Relação por Diagnóstico</label>
      </div>
      <div className="col-12">
        <Field
          component={MultiselectDiagnosticos}
          name="alergias_intolerancias"
          options={options}
          onSelect={onSelect}
          onRemove={onRemove}
          selectedValues={selectedValues}
          displayValue="nome"
          showArrow={true}
          closeIcon="close"
          showCheckbox
          placeholder=""
          closeOnSelect={false}
          avoidHighlightFirstOption={true}
          caseSensitiveSearch={false}
          emptyRecordMsg="Nenhuma opção encontrada"
        />
        {alergiasError && (
          <p className="mt-2" style={{ color: "#a50e05", fontSize: "12px" }}>
            Campo obrigatório
          </p>
        )}
      </div>
    </div>
  );
};

export default Diagnosticos;
