import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  ContratoInterface,
  EmpenhoInterface,
  FiltrosInterface,
  ResponseEmpenhosInterface,
} from "src/interfaces/empenhos.interface";
import {
  getContratosVigentes,
  getEmpenhos,
} from "src/services/medicaoInicial/empenhos.service";
import {
  MEDICAO_INICIAL,
  EMPENHOS,
  CADASTRO_DE_EMPENHO,
  EDITAR_EMPENHO,
} from "src/configs/constants";
import "./styles.scss";
import { Filtros } from "./components/Filtros";
import { formataValorDecimal } from "../../helper.jsx";

type Edital = {
  uuid: string;
  numero: string;
};

export function Empenhos() {
  const [contratos, setContratos] = useState<ContratoInterface[]>([]);
  const [editais, setEditais] = useState<Edital[]>([]);
  const [empenhos, setEmpenhos] = useState<EmpenhoInterface[]>([]);
  const [filtros, setFiltros] = useState<FiltrosInterface>();
  const [responseEmpenhos, setResponseEmpenhos] =
    useState<ResponseEmpenhosInterface>();
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [erroAPI, setErroAPI] = useState("");

  const getContratosAsync = async () => {
    try {
      const { data } = await getContratosVigentes();
      const editais = data.results
        .filter((contrato) => contrato.edital)
        .map((contrato) => contrato.edital);

      setContratos(data.results);
      setEditais(editais);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar contratos vigentes. Tente novamente mais tarde. " +
          error.ToString()
      );
    }
  };

  const getEmpenhosAsync = async (
    page: number = null,
    filtros: FiltrosInterface = null
  ) => {
    try {
      const { data } = await getEmpenhos(page, filtros);
      setEmpenhos(data.results);
      setResponseEmpenhos(data);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar empenhos. Tente novamente mais tarde." +
          error.ToString()
      );
    }
  };

  useEffect(() => {
    setPaginaAtual(1);
    requisicoesPreRender();
  }, []);

  const requisicoesPreRender = async () => {
    await Promise.all([getEmpenhosAsync(), getContratosAsync()]).then(() => {
      setCarregando(false);
    });
  };

  const capitalize = (value: string) => {
    const primeiraLetra = value[0].toUpperCase();
    const restoDoTexto = value.slice(1).toLowerCase();
    return primeiraLetra + restoDoTexto;
  };

  const onChangePage = async (page: number, filtros: FiltrosInterface) => {
    setPaginaAtual(page);
    setCarregando(true);
    await getEmpenhosAsync(page, filtros);
    setCarregando(false);
  };

  return (
    <div className="empenhos">
      {erroAPI && <div>{erroAPI}</div>}

      <Spin tip="Carregando..." spinning={carregando}>
        {!erroAPI ? (
          <div className="card mt-3">
            <div className="card-body">
              <Filtros
                onSubmit={async (values) => {
                  setFiltros(values);
                  onChangePage(1, values);
                }}
                onClear={() => {
                  setFiltros({});
                  onChangePage(1, {});
                }}
                contratos={contratos}
                editais={editais}
              />

              <div className="mt-4">
                <Link
                  to={`/${MEDICAO_INICIAL}/${EMPENHOS}/${CADASTRO_DE_EMPENHO}/`}
                  className="pt-4"
                >
                  <Botao
                    texto="Cadastrar Empenho"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                  />
                </Link>

                {empenhos.length === 0 && !carregando ? (
                  <div className="text-center mt-4 mb-4">
                    Nenhum resultado encontrado
                  </div>
                ) : (
                  <div className="tabela-empenhos mt-4 mb-4">
                    <div className="titulo-tabela mt-5 mb-3">
                      Empenhos Cadastrados
                    </div>

                    <table>
                      <thead>
                        <tr className="row">
                          <th className="col-2">Nº do Empenho</th>
                          <th className="col-2">Nº do Contrato</th>
                          <th className="col-3">Edital</th>
                          <th className="col-1">Tipo</th>
                          <th className="col-2">Valor do Empenho</th>
                          <th className="col-1">Status</th>
                          <th className="col-1">Ações</th>
                        </tr>
                      </thead>

                      <tbody>
                        {empenhos.map((empenho) => (
                          <tr key={empenho.numero} className="row">
                            <td className="col-2">{empenho.numero}</td>
                            <td className="col-2">{empenho.contrato}</td>
                            <td className="col-3">{empenho.edital}</td>
                            <td className="col-1">
                              {capitalize(empenho.tipo_empenho)}
                            </td>
                            <td className="col-2">
                              {formataValorDecimal(empenho.valor_total)}
                            </td>
                            <td className="col-1">
                              {capitalize(empenho.status)}
                            </td>
                            <td className="col-1 d-flex justify-content-center align-item-center">
                              <Link
                                to={`/${MEDICAO_INICIAL}/${EMPENHOS}/${EDITAR_EMPENHO}/?uuid=${empenho.uuid}`}
                              >
                                <span className="px-2">
                                  <i
                                    title="Editar Empenho"
                                    className="verde fas fa-edit"
                                  />
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <Paginacao
                      onChange={(page: number) => onChangePage(page, filtros)}
                      total={responseEmpenhos?.count}
                      pageSize={responseEmpenhos?.page_size}
                      current={paginaAtual}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Spin>
    </div>
  );
}
