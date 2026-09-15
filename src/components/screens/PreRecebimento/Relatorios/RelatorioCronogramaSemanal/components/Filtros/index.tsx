import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import "./styles.scss";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import InputText from "src/components/Shareable/Input/InputText";
import { InputComData } from "src/components/Shareable/DatePicker";
import { getListaCompletaProdutosLogistica } from "../../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../../helpers/autoCompleteSelect";
import {
  CronogramaSemanalRelatorio,
  EmpresaFiltros,
  FiltrosRelatorioCronograma,
} from "../../interfaces";
import { getEmpresasCronograma } from "src/services/terceirizada.service";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { ProdutoLogistica } from "src/interfaces/produto.interface";

interface Props {
  setFiltros: Dispatch<SetStateAction<FiltrosRelatorioCronograma>>;
  setCarregando: Dispatch<SetStateAction<boolean>>;
  setCronogramas: Dispatch<SetStateAction<CronogramaSemanalRelatorio[]>>;
  setConsultaRealizada?: Dispatch<SetStateAction<boolean>>;
}

const OPCOES_STATUS = [
  { value: "RASCUNHO", label: "Rascunho" },
  { value: "ENVIADO_AO_FORNECEDOR", label: "Enviado ao Fornecedor" },
  { value: "FORNECEDOR_CIENTE", label: "Fornecedor Ciente" },
];

const Filtros: React.FC<Props> = ({
  setFiltros,
  setCarregando,
  setCronogramas,
  setConsultaRealizada,
}) => {
  const [fornecedores, setFornecedores] = useState<Array<EmpresaFiltros>>([]);
  const [listaProdutos, setListaProdutos] = useState<Array<ProdutoLogistica>>(
    [],
  );

  const buscaFornecedores = async () => {
    const response = await getEmpresasCronograma();
    setFornecedores(
      response.data.results.map((fornecedor: EmpresaFiltros) => ({
        value: fornecedor.uuid,
        label: fornecedor.nome_fantasia,
      })),
    );
  };

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };

  const formatarMes = (valor: string): string =>
    moment(valor, "MM/YYYY").format("YYYY-MM-DD");

  const onSubmit = (values: Record<string, any>): void => {
    const filtros = { ...values };
    if (values.mes_inicial) {
      filtros.mes_inicial = formatarMes(values.mes_inicial);
    }
    if (values.mes_final) {
      filtros.mes_final = formatarMes(values.mes_final);
    }
    setFiltros(filtros);
  };

  const onClear = () => {
    setCronogramas([]);
    setConsultaRealizada && setConsultaRealizada(false);
    setFiltros({});
  };

  useEffect(() => {
    (async () => {
      setCarregando(true);
      await Promise.all([buscaFornecedores(), buscarListaProdutos()]);
      setCarregando(false);
    })();
  }, []);

  return (
    <div className="filtros-relatorio-cronograma-semanal">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-4 mt-2">
              <Field
                label="Filtrar por Empresa"
                component={MultiSelect}
                name="empresa"
                multiple
                nomeDoItemNoPlural="empresas"
                options={fornecedores}
                placeholder="Selecione uma ou mais Empresas"
                pluralFeminino={true}
              />
            </div>

            <div className="col-4 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  listaProdutos.map((e) => e.nome),
                  values.nome_produto,
                  true,
                )}
                label="Filtrar por Produto"
                name="nome_produto"
                placeholder="Selecione um Produto"
              />
            </div>

            <div className="col-4 mt-2">
              <Field
                component={InputText}
                label="Nº do Cronograma Mensal"
                name="numero_cronograma_mensal"
                placeholder="Digite o nº do Cronograma Mensal"
              />
            </div>

            <div className="col-4 mt-2">
              <Field
                component={InputText}
                label="Nº do Cronograma Semanal"
                name="numero_cronograma_semanal"
                placeholder="Digite o nº do Cronograma Semanal"
              />
            </div>

            <div className="col-4 mt-2">
              <Field
                component={MultiSelect}
                label="Filtrar por Status"
                disableSearch
                name="status"
                multiple
                nomeDoItemNoPlural="status"
                options={OPCOES_STATUS}
              />
            </div>

            <div className="col-2 mt-2">
              <Field
                component={InputComData}
                label="Filtrar por Mês de Entrega"
                name="mes_inicial"
                className="data-field-cronograma"
                placeholder="De"
                showMonthYearPicker
                dateFormat="MM/YYYY"
                dateFormatPicker="MM/yyyy"
                minDate={null}
                maxDate={
                  values.mes_final
                    ? moment(values.mes_final, "MM/YYYY").toDate()
                    : null
                }
              />
            </div>
            <div className="col-2 mt-2">
              <Field
                component={InputComData}
                label="&nbsp;"
                name="mes_final"
                className="data-field-cronograma"
                popperPlacement="bottom-end"
                placeholder="Até"
                showMonthYearPicker
                dateFormat="MM/YYYY"
                dateFormatPicker="MM/yyyy"
                minDate={
                  values.mes_inicial
                    ? moment(values.mes_inicial, "MM/YYYY").toDate()
                    : null
                }
                maxDate={null}
              />
            </div>
          </div>
        )}
      </CollapseFiltros>
    </div>
  );
};

export default Filtros;
