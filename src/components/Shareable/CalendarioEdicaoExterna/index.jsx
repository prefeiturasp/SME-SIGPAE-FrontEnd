import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import "moment/dist/locale/pt-br";
import React from "react";
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

export class CalendarioEdicaoExterna extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objetos: undefined,
      loadingDiasCalendario: false,
      erroAPI: false,
      currentEvent: undefined,
      showModalDadosObjeto: false,
      mes: moment().month() + 1,
      ano: moment().year(),
      hasNavigatedOnce: false,
    };

    this.handleEvent = this.handleEvent.bind(this);
    this.getObjetosAsync = this.getObjetosAsync.bind(this);
  }

  componentDidMount() {
    this.getObjetosAsync();
  }

  async getObjetosAsync(params) {
    const { getObjetos } = this.props;
    const { mes, ano } = this.state;
    this.setState({ loadingDiasCalendario: true });
    const response = await getObjetos(
      params ? { mes: params.mes, ano: params.ano } : { mes, ano },
    );
    if (response.status === HTTP_STATUS.OK) {
      this.setState({
        objetos: formataComoEventos(response.data.results || response.data),
      });
    }
    if (response) {
      this.setState({ loadingDiasCalendario: false });
    }
  }

  handleEvent(event) {
    this.setState({
      currentEvent: event,
      showModalDadosObjeto: true,
    });
  }

  render() {
    const {
      objetos,
      loadingDiasCalendario,
      erroAPI,
      hasNavigatedOnce,
      currentEvent,
      showModalDadosObjeto,
    } = this.state;

    const { nomeObjeto, nomeObjetoMinusculo, setObjeto } = this.props;

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
                    onSelectEvent={this.handleEvent}
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
                        this.setState({ hasNavigatedOnce: true });
                        return;
                      }
                      this.setState({
                        mes: date.getMonth() + 1,
                        ano: date.getFullYear(),
                      });
                      this.getObjetosAsync({
                        mes: date.getMonth() + 1,
                        ano: date.getFullYear(),
                      });
                    }}
                    defaultView={Views.MONTH}
                  />
                </Spin>
                {currentEvent && (
                  <>
                    <ModalDadosObjeto
                      showModal={showModalDadosObjeto}
                      nomeObjetoNoCalendario={nomeObjeto}
                      nomeObjetoNoCalendarioMinusculo={nomeObjetoMinusculo}
                      closeModal={() =>
                        this.setState({
                          showModalDadosObjeto: false,
                        })
                      }
                      objetos={objetos}
                      event={currentEvent}
                      getObjetosAsync={this.getObjetosAsync}
                      setObjetoAsync={setObjeto}
                    />
                  </>
                )}
              </>
            )}
          </Spin>
        </div>
      </div>
    );
  }
}
