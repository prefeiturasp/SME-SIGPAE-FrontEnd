import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getGuiasInconsistencias,
  vinculaGuiasComEscolas,
} from "src/services/logistica.service";
import ListagemInconsistencias from "./ListagemInconsistencias";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Filtros from "./Filtros";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [guias, setGuias] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [total, setTotal] = useState();
  const [page, setPage] = useState();

  const inicioResultado = useRef();

  const buscarGuias = async (page) => {
    setCarregando(true);

    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getGuiasInconsistencias(params);
    if (response.data.count) {
      setGuias(response.data.results);
      setTotal(response.data.count);
      inicioResultado.current.scrollIntoView();
    } else {
      setTotal(response.data.count);
      setGuias();
    }
    setCarregando(false);
  };

  const vincularGuias = async () => {
    const res = await vinculaGuiasComEscolas();
    try {
      if (res.status === 200) {
        toastSuccess(res.data.message);
        buscarGuias(page);
        setCarregando(false);
      } else {
        toastError("Houve um erro ao vincular as guias.");
      }
    } catch (e) {
      toastError("Houve um erro ao vincular as guias.");
    }
  };

  useEffect(() => {
    if (filtros) {
      buscarGuias(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = (page) => {
    buscarGuias(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-gestao-inconsistencias">
        <div className="card-body gestao-inconsistencias">
          <Filtros
            setFiltros={setFiltros}
            setGuias={setGuias}
            setTotal={setTotal}
            guias={guias}
            inicioResultado={inicioResultado}
          />
          {guias && (
            <>
              <br />
              <hr />
              <div className="button-container-inconsistencias">
                <Botao
                  texto="Vincular"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-end ms-3"
                  onClick={() => {
                    vincularGuias();
                  }}
                />
              </div>
              <ListagemInconsistencias guias={guias} />
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
              </div>
            </>
          )}
          {total === 0 && (
            <div className="text-center mt-5">
              Não existe informação para os critérios de busca utilizados.
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};
