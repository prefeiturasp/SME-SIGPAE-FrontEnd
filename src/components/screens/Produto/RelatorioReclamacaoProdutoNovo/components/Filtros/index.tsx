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
  getNomesUnicosFabricantes,
  getNomesUnicosMarcas,
  getNomesUnicosProdutos,
} from "src/services/produto.service";
import { getOpcoesStatusReclamacao } from "./helpers";
import { getLotesSimples } from "src/services/lote.service";
import { MeusDadosInterface } from "src/context/MeusDadosContext/interfaces";
import {
  usuarioEhCogestorDRE,
  usuarioEhEmpresa,
  usuarioEhEscola,
} from "src/helpers/utilities";

type IFiltrosProps = {
  setErroAPI: (_erroAPI: string) => void;
  meusDados: MeusDadosInterface;
};

export const Filtros = ({ ...props }: IFiltrosProps) => {
  const { setErroAPI, meusDados } = props;

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
                  placeholder="Digite o nome do produto"
                  name="nome_produto"
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
                />
              </div>
              <div className="col-4">
                <Field
                  label="Status da Reclamação"
                  component={MultiselectRaw}
                  dataTestId="select-status"
                  name="status"
                  placeholder="Selecione os status"
                  options={getOpcoesStatusReclamacao()}
                  selected={values.status || []}
                  onSelectedChanged={(
                    values_: Array<{ label: string; value: string }>
                  ) => {
                    form.change(
                      `status`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  label="Lote/DRE"
                  component={MultiselectRaw}
                  dataTestId="select-lote"
                  name="lotes"
                  placeholder="Selecione os status"
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
                />
              </div>
            </div>
          </>
        </Spin>
      )}
    </CollapseFiltros>
  );
};
