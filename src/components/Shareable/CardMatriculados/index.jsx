import { Component } from "react";
import {
  escolaEhCEMEI,
  pontuarValor,
  usuarioEhEscola,
} from "src/helpers/utilities";
import "./style.scss";

export default class CardMatriculados extends Component {
  render() {
    const { numeroAlunos, meusDados } = this.props;

    const numeroAlunos_ =
      numeroAlunos ||
      (meusDados && meusDados?.vinculo_atual?.instituicao?.quantidade_alunos);

    return escolaEhCEMEI() ? (
      <div className="card mt-1">
        <div className="card-body card-enrolled">
          <div className="row">
            <div className="title-rectangle-wrapper">
              <span className="title">Total de Matriculados</span>
              <div className="rectangle">
                {meusDados &&
                  pontuarValor(
                    meusDados.vinculo_atual.instituicao
                      .quantidade_alunos_cei_da_cemei +
                      meusDados.vinculo_atual.instituicao
                        .quantidade_alunos_emei_da_cemei,
                  )}
              </div>
            </div>

            <div className="title-rectangle-wrapper">
              <span className="title">Matriculados CEI</span>
              <div className="rectangle">
                {meusDados &&
                  pontuarValor(
                    meusDados.vinculo_atual.instituicao
                      .quantidade_alunos_cei_da_cemei,
                  )}
              </div>
            </div>

            <div className="title-rectangle-wrapper">
              <span className="title">Matriculados EMEI</span>
              <div className="rectangle">
                {meusDados &&
                  pontuarValor(
                    meusDados.vinculo_atual.instituicao
                      .quantidade_alunos_emei_da_cemei,
                  )}
              </div>
            </div>
            <div className="col-6 beside-text mt-auto ms-2">
              Informação automática disponibilizada pelo Cadastro da Unidade
              Escolar <br />
            </div>
          </div>
        </div>
      </div>
    ) : usuarioEhEscola() ? (
      numeroAlunos_ > 0 ? (
        <div className="card">
          <div className="card-body card-enrolled">
            <div className="row title">
              <div className="col-12 col-lg-5 ps-0 pb-2">
                Nº de Matriculados
              </div>
            </div>
            <div className="row">
              <div className="col-5 col-md-3 col-lg-1 px-0">
                <div className="rectangle">
                  {numeroAlunos_ && pontuarValor(numeroAlunos_)}
                </div>
              </div>
              <div className="col-12 col-md-6 beside-text mt-auto">
                Informação automática disponibilizada pelo Cadastro da Unidade
                Escolar <br />
              </div>
            </div>
            <div className="row">{this.props.children}</div>
          </div>
        </div>
      ) : (
        <></>
      )
    ) : (
      (meusDados?.vinculo_atual?.instituicao?.quantidade_alunos_terceirizada >
        0 ||
        meusDados?.vinculo_atual?.instituicao?.quantidade_alunos_parceira >
          0) && (
        <div className="card">
          <div className="card-body card-enrolled">
            <div className="row">
              {meusDados.vinculo_atual.instituicao
                .quantidade_alunos_terceirizada > 0 && (
                <div className="title-rectangle-wrapper">
                  <span className="title mb-2">
                    Matriculados <b>Terceirizada Total</b>
                  </span>
                  <div className="rectangle">
                    {pontuarValor(
                      meusDados.vinculo_atual.instituicao
                        .quantidade_alunos_terceirizada,
                    )}
                  </div>
                </div>
              )}
              {meusDados.vinculo_atual.instituicao.quantidade_alunos_parceira >
                0 && (
                <div className="title-rectangle-wrapper">
                  <span className="title mb-2">
                    Matriculados <b>Rede Parceira</b>
                  </span>
                  <div className="rectangle">
                    {pontuarValor(
                      meusDados.vinculo_atual.instituicao
                        .quantidade_alunos_parceira,
                    )}
                  </div>
                </div>
              )}
              <div className="col-12 col-md-4 beside-text mt-auto">
                Informação automática disponibilizada pelo EOL
              </div>
            </div>
            <div className="row">{this.props.children}</div>
          </div>
        </div>
      )
    );
  }
}
