import { Table } from "antd";
import { Field } from "react-final-form";
import { AInputNumber } from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";
import { FormApi } from "final-form";

const ALIMENTACOES = ["Lanche", "Lanche 4h"];

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado?: string | null;
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

  return (
    <div className="row mt-5">
      <div className="col">
        {["grupo_2", "grupo_4"].includes(grupoSelecionado) ? (
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
                    name={`tabelas[${nomeTabela}].${value}_${record.grupo}.tipo_alimentacao`}
                    type="hidden"
                    defaultValue={record.uuid}
                  />
                  <Field
                    component="input"
                    name={`tabelas[${nomeTabela}].${value}_${record.grupo}.grupo`}
                    type="hidden"
                    defaultValue={record.grupo}
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
                component={AInputNumber}
                name={`tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const percentualAcrescimo =
                    form.getState().values.tabelas[nomeTabela]?.[
                      `${record.nome}_${record.grupo}`
                    ]?.percentual_acrescimo || 0;
                  const valorUnitarioTotal =
                    value * (1 + percentualAcrescimo / 100);

                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_total`,
                    valorUnitarioTotal
                      ? Number(valorUnitarioTotal.toFixed(2))
                      : undefined,
                  );
                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario`,
                    value,
                  );
                }}
              />
            )}
          />
          <Table.Column
            title="% de acréscimo"
            dataIndex="percentual_acrescimo"
            key="percentual_acrescimo"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela}].${record.nome}_${record.grupo}.percentual_acrescimo`}
                placeholder="%"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const valorUnitario =
                    form.getState().values.tabelas[nomeTabela]?.[
                      `${record.nome}_${record.grupo}`
                    ]?.valor_unitario || 0;
                  const valorUnitarioTotal = valorUnitario * (1 + value / 100);

                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_total`,
                    valorUnitarioTotal
                      ? Number(valorUnitarioTotal.toFixed(2))
                      : undefined,
                  );
                  form.change(
                    `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.percentual_acrescimo`,
                    value,
                  );
                }}
              />
            )}
          />
          <Table.Column
            title="Valor Unit. Total"
            dataIndex="valor_unitario_total"
            key="valor_unitario_total"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_total`}
                placeholder="0,00"
                disabled
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
};
