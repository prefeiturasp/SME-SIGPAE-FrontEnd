import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import dragAndDropAddon from "react-big-calendar/lib/addons/dragAndDrop";
import { ModalDadosObjeto } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/components/ModalDadosObjeto";
import { ModalFeriado } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/components/ModalFeriado";
import { CustomToolbar } from "src/components/Shareable/Calendario/componentes/CustomToolbar";
import "src/components/Shareable/Calendario/style.scss";
import { getFeriadosNoMesComNome } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { formataComoEventos } from "./helpers";
moment.locale("pt-br");

const withDragAndDrop = dragAndDropAddon.default ?? dragAndDropAddon;
const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

export const CalendarioEdicaoExterna = ({
  getObjetos,
  nomeObjeto,
  nomeObjetoMinusculo,
  setObjeto,
}) => {
  const [objetos, setObjetos] = useState();
  const [loadingDiasCalendario, setLoadingDiasCalendario] = useState(false);
  const [erroAPI, setErroAPI] = useState(false);
  const [currentEvent, setCurrentEvent] = useState();
  const [showModalDadosObjeto, setShowModalDadosObjeto] = useState(false);
  const [hasNavigatedOnce, setHasNavigatedOnce] = useState(false);
  const [feriadosNoMes, setFeriadosNoMes] = useState();
  const [currentFeriado, setCurrentFeriado] = useState();
  const [showModalFeriado, setShowModalFeriado] = useState(false);

  const [mes, setMes] = useState(moment().month() + 1);
  const [ano, setAno] = useState(moment().year());

  const getObjetosAsync = useCallback(
    async (params) => {
      setLoadingDiasCalendario(true);
      const response = await getObjetos(
        params ? { mes: params.mes, ano: params.ano } : { mes, ano },
      );
      if (response.status === HTTP_STATUS.OK) {
        setObjetos(formataComoEventos(response.data.results || response.data));
      }
      if (response) {
        setLoadingDiasCalendario(false);
      }
    },
    [getObjetos, mes, ano],
  );

  const getFeriadosNoMesAsync = async (mes, ano) => {
    const params_feriados_no_mes = {
      mes: mes,
      ano: ano,
    };
    const response = await getFeriadosNoMesComNome(params_feriados_no_mes);
    if (response.status === HTTP_STATUS.OK) {
      setFeriadosNoMes(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar feriados do mês para esta escola. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    getObjetosAsync();
    getFeriadosNoMesAsync(mes, ano);
  }, []);

  const handleEvent = useCallback((event) => {
    if (event.title === "FERIADO") {
      setCurrentFeriado(event);
      setShowModalFeriado(true);
    } else {
      setCurrentEvent(event);
      setShowModalDadosObjeto(true);
    }
  }, []);

  const feriadoDias = useMemo(
    () => new Set((feriadosNoMes || []).map((f) => Number(f.dia))),
    [feriadosNoMes],
  );

  const eventosComFeriados = useMemo(() => {
    const feriadoEvents = (feriadosNoMes || []).map((item) => {
      const diaNum = Number(item.dia);
      return {
        title: "FERIADO",
        feriado: item.feriado,
        start: new Date(ano, mes - 1, diaNum, 0),
        end: new Date(ano, mes - 1, diaNum, 1),
        allDay: true,
      };
    });
    return [...(objetos || []), ...feriadoEvents];
  }, [objetos, feriadosNoMes, mes, ano]);

  const eventPropGetter = useCallback((event) => {
    if (event.title === "FERIADO") {
      return { className: "rbc-event-feriado" };
    }
    return {};
  }, []);

  const dayPropGetter = useCallback(
    (date) => {
      if (feriadoDias.has(date.getDate())) {
        return { style: { backgroundColor: "#e6e6e6" } };
      }
      return {};
    },
    [feriadoDias],
  );

  return (
    <div className="card calendario-sobremesa mt-3">
      <div className="card-body">
        <Spin tip="Carregando calendário..." spinning={!objetos && !erroAPI}>
          {erroAPI && <div>{erroAPI}</div>}
          {objetos && (
            <>
              <Spin
                tip={`Carregando dias ${nomeObjeto}...`}
                spinning={loadingDiasCalendario}
              >
                <DragAndDropCalendar
                  tooltipAccessor={(e) => e.editais_numeros}
                  style={{ height: 1000 }}
                  formats={{
                    weekdayFormat: (date, culture, localizer) =>
                      localizer.format(date, "dddd", culture),
                  }}
                  selectable
                  resizable={false}
                  localizer={localizer}
                  events={eventosComFeriados}
                  eventPropGetter={eventPropGetter}
                  dayPropGetter={dayPropGetter}
                  onSelectEvent={handleEvent}
                  components={{
                    toolbar: CustomToolbar,
                  }}
                  messages={{
                    showMore: (target) => (
                      <span className="ms-2" role="presentation">
                        ...{target} mais
                      </span>
                    ),
                  }}
                  onNavigate={(date) => {
                    if (!hasNavigatedOnce) {
                      setHasNavigatedOnce(true);
                      return;
                    }
                    setMes(date.getMonth() + 1);
                    setAno(date.getFullYear());
                    getObjetosAsync({
                      mes: date.getMonth() + 1,
                      ano: date.getFullYear(),
                    });
                    getFeriadosNoMesAsync(
                      date.getMonth() + 1,
                      date.getFullYear(),
                    );
                  }}
                  defaultView={Views.MONTH}
                />
              </Spin>
              {currentEvent && (
                <ModalDadosObjeto
                  showModal={showModalDadosObjeto}
                  nomeObjetoNoCalendario={nomeObjeto}
                  nomeObjetoNoCalendarioMinusculo={nomeObjetoMinusculo}
                  closeModal={() => setShowModalDadosObjeto(false)}
                  objetos={objetos}
                  event={currentEvent}
                  getObjetosAsync={getObjetosAsync}
                  setObjetoAsync={setObjeto}
                />
              )}
              {currentFeriado && (
                <ModalFeriado
                  showModal={showModalFeriado}
                  closeModal={() => setShowModalFeriado(false)}
                  event={currentFeriado}
                />
              )}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};
