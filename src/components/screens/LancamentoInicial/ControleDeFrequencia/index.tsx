import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Filtros } from "./components/Filtros/Index";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  getFiltros,
  getMesesAnos,
  getTotalAlunosMatriculados,
  imprimirRelatorioControleFrequencia,
} from "src/services/medicaoInicial/controleDeFrequencia.service";
import { formataData, dataAtualDDMMYYYY } from "src/helpers/utilities";
import { MESES } from "src/constants/shared";
import "./styles.scss";

type MesAno = {
  mes: number;
  ano: number;
};

type Periodo = {
  uuid: string;
  nome: string;
};

type FiltrosProps = {
  data_inicial?: string;
  data_final?: string;
  periodos?: string[];
  mes_ano?: string;
};

export function ControleDeFrequencia() {
  const [mesesAnos, setMesesAnos] = useState<MesAno[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [erroAPI, setErroAPI] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtros, setFiltros] = useState<FiltrosProps>({});
  const [totalAlunosPorPeriodo, setTotalAlunosPorPeriodo] =
    useState<Record<string, number>>(null);
  const [totalMatriculados, setTotalMatriculados] = useState(0);
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState("");
  const [imprimindo, setImprimindo] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const getMesesAnosAsync = async () => {
    setCarregando(true);
    try {
      const { data } = await getMesesAnos();
      setMesesAnos(data.results);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar meses de referência. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };

  const getFiltrosAsync = async (mesSelecionado: string) => {
    setMesAnoSelecionado(mesSelecionado);
    const [mes, ano] = mesSelecionado.split("_");
    setCarregando(true);
    try {
      const { data } = await getFiltros(mes, ano);
      setPeriodos(data.periodos);
      setDataInicial(data.data_inicial);
      setDataFinal(data.data_final);
    } catch (error) {
      setErroAPI("Erro ao carregar períodos. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  };

  const validaPeriodos = (valores: string[]) => {
    if (!valores) {
      return JSON.stringify(periodos.map((periodo) => periodo.uuid));
    }
    return JSON.stringify(valores);
  };

  const validaDatas = (data_inicial: string, data_final: string) => {
    if (!data_inicial && !data_final) {
      return {
        data_inicial: dataInicial,
        data_final: dataFinal,
      };
    } else if (data_inicial && !data_final) {
      return {
        data_inicial,
        data_final: data_inicial,
      };
    } else if (!data_inicial && data_final) {
      return {
        data_inicial: data_final,
        data_final,
      };
    } else {
      return {
        data_inicial,
        data_final,
      };
    }
  };

  const getAlunosMatriculados = async (filtros: FiltrosProps) => {
    setCarregando(true);
    try {
      const periodos = validaPeriodos(filtros.periodos);
      const datas = validaDatas(filtros.data_inicial, filtros.data_final);
      const params = {
        periodos,
        ...datas,
      };
      const { data } = await getTotalAlunosMatriculados(params);
      setTotalAlunosPorPeriodo(data.periodos);
      setTotalMatriculados(data.total_matriculados);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar os dados dos alunos matriculados. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };

  const getTitulo = () => {
    const dataInicialFormatada = filtros.data_inicial
      ? formataData(filtros.data_inicial, "YYYY-MM-DD", "DD/MM/YYYY")
      : null;
    const dataFinalFormatada = filtros.data_final
      ? formataData(filtros.data_final, "YYYY-MM-DD", "DD/MM/YYYY")
      : null;

    if (filtros.data_inicial && filtros.data_final) {
      if (filtros.data_inicial === filtros.data_final)
        return `EM ${dataInicialFormatada}`;
      return `ENTRE ${dataInicialFormatada} E ${dataFinalFormatada}`;
    } else if (filtros.data_inicial || filtros.data_final) {
      return `EM ${dataInicialFormatada || dataFinalFormatada}`;
    } else {
      return `EM ${dataAtualDDMMYYYY()}`;
    }
  };

  const mesAnoFiltrado = filtros.mes_ano ? filtros.mes_ano.split("_") : null;

  useEffect(() => {
    getMesesAnosAsync();
  }, []);

  const imprimirPDF = async () => {
    setImprimindo(true);
    try {
      const periodos = validaPeriodos(filtros.periodos);
      const dataInicial = () => {
        if (!filtros.data_inicial && filtros.data_final) {
          return filtros.data_final;
        } else {
          return filtros.data_inicial;
        }
      };
      const dataFinal = () => {
        if (filtros.data_inicial && !filtros.data_final) {
          return filtros.data_inicial;
        } else {
          return filtros.data_final;
        }
      };
      const params = {
        periodos,
        mes_ano: mesAnoSelecionado,
        data_inicial: dataInicial(),
        data_final: dataFinal(),
      };
      await imprimirRelatorioControleFrequencia(params);
      setExibirModalCentralDownloads(true);
    } catch (e) {
      toastError("Erro ao imprimir pdf. Tente novamente mais tarde.");
    }
    setImprimindo(false);
  };

  return (
    <div className="controle-de-frequencia">
      {erroAPI && <div>{erroAPI}</div>}

      <Spin tip="Carregando..." spinning={carregando}>
        {!erroAPI ? (
          <div className="card mt-3">
            <div className="card-body">
              <Filtros
                onSubmit={(values) => {
                  setFiltros(values);
                  getAlunosMatriculados(values);
                }}
                onClear={() => {
                  setFiltros({});
                  setTotalAlunosPorPeriodo(null);
                  setTotalMatriculados(0);
                }}
                mesesAnos={mesesAnos}
                periodos={periodos}
                getOpcoesFiltros={getFiltrosAsync}
                dataInicial={dataInicial}
                dataFinal={dataFinal}
              />

              <div className="mt-4">
                {totalMatriculados === 0 && !carregando && filtros.mes_ano && (
                  <div className="text-center mt-4 mb-4">
                    Nenhum resultado encontrado
                  </div>
                )}
                {totalMatriculados !== 0 && (
                  <div className="mt-4 mb-4">
                    <div className="titulo-botao mt-4 mb-3">
                      <div className="container-titulo">
                        <p>{`TOTAL DE MATRICULADOS NA UNIDADE ${getTitulo()}:`}</p>
                        <span className="card-total">{totalMatriculados}</span>
                      </div>
                      <div>
                        <Botao
                          className="ms-3 float-end"
                          texto="Imprimir"
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          icon={BUTTON_ICON.PRINT}
                          type={BUTTON_TYPE.BUTTON}
                          disabled={imprimindo}
                          onClick={imprimirPDF}
                        />
                      </div>
                    </div>

                    {Object.entries(totalAlunosPorPeriodo).map(
                      ([index, valor]) => {
                        return (
                          <div key={index} className="row container-cards mb-4">
                            <div
                              className={`card-total-matriculados-periodo periodo-${index.trim()}`}
                            >
                              <p>
                                MATRICULADOS <strong>PERÍODO {index}</strong>
                              </p>
                              <span className="card-total">{valor}</span>
                            </div>

                            <div className="mes-ano">
                              {`Mês: ${MESES[
                                Number(mesAnoFiltrado[0]) - 1
                              ].toUpperCase()}/${mesAnoFiltrado[1]}`}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Spin>
      <ModalSolicitacaoDownload
        show={exibirModalCentralDownloads}
        setShow={setExibirModalCentralDownloads}
      />
    </div>
  );
}
