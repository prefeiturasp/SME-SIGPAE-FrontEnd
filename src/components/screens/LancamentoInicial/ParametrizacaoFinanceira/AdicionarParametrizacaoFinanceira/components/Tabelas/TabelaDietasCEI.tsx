import { Table } from "antd";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { stringDecimalToNumber } from "src/helpers/parsers";
import InputText from "src/components/Shareable/Input/InputText";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  nomeTabela: string;
  periodo: string;
  grupoSelecionado: string;
};

export default ({
  form,
  faixasEtarias,
  nomeTabela,
  periodo,
  grupoSelecionado,
}: Props) => {
  const labelTabela =
    grupoSelecionado === "grupo_2"
      ? `CEI - Período ${periodo}`
      : `Período ${periodo}`;
  const chaveTabela = `${nomeTabela} - ${labelTabela}`;

  const formatarTotal = (value: number) =>
    String(value.toFixed(2)).replace(".", ",");

  const atualizarPercentuais = (value: string) => {
    faixasEtarias.forEach((faixa) => {
      form.change(
        `tabelas[${chaveTabela}].${faixa.__str__}.percentual_acrescimo`,
        String(value),
      );

      const valorUnitario =
        form.getState().values.tabelas[`${chaveTabela}`]?.[faixa.__str__]
          ?.valor_unitario || "0";
      const valorUnitarioTotal =
        stringDecimalToNumber(valorUnitario) *
        (1 + stringDecimalToNumber(String(value)) / 100);

      form.change(
        `tabelas[${chaveTabela}].${faixa.__str__}.valor_unitario_total`,
        formatarTotal(valorUnitarioTotal),
      );
    });
  };

  return (
    <div className="row mt-5">
      <div className="col">
        <h2 className="text-start texto-simples-verde fw-bold mb-3">
          Preço das {nomeTabela} -{" "}
          <span className={`titulo-tag periodo-${periodo.toLowerCase()}`}>
            {labelTabela}
          </span>
        </h2>

        <Table pagination={false} bordered dataSource={faixasEtarias}>
          <Table.Column
            title="Faixas Etárias"
            dataIndex="__str__"
            key="__str__"
            render={(value, record: any) => {
              return (
                <div>
                  <p className="fw-bold mb-0">{value}</p>
                  <Field
                    component="input"
                    name={`tabelas[${chaveTabela}].${value}.faixa_etaria`}
                    type="hidden"
                    defaultValue={record.uuid}
                  />
                </div>
              );
            }}
          />
          <Table.Column
            title="Valor Unitário"
            dataIndex="valor_unitario"
            key="valor_unitario"
            render={(_, record: any) => (
              <Field
                component={InputText}
                name={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const percentualAcrescimo =
                    form.getState().values.tabelas[chaveTabela]?.[
                      record.__str__
                    ]?.percentual_acrescimo || 0;
                  const valorUnitarioTotal =
                    stringDecimalToNumber(value) *
                    (1 + stringDecimalToNumber(percentualAcrescimo) / 100);

                  form.change(
                    `tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`,
                    formatarTotal(valorUnitarioTotal),
                  );
                  form.change(
                    `tabelas[${chaveTabela}].${record.__str__}.valor_unitario`,
                    value,
                  );
                }}
              />
            )}
          />
          <Table.Column
            title="% de Acréscimo"
            dataIndex="percentual_acrescimo"
            key="percentual_acrescimo"
            render={(_, record: any) => (
              <Field
                component={InputText}
                name={`tabelas[${chaveTabela}].${record.__str__}.percentual_acrescimo`}
                placeholder="%"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const valorUnitario =
                    form.getState().values.tabelas[chaveTabela]?.[
                      record.__str__
                    ]?.valor_unitario || "0";

                  const valorUnitarioTotal =
                    stringDecimalToNumber(valorUnitario) *
                    (1 + stringDecimalToNumber(value) / 100);

                  form.change(
                    `tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`,
                    formatarTotal(valorUnitarioTotal),
                  );
                  form.change(
                    `tabelas[${chaveTabela}].${record.__str__}.percentual_acrescimo`,
                    value,
                  );

                  if (record.__str__ === faixasEtarias[0].__str__)
                    atualizarPercentuais(value);
                }}
              />
            )}
          />
          <Table.Column
            title="Valor Total"
            dataIndex="valor_unitario_total"
            key="valor_unitario_total"
            render={(_, record: any) => (
              <Field
                component={InputText}
                name={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                disabled
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
};
