import { Table } from "antd";
import { Field } from "react-final-form";
import { AInputNumber } from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";
import { FormApi } from "final-form";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  grupoSelecionado: string;
  periodo: string;
};

export function TabelaAlimentacaoCEI({
  form,
  faixasEtarias,
  grupoSelecionado,
  periodo,
}: Props) {
  const labelTabela =
    grupoSelecionado === "grupo_2"
      ? `CEI - Período ${periodo}`
      : `Período ${periodo}`;
  const nomeTabela = "Preço das Alimentações";

  return (
    <div className="row mt-5">
      <div className="col">
        <h2 className="text-start texto-simples-verde fw-bold mb-3">
          {nomeTabela} -{" "}
          <span className={`titulo-tag periodo-${periodo.toLowerCase()}`}>
            {labelTabela}
          </span>
        </h2>

        <Table pagination={false} bordered dataSource={faixasEtarias}>
          <Table.Column
            title="Faixas Etárias"
            dataIndex="__str__"
            key="__str__"
            render={(value, record: any) => (
              <div>
                <p className="fw-bold mb-0">{value}</p>
                <Field
                  component="input"
                  name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.faixa_etaria`}
                  type="hidden"
                  defaultValue={record.uuid}
                />
              </div>
            )}
          />
          <Table.Column
            title="Valor Unitário"
            dataIndex="valor_unitario"
            key="valor_unitario"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const valorReajuste =
                    form.getState().values.tabelas[
                      `${nomeTabela} - ${labelTabela}`
                    ]?.[record.__str__]?.valor_unitario_reajuste || 0;
                  const valorTotal = value + Number(valorReajuste);

                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_total`,
                    valorTotal ? valorTotal.toFixed(2) : undefined,
                  );
                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario`,
                    value,
                  );
                }}
              />
            )}
          />
          <Table.Column
            title="Valor Unitário Reajuste"
            dataIndex="valor_unitario_reajuste"
            key="valor_unitario_reajuste"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_reajuste`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const valorUnitario =
                    form.getState().values.tabelas[
                      `${nomeTabela} - ${labelTabela}`
                    ]?.[record.__str__]?.valor_unitario || 0;
                  const valorTotal = Number(valorUnitario) + value;

                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_total`,
                    valorTotal ? valorTotal.toFixed(2) : undefined,
                  );
                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_reajuste`,
                    value,
                  );
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
                component={AInputNumber}
                name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_total`}
                placeholder="0,00"
                disabled
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
}
