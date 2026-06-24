import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import "moment/dist/locale/pt-br";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import dragAndDropAddon from "react-big-calendar/lib/addons/dragAndDrop";
import { ModalDadosObjeto } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/components/ModalDadosObjeto";
import { CustomToolbar } from "src/components/Shareable/Calendario/componentes/CustomToolbar";
import "src/components/Shareable/Calendario/style.scss";
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
  const [erroAPI] = useState(false);
  const [currentEvent, setCurrentEvent] = useState();
  const [showModalDadosObjeto, setShowModalDadosObjeto] = useState(false);
  const [hasNavigatedOnce, setHasNavigatedOnce] = useState(false);

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

  useEffect(() => {
    getObjetosAsync();
  }, []);

  const handleEvent = useCallback((event) => {
    setCurrentEvent(event);
    setShowModalDadosObjeto(true);
  }, []);

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
                  events={objetos}
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
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};
