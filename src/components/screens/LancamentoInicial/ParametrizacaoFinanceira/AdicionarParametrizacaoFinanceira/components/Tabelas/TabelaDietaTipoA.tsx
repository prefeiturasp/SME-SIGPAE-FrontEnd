import { Table } from "antd";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { formatarTotal } from "../../helpers";
import InputText from "src/components/Shareable/Input/InputText";
import { stringDecimalToNumber } from "src/helpers/parsers";

const ALIMENTACOES_CIEJA = ["Refeição", "Lanche 4h"];
const ALIMENTACOES_TIPO_A = ["Refeição", "Lanche", "Lanche 4h"];

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
  tipoTurma?: string;
  temaTag?: string;
  bloqueiaEdicao?: boolean;
};

export default ({
  form,
  tiposAlimentacao,
  grupoSelecionado,
  tipoTurma = "",
  temaTag = "",
  bloqueiaEdicao,
}: Props) => {
  const grupoTipo2 = grupoSelecionado.toLowerCase().includes("grupo 2");
  const grupoTipo4 = grupoSelecionado.toLowerCase().includes("grupo 4");
  const grupoTipo5 = grupoSelecionado.toLowerCase().includes("grupo 5");
  const grupoTipo6 = grupoSelecionado.toLowerCase().includes("grupo 6");
  const nomeTabela = `Dietas Tipo A e Tipo A Enteral${grupoTipo2 ? "" : "/Restrição de Aminoácidos"}`;

  const ListaDeAlimentacoes = grupoTipo6
    ? ALIMENTACOES_CIEJA
    : ALIMENTACOES_TIPO_A;

  const alimentacoes = tiposAlimentacao
    .filter((t) => ListaDeAlimentacoes.includes(t.nome))
    .flatMap((ta) => {
      if (ta.nome === "Refeição" && grupoTipo4) {
        return [
          {
            ...ta,
            nome: "Refeição - Dieta Enteral - EJA",
          },
          {
            ...ta,
            nome: "Refeição - Dieta Enteral - CEU EMEF, CEU GESTÃO, EMEF, EMEFM",
          },
        ];
      }
      return {
        ...ta,
        grupo: ta.nome === "Refeição" ? "Dieta Enteral" : null,
      };
    })
    .reverse();

  const labelTabela = tipoTurma ? `${nomeTabela} - ${tipoTurma}` : nomeTabela;

  const atualizarPercentuais = (value: string) => {
    alimentacoes.forEach((tipo) => {
      form.change(
        `tabelas[${labelTabela}].${tipo.nome}.percentual_acrescimo`,
        String(value),
      );

      const valorUnitario =
        form.getState().values.tabelas[`${labelTabela}`]?.[tipo.nome]
          ?.valor_unitario || "0";
      const valorUnitarioTotal =
        stringDecimalToNumber(valorUnitario) *
        (1 + stringDecimalToNumber(String(value)) / 100);

      form.change(
        `tabelas[${labelTabela}].${tipo.nome}.valor_unitario_total`,
        formatarTotal(valorUnitarioTotal),
      );
    });
  };

  return (
    <div className="row mt-5">
      <div className="col">
        {(grupoTipo2 || grupoTipo5) && tipoTurma ? (
          <h2 className={`text-start texto-simples-verde fw-bold mb-3`}>
            {`Preço das ${nomeTabela}`} -{" "}
            <span className={`titulo-tag ${temaTag}`}>{tipoTurma}</span>
          </h2>
        ) : (
          <h2 className="text-start texto-simples-verde fw-bold">
            Preço das Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos
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
                    name={`tabelas[${labelTabela}].${value}.tipo_alimentacao`}
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
                dataTestId={`tabelas[${labelTabela}].${record.nome}.valor_unitario`}
                name={`tabelas[${labelTabela}].${record.nome}.valor_unitario`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const percentualAcrescimo =
                    form.getState().values.tabelas[labelTabela]?.[record.nome]
                      ?.percentual_acrescimo || 0;
                  const valorUnitarioTotal =
                    stringDecimalToNumber(value) *
                    (1 + stringDecimalToNumber(percentualAcrescimo) / 100);

                  form.change(
                    `tabelas[${labelTabela}].${record.nome}.valor_unitario_total`,
                    formatarTotal(valorUnitarioTotal),
                  );
                  form.change(
                    `tabelas[${labelTabela}].${record.nome}.valor_unitario`,
                    value,
                  );
                }}
                disabled={bloqueiaEdicao}
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
                dataTestId={`tabelas[${labelTabela}].${record.nome}.percentual_acrescimo`}
                name={`tabelas[${labelTabela}].${record.nome}.percentual_acrescimo`}
                placeholder="%"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const valorUnitario =
                    form.getState().values.tabelas[labelTabela]?.[record.nome]
                      ?.valor_unitario || "0";

                  const valorUnitarioTotal =
                    stringDecimalToNumber(valorUnitario) *
                    (1 + stringDecimalToNumber(value) / 100);

                  form.change(
                    `tabelas[${labelTabela}].${record.nome}.valor_unitario_total`,
                    formatarTotal(valorUnitarioTotal),
                  );
                  form.change(
                    `tabelas[${labelTabela}].${record.nome}.percentual_acrescimo`,
                    value,
                  );
                  if (record.nome === alimentacoes[0].nome)
                    atualizarPercentuais(value);
                }}
                disabled={bloqueiaEdicao}
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
                dataTestId={`tabelas[${labelTabela}].${record.nome}.valor_unitario_total`}
                name={`tabelas[${labelTabela}].${record.nome}.valor_unitario_total`}
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
