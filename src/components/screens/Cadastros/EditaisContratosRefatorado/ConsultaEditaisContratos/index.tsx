import { Spin } from "antd";

import { Paginacao } from "src/components/Shareable/Paginacao";
import HTTP_STATUS from "http-status-codes";
import { ResponseEditalCotratoInterface } from "src/interfaces/responses.interface";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { Form } from "react-final-form";
import { getEditaisContratos } from "src/services/edital.service";
import { EditalContratoListadoInterface } from "../interfaces";
import { CamposEditalContrato } from "./components/CamposEditalContrato";
import { Header } from "./components/Header";
import { LinhaEditalContrato } from "./components/ListaContratoEdital";
import "./style.scss";

export const ConsultaEditaisContratos = () => {
  const [editaisContratos, setEditaisContratos] =
    useState<Array<EditalContratoListadoInterface>>(undefined);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("");

  const getEditaisContratosAsync = async (params = null): Promise<void> => {
    const response = await getEditaisContratos<ResponseEditalCotratoInterface>(
      params
    );
    if (response.status === HTTP_STATUS.OK) {
      setEditaisContratos(
        response.data.results.map((edital: EditalContratoListadoInterface) => {
          return {
            ativo: false,
            ...edital,
          };
        })
      );
      setCount(response.data.count);
    } else {
      setErro(
        "Erro ao carregar editais e contratos. Tente novamente mais tarde."
      );
    }
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([getEditaisContratosAsync()]).then(() => {
      setLoading(false);
    });
  };

  const nextPage = async ({
    page,
    values,
  }: {
    page: number;
    values: { buscar?: string };
  }): Promise<void> => {
    setPage(page);
    setLoading(true);
    await getEditaisContratosAsync({ page: page, buscar: values.buscar });
    setLoading(false);
  };

  const onSubmit = () => {};

  const REQUISICOES_FINALIZADAS = !loading && editaisContratos;

  return (
    <div className="consulta-editais-contratos mt-3">
      <Spin tip="Carregando..." spinning={!REQUISICOES_FINALIZADAS}>
        {erro && <div className="mt-3">{erro}</div>}
        {!erro && editaisContratos && (
          <Form keepDirtyOnReinitialize onSubmit={onSubmit}>
            {({ handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <Header
                    getEditaisContratosAsync={getEditaisContratosAsync}
                    setLoading={setLoading}
                    page={page}
                    setPage={setPage}
                  />
                  <hr className="header" />
                  {editaisContratos.map((editalContrato, index) => {
                    return (
                      <div key={index} className="p-1">
                        <LinhaEditalContrato
                          editalContrato={editalContrato}
                          setEditaisContratos={setEditaisContratos}
                          editaisContratos={editaisContratos}
                          index={index}
                        />
                        <hr />
                        <Collapse isOpened={editalContrato.ativo}>
                          <CamposEditalContrato
                            editalContrato={editalContrato}
                          />
                        </Collapse>
                      </div>
                    );
                  })}
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={count}
                    showSizeChanger={false}
                    onChange={(page: number) => {
                      nextPage({ page, values });
                    }}
                    pageSize={10}
                  />
                </div>
              </form>
            )}
          </Form>
        )}
      </Spin>
    </div>
  );
};
