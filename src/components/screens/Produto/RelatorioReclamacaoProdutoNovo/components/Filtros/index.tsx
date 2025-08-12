import { Spin } from "antd";
import { FormApi } from "final-form";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { CollapseFiltros } from "src/components/Shareable/CollapseFiltros";
import { InputComData } from "src/components/Shareable/DatePicker";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { MeusDadosInterface } from "src/context/MeusDadosContext/interfaces";
import { requiredMultiselect } from "src/helpers/fieldValidators";
import {
  usuarioEhCogestorDRE,
  usuarioEhEmpresa,
  usuarioEhEscola,
} from "src/helpers/utilities";
import { getLotesSimples } from "src/services/lote.service";
import {
  getNomesTerceirizadas,
  getNomesUnicosEditais,
  getNomesUnicosFabricantes,
  getNomesUnicosMarcas,
  getNomesUnicosProdutos,
} from "src/services/produto.service";
import { IFormValues } from "../../interfaces";
import { getOpcoesStatusReclamacao } from "./helpers";

type IFiltrosProps = {
  setErroAPI: (_erroAPI: string) => void;
  meusDados: MeusDadosInterface;
  consultarProdutos: (_values: IFormValues, _page: number) => void;
  formInstance: FormApi;
  setFormInstance: (_formInstance: FormApi) => void;
  setPage: (_page: number) => void;
};

