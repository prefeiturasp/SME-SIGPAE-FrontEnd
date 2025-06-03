import {
  jsxs as _jsxs,
  jsx as _jsx,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { CustomToolbar } from "src/components/Shareable/CalendarioCronograma/componentes/CustomToolbar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { formataComoEventos } from "src/components/Shareable/CalendarioCronograma/helpers";
import { Spin } from "antd";
import { ModalCronograma } from "src/components/Shareable/CalendarioCronograma/componentes/ModalCronograma";
import "src/components/Shareable/CalendarioCronograma/style.scss";
import { useState } from "react";
const localizer = momentLocalizer(moment);
export const CalendarioCronograma = ({
  getObjetos,
  nomeObjeto,
  nomeObjetoMinusculo,
}) => {
  const [objetos, setObjetos] = useState(undefined);
  const [loadingDiasCalendario, setLoadingDiasCalendario] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(undefined);
  const [showModalCronograma, setShowModalCronograma] = useState(false);
  const [mes, setMes] = useState(moment().month() + 1);
  const [ano, setAno] = useState(moment().year());
  useEffect(() => {
    getObjetosAsync({ mes, ano });
  }, [mes, ano]);
  const getObjetosAsync = async (params) => {
    setLoadingDiasCalendario(true);
    const response = await getObjetos(params);
    if (response.status === HTTP_STATUS.OK) {
      setObjetos(formataComoEventos(response.data.results));
    }
    if (response) {
      setLoadingDiasCalendario(false);
    }
  };
  const handleEvent = (event) => {
    setCurrentEvent(event);
    setShowModalCronograma(true);
  };
  return _jsx("div", {
    className: "card calendario-sobremesa mt-3",
    children: _jsx("div", {
      className: "card-body",
      children: _jsx(Spin, {
        tip: "Carregando calend\u00E1rio...",
        spinning: !objetos,
        children:
          objetos &&
          _jsxs(_Fragment, {
            children: [
              _jsxs("p", {
                children: [
                  "Para visualizar detalhes dos ",
                  nomeObjetoMinusculo,
                  ", clique sobre o item no dia programado.",
                ],
              }),
              _jsx(Spin, {
                tip: `Carregando dias de ${nomeObjeto}...`,
                spinning: loadingDiasCalendario,
                children: _jsx(Calendar, {
                  style: { height: 1000 },
                  formats: {
                    weekdayFormat: (date, culture, localizer) =>
                      localizer.format(date, "dddd", culture),
                  },
                  selectable: true,
                  resizable: false,
                  localizer: localizer,
                  events: objetos,
                  onSelectEvent: handleEvent,
                  components: {
                    toolbar: CustomToolbar,
                  },
                  messages: {
                    showMore: (target) =>
                      _jsxs("span", {
                        className: "ms-2",
                        role: "presentation",
                        children: ["...", target, " mais"],
                      }),
                  },
                  onNavigate: (date) => {
                    setMes(date.getMonth() + 1);
                    setAno(date.getFullYear());
                  },
                  defaultView: Views.MONTH,
                }),
              }),
              showModalCronograma &&
                currentEvent &&
                _jsx(ModalCronograma, {
                  showModal: showModalCronograma,
                  closeModal: () => setShowModalCronograma(false),
                  event: currentEvent,
                }),
            ],
          }),
      }),
    }),
  });
};
