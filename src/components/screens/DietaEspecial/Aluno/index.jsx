import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { getDietasEspeciaisVigentesDeUmAluno } from "../../../../services/dietaEspecial.service";
import { dadosDoAluno } from "../../../../services/perfil.service";
import "./style.scss";
import { formatarSolicitacoesVigentes } from "../Escola/helper";
import SolicitacaoVigente from "../Escola/componentes/SolicitacaoVigente";

class solicitacaoDietaEspecial extends Component {
  constructor(props) {
    super(props);
    window.changeForm = props.change;
    window.momentjs = moment;
    this.state = { nomeAluno: "", eolAluno: "", escolaAtual: "", dreAtual: "" };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigo_eol = urlParams.get("codigo_eol");
    dadosDoAluno(codigo_eol).then((dadosAluno) => {
      const dados = dadosAluno.data;
      this.setState({
        nomeAluno: dados.nome,
        eolAluno: dados.codigo_eol,
        escolaAtual: dados.nome_escola,
        dreAtual: dados.nome_dre,
      });
    });
    getDietasEspeciaisVigentesDeUmAluno(codigo_eol).then((response) => {
      this.setState({
        solicitacoesVigentes: formatarSolicitacoesVigentes(
          response.data.results
        ),
      });
    });
  }

  // async onSubmit(payload) {
  // }

  resetForm() {
    this.props.reset("solicitacaoDietaEspecial");
    this.setState({ files: [] });
  }

  render() {
    const { nomeAluno, eolAluno, escolaAtual, dreAtual, solicitacoesVigentes } =
      this.state;
    const { handleSubmit } = this.props;
    return (
      <div className="card">
        <div className="card-body">
          <form className="special-diet" onSubmit={handleSubmit}>
            <div>
              <table className="tabela-informacoes-aluno">
                <tr>
                  <th>Diretoria Regional de Educação</th>
                  <th>Unidade escolar</th>
                </tr>
                <tr>
                  <td>{dreAtual}</td>
                  <td>{escolaAtual}</td>
                </tr>
                <tr>
                  <th>Código EOL</th>
                  <th>Nome Completo</th>
                </tr>
                <tr>
                  <td>{eolAluno}</td>
                  <td>{nomeAluno}</td>
                </tr>
              </table>
            </div>
            {solicitacoesVigentes && (
              <SolicitacaoVigente
                codigoEol={eolAluno}
                solicitacoesVigentes={solicitacoesVigentes}
              />
            )}
          </form>
        </div>
      </div>
    );
  }
}

const componentNameForm = reduxForm({
  form: "solicitacaoDietaEspecial",
  validate: ({ nome, data_nascimento }) => {
    const errors = {};
    if (nome === undefined && data_nascimento === undefined) {
      errors.codigo_eol =
        "É necessário preencher este campo com um código EOL válido";
    }
    return errors;
  },
})(solicitacaoDietaEspecial);

const selector = formValueSelector("solicitacaoDietaEspecial");
const mapStateToProps = (state) => {
  return {
    files: selector(state, "files"),
  };
};

export default connect(mapStateToProps)(componentNameForm);