export const Filtros = ({ ...props }: IFiltrosProps) => {
  const {
    setErroAPI,
    meusDados,
    consultarProdutos,
    formInstance,
    setFormInstance,
    setPage,
  } = props;

  const [editais, setEditais] =
    useState<Array<{ label: string; value: string }>>();
  const [produtos, setProdutos] = useState<Array<string>>();
  const [produtosFiltrados, setProdutosFiltrados] = useState<Array<string>>();
  const [marcas, setMarcas] = useState<Array<string>>();
  const [marcasFiltradas, setMarcasFiltradas] = useState<Array<string>>();
  const [fabricantes, setFabricantes] = useState<Array<string>>();
  const [fabricantesFiltrados, setFabricantesFiltrados] =
    useState<Array<string>>();
  const [lotes, setLotes] = useState<Array<{ label: string; value: string }>>();
  const [terceirizadas, setTerceirizadas] =
    useState<Array<{ label: string; value: string }>>();

  const [loadingFiltros, setLoadingFiltros] = useState<boolean>(true);

  const getEditaisAsync = async () => {
    const response = await getNomesUnicosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setEditais(
        response.data.results.map((element: string) => {
          return { value: element, label: element };
        })
      );
    } else {
      setErroAPI("Erro ao carregar Editais. Tente novamente mais tarde.");
    }
  };

  const getProdutosAsync = async () => {
    const response = await getNomesUnicosProdutos();
    if (response.status === HTTP_STATUS.OK) {
      setProdutos(response.data.results);
    } else {
      setErroAPI("Erro ao carregar Produtos. Tente novamente mais tarde.");
    }
  };

  const getMarcasAsync = async () => {
    const response = await getNomesUnicosMarcas();
    if (response.status === HTTP_STATUS.OK) {
      setMarcas(response.data.results);
    } else {
      setErroAPI("Erro ao carregar Marcas. Tente novamente mais tarde.");
    }
  };

  const getFabricantesAsync = async () => {
    const response = await getNomesUnicosFabricantes();
    if (response.status === HTTP_STATUS.OK) {
      setFabricantes(response.data.results);
    } else {
      setErroAPI("Erro ao carregar Fabricantes. Tente novamente mais tarde.");
    }
  };

  const getLotesAsync = async () => {
    let params = {};
    if (usuarioEhEscola()) {
      params["uuid"] = meusDados.vinculo_atual.instituicao.lotes[0].uuid;
    } else if (usuarioEhCogestorDRE()) {
      params["diretoria_regional__uuid"] =
        meusDados.vinculo_atual.instituicao.uuid;
    } else if (usuarioEhEmpresa()) {
      params["terceirizada__uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getLotesSimples(params);
    if (response.status === HTTP_STATUS.OK) {
      setLotes(
        response.data.results.map((element) => {
          return {
            label: `${element.nome} - ${element.diretoria_regional.iniciais}`,
            value: element.uuid,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getTerceirizadasAsync = async () => {
    let params = {};
    if (usuarioEhEscola()) {
      params["dre_uuid"] =
        meusDados.vinculo_atual.instituicao.diretoria_regional.uuid;
    } else if (usuarioEhCogestorDRE()) {
      params["dre_uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getNomesTerceirizadas(params);
    if (response.status === HTTP_STATUS.OK) {
      setTerceirizadas(
        response.data.results.map((element) => {
          return {
            label: `${element.nome_fantasia}`,
            value: element.uuid,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar terceirizadas. Tente novamente mais tarde.");
    }
  };

  const getInitialValues = () => {
    if (loadingFiltros) return null;

    const getValues = (items?: { value: string }[]) =>
      items?.length === 1 ? items.map((t) => t.value) : [];

    const editaisValues = getValues(editais);
    const lotesValues = getValues(lotes);

    let terceirizadasValues = getValues(terceirizadas);
    if (!terceirizadasValues.length && usuarioEhEmpresa()) {
      terceirizadasValues = [meusDados.vinculo_atual.instituicao.uuid];
    }

    return {
      editais: editaisValues,
      terceirizadas: terceirizadasValues,
      lotes: lotesValues,
    };
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([
      getEditaisAsync(),
      getProdutosAsync(),
      getMarcasAsync(),
      getFabricantesAsync(),
      getLotesAsync(),
      getTerceirizadasAsync(),
    ]).then(() => {
      setLoadingFiltros(false);
    });
  };

  const handleSearch = useCallback(
    (
      value: string,
      lista: Array<string>,
      setListaFiltrada: (_lista: Array<string>) => void
    ) => {
      const filtrado = lista.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setListaFiltrada(filtrado);
    },
    []
  );

  const onSubmit = async (values: IFormValues) => {
    consultarProdutos(values, 1);
    setPage(1);
  };

  const onClear = (form: FormApi) => {
    if (terceirizadas?.length === 1) {
      form.change(
        "terceirizadas",
        terceirizadas.map((t) => t.value)
      );
    } else if (usuarioEhEmpresa()) {
      form.change("terceirizadas", [meusDados.vinculo_atual.instituicao.uuid]);
    } else {
      form.change("terceirizadas", undefined);
    }
    if (editais?.length === 1) {
      form.change(
        "editais",
        editais.map((t) => t.value)
      );
    } else {
      form.change("editais", undefined);
    }
    if (lotes?.length === 1) {
      form.change(
        "lotes",
        lotes.map((t) => t.value)
      );
    } else {
      form.change("lotes", undefined);
    }
    form.change("status_reclamacao", undefined);
    form.change("nome_produto", undefined);
    form.change("nome_marca", undefined);
    form.change("nome_fabricante", undefined);
    form.change("data_inicial_reclamacao", undefined);
    form.change("data_final_reclamacao", undefined);
  };

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={() => onClear(formInstance)}
      titulo="Filtrar Resultados"
      initialValues={getInitialValues()}
      keepDirtyOnReinitialize
    >
      {(values, form) => (
        <Spin tip="Carregando filtros..." spinning={loadingFiltros}>
          <>
            {!formInstance && setFormInstance(form)}
            <div className="row">
              <div className="col-4">
                <Field
                  label="Edital"
                  component={MultiselectRaw}
                  dataTestId="select-editais"
                  required
                  validate={requiredMultiselect}
                  name="editais"
                  placeholder="Selecione o Edital"
                  options={editais || []}
                  selected={values.editais || []}
                  onSelectedChanged={(
                    values_: Array<{ label: string; value: string }>
                  ) => {
                    form.change(
                      `editais`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                  disabled={editais?.length === 1}
                />
              </div>
              <div className="col-8">
                <Field
                  component={AutoCompleteField}
                  dataSource={produtosFiltrados}
                  onSearch={(value: string) =>
                    handleSearch(value, produtos, setProdutosFiltrados)
                  }
                  label="Nome do Produto"
                  placeholder="Digite o nome do produto"
                  name="nome_produto"
                  dataTestId="div-input-nome-produto"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  component={AutoCompleteField}
                  dataSource={marcasFiltradas}
                  onSearch={(value: string) =>
                    handleSearch(value, marcas, setMarcasFiltradas)
                  }
                  label="Marca"
                  placeholder="Digite a marca do produto"
                  name="nome_marca"
                  dataTestId="div-input-nome-marca"
                />
              </div>
              <div className="col-4">
                <Field
                  component={AutoCompleteField}
                  dataSource={fabricantesFiltrados}
                  onSearch={(value: string) =>
                    handleSearch(value, fabricantes, setFabricantesFiltrados)
                  }
                  label="Fabricante"
                  placeholder="Digite o fabricante do produto"
                  name="nome_fabricante"
                  dataTestId="div-input-nome-fabricante"
                />
              </div>
              <div className="col-4">
                <Field
                  label="Status da Reclamação"
                  component={MultiselectRaw}
                  dataTestId="select-status"
                  name="status_reclamacao"
                  placeholder="Selecione o status"
                  options={getOpcoesStatusReclamacao()}
                  selected={values.status_reclamacao || []}
                  onSelectedChanged={(
                    values_: Array<{ label: string; value: string }>
                  ) => {
                    form.change(
                      `status_reclamacao`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Field
                  label="Lote/DRE"
                  component={MultiselectRaw}
                  dataTestId="select-lotes"
                  name="lotes"
                  placeholder="Selecione Lotes/DREs"
                  options={lotes || []}
                  selected={values.lotes || []}
                  onSelectedChanged={(
                    values_: Array<{ label: string; value: string }>
                  ) => {
                    form.change(
                      `lotes`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                  disabled={lotes?.length === 1}
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  name="data_inicial_reclamacao"
                  className="data-inicial"
                  label="Período"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_final_reclamacao
                      ? moment(
                          values.data_final_reclamacao,
                          "DD/MM/YYYY"
                        ).toDate()
                      : moment().toDate()
                  }
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  name="data_final_reclamacao"
                  popperPlacement="bottom-end"
                  label="&nbsp;"
                  placeholder="Até"
                  minDate={
                    values.data_inicial_reclamacao
                      ? moment(
                          values.data_inicial_reclamacao,
                          "DD/MM/YYYY"
                        ).toDate()
                      : null
                  }
                  maxDate={moment().toDate()}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Field
                  label="Empresas"
                  component={MultiselectRaw}
                  dataTestId="select-empresas"
                  name="terceirizadas"
                  placeholder="Selecione as empresas"
                  options={terceirizadas || []}
                  selected={values.terceirizadas || []}
                  onSelectedChanged={(
                    values_: Array<{ label: string; value: string }>
                  ) => {
                    form.change(
                      `terceirizadas`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                  disabled={terceirizadas?.length === 1 || usuarioEhEmpresa()}
                />
              </div>
            </div>
          </>
        </Spin>
      )}
    </CollapseFiltros>
  );
};
