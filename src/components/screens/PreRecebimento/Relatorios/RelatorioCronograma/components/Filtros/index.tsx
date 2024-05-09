import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import "./styles.scss";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "components/Shareable/AutoCompleteSelectField";
import { InputComData } from "components/Shareable/DatePicker";
import { getListaCompletaProdutosLogistica } from "../../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../../helpers/autoCompleteSelect";
import { getListaCronogramasPraCadastro } from "../../../../../../../services/cronograma.service";
import {
  CronogramaRelatorio,
  EmpresaFiltros,
  FiltrosRelatorioCronograma,
} from "../../interfaces";
import { getEmpresasCronograma } from "services/terceirizada.service";
import CollapseFiltros from "components/Shareable/CollapseFiltros";
import { ProdutoLogistica } from "interfaces/produto.interface";
import { montarOptionsStatus } from "../../../../CronogramaEntrega/components/Filtros/utils";
import { CronogramaSimples } from "interfaces/pre_recebimento.interface";

interface Props {
  setFiltros: Dispatch<SetStateAction<FiltrosRelatorioCronograma>>;
  setCronogramas: Dispatch<SetStateAction<CronogramaRelatorio[]>>;
  setConsultaRealizada?: Dispatch<SetStateAction<boolean>>;
}

const Filtros: React.FC<Props> = ({
  setFiltros,
  setCronogramas,
  setConsultaRealizada,
}) => {
  const [fornecedores, setFornecedores] = useState<Array<EmpresaFiltros>>([]);
  const [listaProdutos, setListaProdutos] = useState<Array<ProdutoLogistica>>(
    []
  );
  const [dadosCronogramas, setDadosCronogramas] = useState<
    Array<CronogramaSimples>
  >([]);

  const buscaFornecedores = async () => {
    const response = await getEmpresasCronograma();
    setFornecedores(
      response.data.results.map((fornecedor: EmpresaFiltros) => ({
        value: fornecedor.uuid,
        label: fornecedor.nome_fantasia,
      }))
    );
  };

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };

  const buscarDadosCronogramas = async (): Promise<void> => {
    const response = await getListaCronogramasPraCadastro();
    setDadosCronogramas(response.data.results);
  };

  const onSubmit = (values: Record<string, any>): void => {
    let filtros = { ...values };
    if (values.data_criacao) {
      delete filtros.data_criacao;
      filtros.data_cadastro = moment(values.data_criacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    setFiltros(filtros);
  };

  const onClear = () => {
    setCronogramas([]);
    setConsultaRealizada(false);
    setFiltros({});
  };

  useEffect(() => {
    buscaFornecedores();
    buscarListaProdutos();
    buscarDadosCronogramas();
  }, []);

  return (
    <div className="filtros-documentos-recebimento">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-6 mt-2">
              <Field
                label="Empresa"
                component={MultiSelect}
                name="empresa"
                multiple
                nomeDoItemNoPlural="empresas"
                options={fornecedores}
                placeholder="Selecione uma ou mais Empresas"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  listaProdutos.map((e) => e.nome),
                  values.nome_produto,
                  true
                )}
                label="Filtrar por Produto"
                name="nome_produto"
                placeholder="Selecione um Produto"
              />
            </div>

            <div className="col-3 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  dadosCronogramas.map((e) => e.numero),
                  values.numero,
                  true
                )}
                label="Filtrar por Nº do Cronograma"
                name="numero"
                placeholder="Selecione um cronograma"
              />
            </div>

            <div className="col-3 mt-2">
              <Field
                component={MultiSelect}
                disableSearch
                options={montarOptionsStatus()}
                label="Filtrar por Status"
                name="status"
                nomeDoItemNoPlural="Status"
                placeholder="Selecione os Status"
              />
            </div>

            <div className="col-3 mt-2">
              <Field
                component={InputComData}
                label="Filtrar por Período de Recebimento"
                name="data_inicial"
                className="data-field-cronograma"
                placeholder="De"
                minDate={null}
                maxDate={
                  values.data_final
                    ? moment(values.data_final, "DD/MM/YYYY").toDate()
                    : null
                }
              />
            </div>
            <div className="col-3 mt-2">
              <Field
                component={InputComData}
                label="&nbsp;"
                name="data_final"
                className="data-field-cronograma"
                popperPlacement="bottom-end"
                placeholder="Até"
                minDate={
                  values.data_inicial
                    ? moment(values.data_inicial, "DD/MM/YYYY").toDate()
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
