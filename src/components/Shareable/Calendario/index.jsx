import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import "moment/dist/locale/pt-br";
import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import dragAndDropAddon from "react-big-calendar/lib/addons/dragAndDrop";
import { ModalConfirmarExclusao } from "src/components/Shareable/Calendario/componentes//ModalConfirmarExclusao";
import { CustomToolbar } from "src/components/Shareable/Calendario/componentes/CustomToolbar";
import { ModalCadastrarNoCalendario } from "src/components/Shareable/Calendario/componentes/ModalCadastrarNoCalendario";
import { ModalEditar } from "src/components/Shareable/Calendario/componentes/ModalEditar";
import { formataComoEventos } from "src/components/Shareable/Calendario/helpers";
import "src/components/Shareable/Calendario/style.scss";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { getDDMMYYYfromDate, getYYYYMMDDfromDate } from "src/helpers/utilities";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getNumerosEditais } from "src/services/edital.service";
import { getFeriadosNoMesComNome } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getTiposSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import { ModalFeriado } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/components/ModalFeriado";
moment.locale("pt-br");

// O Vite 8 mantém a exportação padrão aninhada deste módulo CommonJS.
const withDragAndDrop = dragAndDropAddon.default ?? dragAndDropAddon;
const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);
export class Calendario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objetos: undefined,
      loadingDiasCalendario: false,
      tiposUnidades: undefined,
      editais: [],
      erroAPI: false,
      showModalCadastrar: false,
      showModalEditar: false,
      showModalConfirmarExclusao: false,
      currentEvent: undefined,
      mes: moment().month() + 1,
      ano: moment().year(),
      hasNavigatedOnce: false,
      feriadosNoMes: undefined,
      currentFeriado: undefined,
      showModalFeriado: false,
      tiposSobremesaDoce: undefined,
    };

    this.moveEvent = this.moveEvent.bind(this);
    this.handleSelectSlot = this.handleSelectSlot.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.getObjetosAsync = this.getObjetosAsync.bind(this);
    this.getEditaisAsync = this.getEditaisAsync.bind(this);
    this.getTiposUnidadeEscolarAsync =
      this.getTiposUnidadeEscolarAsync.bind(this);
    this.getFeriadosNoMesAsync = this.getFeriadosNoMesAsync.bind(this);
    this.getTiposSobremesaDoceAsync =
      this.getTiposSobremesaDoceAsync.bind(this);
  }

  componentDidMount() {
    const { mes, ano } = this.state;
    const { isSobremesaDoce } = this.props;
    this.getObjetosAsync();
    this.getTiposUnidadeEscolarAsync();
    this.getEditaisAsync();
    this.getFeriadosNoMesAsync(mes, ano);
    if (isSobremesaDoce) {
      this.getTiposSobremesaDoceAsync();
    }
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

  async getTiposUnidadeEscolarAsync() {
    const response = await getTiposUnidadeEscolar();
    if (response.status === HTTP_STATUS.OK) {
      this.setState({ tiposUnidades: response.data.results });
    } else {
      this.setState({ erroAPI: true });
    }
  }

  async getEditaisAsync() {
    const response = await getNumerosEditais({
      excluir_encerrados: true,
      excluir_parceira: true,
    });
    if (response.status === HTTP_STATUS.OK) {
      this.setState({ editais: response.data.results });
    } else {
      this.setState({ erroAPI: true });
    }
  }

  async getFeriadosNoMesAsync(mes, ano) {
    const response = await getFeriadosNoMesComNome({ mes, ano });
    if (response.status === HTTP_STATUS.OK) {
      this.setState({ feriadosNoMes: response.data.results });
    }
  }

  async getTiposSobremesaDoceAsync() {
    const response = await getTiposSobremesaDoce();
    if (response.status === HTTP_STATUS.OK) {
      this.setState({ tiposSobremesaDoce: response.data });
    }
  }

  async moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    if (event.title === "FERIADO") return;
    const { objetos } = this.state;
    const { nomeObjeto, setObjeto, podeEditar } = this.props;
    if (!podeEditar) return;

    const idx = objetos.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = {
      ...event,
      data: getDDMMYYYfromDate(start),
      start,
      end,
      allDay,
    };

    const nextEvents = [...objetos];
    nextEvents.splice(idx, 1, updatedEvent);

    const cadastros_calendario_payload = [];
    nextEvents
      .filter((e) => e.data === getDDMMYYYfromDate(event.start))
      .forEach((evento) => {
        const entry = {
          editais: evento.editais_uuids,
          tipo_unidades: [evento.tipo_unidade.uuid],
        };
        if (evento.tipo?.uuid) {
          entry.tipo = evento.tipo.uuid;
        }
        cadastros_calendario_payload.push(entry);
      });
    const payload = {
      cadastros_calendario: cadastros_calendario_payload,
      data: getYYYYMMDDfromDate(event.start),
    };

    await setObjeto(payload);

    const cadastros_calendario_payload2 = [];
    nextEvents
      .filter((e) => e.data === getDDMMYYYfromDate(start))
      .forEach((evento) => {
        const entry = {
          editais: evento.editais_uuids,
          tipo_unidades: [evento.tipo_unidade.uuid],
        };
        if (evento.tipo?.uuid) {
          entry.tipo = evento.tipo.uuid;
        }
        cadastros_calendario_payload2.push(entry);
      });
    const payload2 = {
      cadastros_calendario: cadastros_calendario_payload2,
      data: getYYYYMMDDfromDate(start),
    };

    const response2 = await setObjeto(payload2);
    if (response2.status === HTTP_STATUS.CREATED) {
      toastSuccess(`Dia de ${nomeObjeto} atualizado com sucesso`);
    }

    this.setState({
      objetos: nextEvents,
    });
  }

  handleSelectSlot(event) {
    this.setState({
      currentEvent: event,
      showModalCadastrar: true,
    });
  }

  handleEvent(event) {
    if (event.title === "FERIADO") {
      this.setState({
        currentFeriado: event,
        showModalFeriado: true,
      });
      return;
    }
    this.setState({
      currentEvent: event,
      showModalEditar: true,
    });
  }

  render() {
    const {
      objetos,
      loadingDiasCalendario,
      tiposUnidades,
      erroAPI,
      currentEvent,
      showModalCadastrar,
      showModalEditar,
      showModalConfirmarExclusao,
      editais,
      hasNavigatedOnce,
      feriadosNoMes,
      currentFeriado,
      showModalFeriado,
      mes,
      ano,
      tiposSobremesaDoce,
    } = this.state;
    const {
      nomeObjeto,
      nomeObjetoMinusculo,
      setObjeto,
      deleteObjeto,
      podeEditar,
    } = this.props;

    const feriadoDias = new Set(
      (feriadosNoMes || []).map((f) => Number(f.dia)),
    );
    const eventosComFeriados = [
      ...(objetos || []),
      ...(feriadosNoMes || []).map((item) => ({
        title: "FERIADO",
        feriado: item.feriado,
        start: new Date(ano, mes - 1, Number(item.dia), 0),
        end: new Date(ano, mes - 1, Number(item.dia), 1),
        allDay: true,
      })),
    ];

    return (
      <div className="card calendario-sobremesa mt-3">
        <div className="card-body">
          <Spin
            tip="Carregando calendário..."
            spinning={(!editais || !tiposUnidades || !objetos) && !erroAPI}
          >
            {erroAPI && (
              <div>
                Erro ao carregar dados sobre tipos de unidades. Tente novamente
                mais tarde.
              </div>
            )}
            {editais && tiposUnidades && objetos && (
              <>
                <p>
                  Para cadastrar um dia para{" "}
                  <strong>{nomeObjetoMinusculo}</strong>, clique sobre o dia e
                  selecione o tipo de unidade.
                </p>
                <Spin
                  tip={`Carregando dias de ${nomeObjeto}...`}
                  spinning={loadingDiasCalendario}
                >
                  <DragAndDropCalendar
                    tooltipAccessor={(e) => e.editais_numeros}
                    eventPropGetter={(event) => {
                      if (event.title === "FERIADO") {
                        return { className: "rbc-event-feriado" };
                      }
                      if (event.tipo?.nome === "Sobremesa AF") {
                        return { className: "rbc-event-sobremesa-af" };
                      }
                      return {};
                    }}
                    dayPropGetter={(date) => {
                      if (feriadoDias.has(date.getDate())) {
                        return { style: { backgroundColor: "#e6e6e6" } };
                      }
                      return {};
                    }}
                    style={{ height: 1000 }}
                    formats={{
                      weekdayFormat: (date, culture, localizer) =>
                        localizer.format(date, "dddd", culture),
                    }}
                    selectable
                    resizable={false}
                    localizer={localizer}
                    events={eventosComFeriados}
                    onSelectEvent={this.handleEvent}
                    onEventDrop={this.moveEvent}
                    onSelectSlot={this.handleSelectSlot}
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
                      const novoMes = date.getMonth() + 1;
                      const novoAno = date.getFullYear();
                      this.setState({
                        mes: novoMes,
                        ano: novoAno,
                      });
                      this.getObjetosAsync({
                        mes: novoMes,
                        ano: novoAno,
                      });
                      this.getFeriadosNoMesAsync(novoMes, novoAno);
                    }}
                    defaultView={Views.MONTH}
                  />
                </Spin>
                {currentEvent && podeEditar && (
                  <>
                    <ModalCadastrarNoCalendario
                      showModal={showModalCadastrar}
                      nomeObjetoNoCalendario={nomeObjeto}
                      nomeObjetoNoCalendarioMinusculo={nomeObjetoMinusculo}
                      closeModal={() =>
                        this.setState({
                          showModalCadastrar: false,
                        })
                      }
                      objetos={objetos}
                      tiposUnidades={tiposUnidades}
                      editais={editais}
                      event={currentEvent}
                      getObjetosAsync={this.getObjetosAsync}
                      setObjetoAsync={setObjeto}
                      tiposSobremesaDoce={tiposSobremesaDoce}
                    />
                    {showModalEditar && (
                      <ModalEditar
                        showModal={showModalEditar}
                        nomeObjetoNoCalendario={nomeObjeto}
                        nomeObjetoNoCalendarioMinusculo={nomeObjetoMinusculo}
                        closeModal={() =>
                          this.setState({ showModalEditar: false })
                        }
                        event={currentEvent}
                        setShowModalConfirmarExclusao={() =>
                          this.setState({ showModalConfirmarExclusao: true })
                        }
                      />
                    )}
                    {showModalConfirmarExclusao && (
                      <ModalConfirmarExclusao
                        showModal={showModalConfirmarExclusao}
                        nomeObjetoNoCalendario={nomeObjeto}
                        nomeObjetoNoCalendarioMinusculo={nomeObjetoMinusculo}
                        closeModal={() =>
                          this.setState({ showModalConfirmarExclusao: false })
                        }
                        event={currentEvent}
                        getObjetosAsync={this.getObjetosAsync}
                        deleteObjetoAsync={deleteObjeto}
                      />
                    )}
                  </>
                )}
                {currentFeriado && (
                  <ModalFeriado
                    showModal={showModalFeriado}
                    closeModal={() =>
                      this.setState({ showModalFeriado: false })
                    }
                    event={currentFeriado}
                  />
                )}
              </>
            )}
          </Spin>
        </div>
      </div>
    );
  }
}
