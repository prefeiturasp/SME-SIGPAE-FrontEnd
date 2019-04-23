import React, { Component } from 'react';
import { Editor } from "react-draft-wysiwyg";
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/esm/locale';
import InputRowSuspension from '../Shareable/InputRowSupension'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

class FoodSuspension extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isEnable: false,
      editorState: EditorState.createEmpty(),
      periods: []
    }
    this.verifyChecked = this.verifyChecked.bind(this)
    this.getPeriods = this.getPeriods.bind(this)
  }

  handleReason(e) {
    let value = e.target.value
    this.props.handleSelectedReason(value)
  }

  onEditorStateChange = (editorState) => {
    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    this.props.handleDescription(value)

    this.setState({
      editorState,
    })
  }

  getPeriods(period) {

    let list = this.props.periodsList

    if (list.length > 0) {
      let index = this.findIndexFromArrayByItens(list, period)

      list = this.removeItemFromArrayByIndex(index)
    }

    if (period) {
      list.push(period)
    }

  }


  findIndexFromArrayByItens(list, period) {
    return list.findIndex(x => x.period === period.period)
  }


  removeItemFromArrayByIndex(index) {

    let list = this.props.periodsList

    for (let i = 0; i < list.length; i++) {
      if (i === index) {
        list.splice(index, 1)
      }
    }

    return list
  }

  verifyChecked(event) {

    if (event) {
      this.setState({
        isEnable: true
      })
    } else {
      this.setState({
        isEnable: false
      })
    }
  }

  fontHeader = {
    color: "#686868"
  }
  bgMorning = {
    background: "#FFF7CB"
  }

  render() {

    const { enrolled, reasons, typeFood, day, periods } = this.props
    const { editorState } = this.state
    return (
      <div>
        <form onSubmit={this.props.handleSubmit}>
          <span className="page-title">Suspensão de Alimentação</span>
          <div className="card mt-3">
            <div className="card-body">
              <span className="blockquote-sme">Nº de Matriculados</span>
              <div></div>
              <span className="badge-sme badge-secondary-sme">{enrolled}</span>
              <span className="blockquote-sme pl-2 text-color-sme-silver">Informaçâo automática disponibilizada no Cadastro da Unidade Escolar</span>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <div className="card-title font-weight-bold" style={this.fontHeader}>Descrição da Suspensão</div>
              <table className="table table-borderless">
                <tr>
                  <td>Período</td>
                  <td style={{ "paddingLeft": "9rem" }}>Tipo de Alimentação</td>
                  <td>Nº de Alunos</td>
                </tr>
              </table>



              {periods.map((value, key) => {
                return <InputRowSuspension
                  key={key}
                  labelCheck={value.value}
                  nameCheck={`period_${value.id}`}
                  valueCheck={value.id}
                  nameSelect={`tipo_alimentacao_${value.id}`}
                  optionsSelect={typeFood}
                  nameNumber={`number_studant_${value.id}`}
                  verifyChecked={this.verifyChecked}
                  getPeriods={this.getPeriods}
                  multipleSelect={value.value === 'Integral'}
                  {...this.props}
                />
              })}


              <hr className="w-100" />

              <div className="card-title font-weight-bold" style={this.fontHeader}>Data da Suspensão</div>

              <div className="form-row">
                <div className="form-group col-sm-8 pt-3">
                  <label>Motivo</label><br />
                  <select className="form-control" name="reasos" disabled={!this.state.isEnable} onChange={this.handleReason.bind(this)}>
                    <option>--MOTIVO--</option>
                    {reasons.map((value, key) => {
                      return <option key={key} value={value.value}>{value.label}</option>
                    })}
                  </select>
                </div>

                <div className="input-group col-sm-2">
                  <label>Dia</label><br />
                  {/* https://reactdatepicker.com/ */}

                  <DatePicker
                    dateFormat={"dd/MM/YYYY"}
                    selected={day}
                    className="form-control ml-3"
                    locale={ptBR}
                    onChange={this.props.handleDate}
                    minDate={new Date()}
                    withPortal={true}
                    disabled={!this.state.isEnable}
                  />
                  {/* <div class="input-group-append">
                    <i className="fa fa-calendar" />
                  </div> */}
                </div>
              </div>

              <div className="form-group col-sm-4">
                <button class="btn btn-outline-primary" disabled={!this.state.isEnable} type="button">Adicionar Dia</button>
              </div>

              <hr className="w-100" />

              <div className="form-row">
                <div className="form-grop col-sm-11">
                  <label className="font-weight-bold">Observações</label>
                  <Editor
                    //how to config: https://jpuri.github.io/react-draft-wysiwyg/#/docs
                    editorState={editorState}
                    name={"description"}
                    wrapperClassName="border rounded"
                    editorClassName="ml-2"
                    className="form-control"
                    placeholder={"Digite seu texto"}
                    onEditorStateChange={this.onEditorStateChange}

                    toolbar={{
                      options: ["inline", "list"],
                      inline: {
                        inDropdown: false,
                        options: ["bold", "italic", "underline", "strikethrough"]
                      },
                      list: { inDropdown: false, options: ["unordered", "ordered"] }
                    }}
                  />

                </div>
              </div>
              <div className="form-row pt-3">
                <div className="form-group col-sm-11">
                  <button type="submit" disabled={!this.state.isEnable} className="btn btn-primary float-right m-2">Enviar Solicitação</button>
                  <button type="button" disabled={!this.state.isEnable} className="btn btn-outline-primary float-right m-2">Salvar Rascunho</button>
                  <button type="reset" className="btn btn-outline-primary float-right m-2">Cancelar</button>
                </div>

              </div>


            </div>
          </div>
        </form>
        <div className="mt-3"></div>
        <button type="button" disabled={!this.state.isEnable} className="btn btn-lg btn-outline-primary btn-block"><i className="fa fa-plus"></i> Adicionar nova informação de suspensão</button>
      </div>
    );
  }
}

export default FoodSuspension
