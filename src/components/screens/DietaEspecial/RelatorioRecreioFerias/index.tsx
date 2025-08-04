import HTTP_STATUS from "http-status-codes";
import { useContext, useState } from "react";
import { getRelatorioRecreioFerias } from "src/services/dietaEspecial.service";
import { Tabela } from "./components/Tabela";
import { IRelatorioDietaRecreioFerias } from "./interfaces";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Filtros } from "./components/Filtros";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { normalizarValues } from "../RelatorioHistoricoDietas/helper";

export const RelatorioRecreioFerias = () => {
  const [dietas, setDietas] = useState<IRelatorioDietaRecreioFerias[] | null>(
    null
  );
  const [erro, setErro] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [valuesForm, setValuesForm] = useState<object>(null);
  const { meusDados } = useContext(MeusDadosContext);

  const getRelatorioRecreioFeriasAsync = async (values: object) => {
    const params = normalizarValues(values, page);
    const response = await getRelatorioRecreioFerias(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietas(
        response.data.results.map((obj: IRelatorioDietaRecreioFerias) => ({
          ...obj,
          collapsed: false,
        }))
      );
      setTotal(response.data.count);
    } else {
      setErro(
        "Erro ao carregar relatório de dietas recreio nas férias. Tente novamente mais tarde."
      );
      setDietas(null);
      setTotal(0);
    }
  };

  const buscaResultado = async (params: object) => {
    setLoading(true);
    await getRelatorioRecreioFeriasAsync(params);
    setLoading(false);
  };

  const nextPage = (page: number) => {
    buscaResultado({ ...valuesForm, page: page });
    setPage(page);
  };

  return (
    <div className="relatorio-recreio-nas-ferias">
      <Spin tip="Carregando..." spinning={loading}>
        {erro && <div>{erro}</div>}
        {!erro && (
          <div className="card mt-3">
            <div className="card-body">
              <Filtros
                meusDados={meusDados}
                setDietas={setDietas}
                setValuesForm={setValuesForm}
                carregaDietas={getRelatorioRecreioFeriasAsync}
                setErro={setErro}
              />
              {dietas && (
                <>
                  <Tabela dietas={dietas} setDietas={setDietas} total={total} />
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
                  {total === 0 && (
                    <div className="text-center mt-5">
                      Nenhum resultado encontrado
                    </div>
                  )}
                  {total > 0 && (
                    <div className="row">
                      <div className="col-12 text-end">
                        <Botao
                          texto="Baixar Excel"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN}
                          icon={BUTTON_ICON.FILE_EXCEL}
                          onClick={async () => {}}
                        />
                        <Botao
                          texto="Baixar PDF"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN}
                          icon={BUTTON_ICON.FILE_PDF}
                          onClick={async () => {}}
                          className="ms-3"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};
