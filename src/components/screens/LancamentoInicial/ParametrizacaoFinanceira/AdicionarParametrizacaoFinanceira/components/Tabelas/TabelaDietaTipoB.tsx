import { Table } from "antd";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { formatarTotal } from "../../helpers";
import InputText from "src/components/Shareable/Input/InputText";
import { stringDecimalToNumber } from "src/helpers/parsers";

const ALIMENTACOES = ["Lanche", "Lanche 4h"];

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado?: string;
  tipoTurma?: string;
};

export default ({
  form,
  tiposAlimentacao,
  grupoSelecionado,
  tipoTurma = "",
}: Props) => {
  const alimentacoes = tiposAlimentacao.filter((t) =>
    ALIMENTACOES.includes(t.nome),
  );

  const nomeTabela = tipoTurma
    ? `Dietas Tipo B - ${tipoTurma}`
    : "Dietas Tipo B";

  const atualizarPercentuais = (value: string) => {
    tiposAlimentacao.forEach((tipo) => {
      form.change(
        `tabelas[${nomeTabela}].${tipo.nome}.percentual_acrescimo`,
        String(value),
      );

      const valorUnitario =
        form.getState().values.tabelas[`${nomeTabela}`]?.[tipo.nome]
          ?.valor_unitario || "0";
      const valorUnitarioTotal =
        stringDecimalToNumber(valorUnitario) *
        (1 + stringDecimalToNumber(String(value)) / 100);

      form.change(
        `tabelas[${nomeTabela}].${tipo.nome}.valor_unitario_total`,
        formatarTotal(valorUnitarioTotal),
      );
    });
  };

  return (
    <div className="row mt-5">
      <div className="col">
        {["grupo 2", "grupo 4"].includes(grupoSelecionado.toLowerCase()) ? (
          <h2 className="text-start texto-simples-verde fw-bold mb-3">
            Preço das Dietas Tipo B -{" "}
            <span
              className={`titulo-tag turma-${tipoTurma
                .replace(/\s/g, "-")
                .toLocaleLowerCase()}`}
            >
              {tipoTurma}
            </span>
          </h2>
        ) : (
          <h2 className="text-start texto-simples-verde fw-bold">
            Preço das Dietas Tipo B
          </h2>
        )}

        <Table pagination={false} bordered dataSource={alimentacoes}>
          <Table.Column
            title="Tipo de Alimentação"
            dataIndex="nome"
            key="nome"
            render={(value, record: any) => {
              return (
                <div>
                  <p className="fw-bold mb-0">
                    {value} {record.grupo && `- ${record.grupo}`}
                  </p>
                  <Field
                    component="input"
                    name={`tabelas[${nomeTabela}].${value}.tipo_alimentacao`}
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
                name={`tabelas[${nomeTabela}].${record.nome}.valor_unitario`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const percentualAcrescimo =
                    form.getState().values.tabelas[nomeTabela]?.[record.nome]
                      ?.percentual_acrescimo || 0;
                  const valorUnitarioTotal =
                    stringDecimalToNumber(value) *
                    (1 + stringDecimalToNumber(percentualAcrescimo) / 100);

                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}.valor_unitario_total`,
                    formatarTotal(valorUnitarioTotal),
                  );
                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}.valor_unitario`,
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
                name={`tabelas[${nomeTabela}].${record.nome}.percentual_acrescimo`}
                placeholder="%"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const valorUnitario =
                    form.getState().values.tabelas[nomeTabela]?.[record.nome]
                      ?.valor_unitario || "0";

                  const valorUnitarioTotal =
                    stringDecimalToNumber(valorUnitario) *
                    (1 + stringDecimalToNumber(value) / 100);

                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}.valor_unitario_total`,
                    formatarTotal(valorUnitarioTotal),
                  );
                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}.percentual_acrescimo`,
                    value,
                  );

                  if (record.nome === tiposAlimentacao[0].nome)
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
                name={`tabelas[${nomeTabela}].${record.nome}.valor_unitario_total`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                disabled
                readOnly
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
};
