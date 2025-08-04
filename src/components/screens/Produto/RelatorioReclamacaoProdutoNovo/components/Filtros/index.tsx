import { Field } from "react-final-form";
import { CollapseFiltros } from "src/components/Shareable/CollapseFiltros";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { requiredMultiselect } from "src/helpers/fieldValidators";
import { IFiltros } from "../../interfaces";

type IFiltrosProps = {
  filtros: IFiltros;
};

export const Filtros = ({ ...props }: IFiltrosProps) => {
  const { filtros } = props;

  const onSubmit = async () => {};

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={() => {}}
      titulo="Filtrar Resultados"
    >
      {(values, form) =>
        filtros && (
          <>
            <div className="row">
              <div className="col-4">
                <Field
                  label="Editais"
                  component={MultiselectRaw}
                  dataTestId="select-editais"
                  required
                  validate={requiredMultiselect}
                  name="editais"
                  placeholder="Selecione os Editais"
                  options={filtros.editais || []}
                  selected={values.editais || []}
                  onSelectedChanged={(
                    values_: Array<{ label: string; value: string }>
                  ) => {
                    form.change(
                      `editais`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                />
              </div>
            </div>
          </>
        )
      }
    </CollapseFiltros>
  );
};
