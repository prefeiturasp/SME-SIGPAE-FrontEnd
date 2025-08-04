import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { CollapseFiltros } from "src/components/Shareable/CollapseFiltros";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { requiredMultiselect } from "src/helpers/fieldValidators";
import {
  getNomesUnicosEditais,
  getNomesUnicosProdutos,
} from "src/services/produto.service";

type IFiltrosProps = {
  setErroAPI: (_erroAPI: string) => void;
};

export const Filtros = ({ ...props }: IFiltrosProps) => {
  const { setErroAPI } = props;

  const [editais, setEditais] =
    useState<Array<{ label: string; value: string }>>();
  const [produtos, setProdutos] = useState<Array<string>>();
  const [produtosFiltrados, setProdutosFiltrados] = useState<Array<string>>();

  const [loadingFiltros, setLoadingFiltros] = useState<boolean>(false);

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

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([getEditaisAsync(), getProdutosAsync()]).then(() => {
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

  const onSubmit = async () => {};

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={() => {}}
      titulo="Filtrar Resultados"
    >
      {(values, form) => (
        <Spin tip="Carregando filtros..." spinning={loadingFiltros}>
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
                  placeholder="Digite nome do produto"
                  className="input-busca-produto"
                  name="nome_produto"
                />
              </div>
            </div>
          </>
        </Spin>
      )}
    </CollapseFiltros>
  );
};
