import React, { Component, Fragment } from "react";
import moment from "moment";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import { getTerceirizada } from "../../../../services/terceirizada.service";
import { Link, NavLink } from "react-router-dom";
import { retornArrayTerceirizadas } from "./helper";
import { PERFIL } from "../../../../constants/shared";
import "../style.scss";
import { Tooltip } from "antd";

class EmpresasCadastradas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pesquisar: "",
      empresasFiltradas: [],
      empresasFiltradasEstadoInicial: [],
      ehDistribuidor: false,
      loading: false,
    };
  }

  buscaTerceirizadas(filtro = null) {
    this.setState({ loading: true });
    getTerceirizada(filtro).then((response) => {
      const resp = retornArrayTerceirizadas(response.data.results);
      const tipoPerfil = localStorage.getItem("perfil");
      let empresasF = [];
      if (tipoPerfil === PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA) {
        resp.forEach((empresa) => {
          if (!empresa.eh_distribuidor) {
            empresasF.push(empresa);
          }
        });
      } else if (
        tipoPerfil === PERFIL.COORDENADOR_LOGISTICA ||
        tipoPerfil === PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA ||
        tipoPerfil === PERFIL.ADMINISTRADOR_CONTRATOS ||
        tipoPerfil === PERFIL.DILOG_CRONOGRAMA ||
        tipoPerfil === PERFIL.COORDENADOR_GESTAO_PRODUTO ||
        tipoPerfil === PERFIL.ADMINISTRADOR_GESTAO_PRODUTO
      ) {
        this.setState({ ...this.state, ehDistribuidor: true });
        resp.forEach((empresa) => {
          if (empresa.eh_distribuidor) {
            empresasF.push(empresa);
          }
        });
      }

      if (this.state.empresasFiltradasEstadoInicial.length === 0) {
        this.setState({ empresasFiltradasEstadoInicial: empresasF });
      }
      const empresasFiltradas = empresasF;
      this.setState({ empresasFiltradas, loading: false });
    });
  }

  componentDidMount() {
    this.buscaTerceirizadas();
  }

  lidarComBurger(empresa) {
    empresa.ativo = !empresa.ativo;
    this.forceUpdate();
  }

  onPesquisaChanged(values) {
    if (values.length >= 3 && !this.state.loading) {
      setTimeout(() => {
        this.buscaTerceirizadas(`busca=${values}`);
      }, 500);
    } else if (values.length < 3 && !this.state.loading) {
      this.setState({
        empresasFiltradas: this.state.empresasFiltradasEstadoInicial,
      });
    }
    this.setState({ pesquisar: values });
  }
  render() {
    const { empresasFiltradas, pesquisar, loading } = this.state;

    return (
      <div className="card pt-3 mt-3">
        <div className="card-body card-table-cadastro">
          <table className="cadastro-empresa">
            <tr>
              {!this.state.ehDistribuidor && <th className="col">ID</th>}
              <th className="col">Razão Social</th>
              <th className="col">Nome Fantasia</th>
              <th className="col text-center">CNPJ</th>
              <th className="col text-center">Tipo de Serviço</th>
              <th className="col text-center">Situação</th>
              <th className="">
                <div className="">
                  <input
                    className="input-search"
                    placeholder="Pesquisar"
                    value={pesquisar}
                    onChange={(e) => this.onPesquisaChanged(e.target.value)}
                    autoFocus={true}
                  />
                  <i className="fas fa-search" />
                </div>
              </th>
            </tr>
            {loading ? (
              <div>Carregando...</div>
            ) : (
              empresasFiltradas.map((empresa, key) => {
                return [
                  <tr
                    key={key}
                    className={empresa.ativo ? "detalhe-empresa" : ""}
                  >
                    {empresa.tipo_servico &&
                      empresa.tipo_servico.toLowerCase() === "terceirizada" && (
                        <td>{empresa.codigo_empresa}</td>
                      )}
                    <td className="nome-empresa">{empresa.nome}</td>
                    <td>{empresa.nome_fantasia}</td>
                    <td className="text-center">{empresa.cnpj}</td>
                    <td className="text-center">{empresa.tipo_servico}</td>
                    <td className="text-center">{empresa.status}</td>

                    <td>
                      <ToggleExpandir
                        onClick={() => this.lidarComBurger(empresa)}
                        ativo={empresa.ativo}
                        dataTestId={`botao-expandir-${key}`}
                      />
                      <div className="ms-4">
                        <Tooltip title="Editar">
                          <span>
                            <NavLink
                              className="float-start botao-editar"
                              to={`/configuracoes/cadastros/editar-empresa?uuid=${empresa.uuid}`}
                            >
                              <i className="fas fa-edit" />
                            </NavLink>
                          </span>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>,

                  empresa.ativo && (
                    <tr>
                      {!empresa.eh_distribuidor && (
                        <td className="detalhe-empresa" />
                      )}
                      <td className="container-detalhe" colSpan="6">
                        <div className="secao-empresa">
                          <div className="tipo-de-empresa">
                            <div className="mt-4">
                              <span className="descricao">
                                Tipo de Empresa:
                              </span>
                              <span className="valor-desc">
                                {empresa.tipo_empresa}
                              </span>
                            </div>
                            <div className="mt-4">
                              <span className="descricao">
                                Tipo de Alimento:
                              </span>
                              <span className="valor-desc">
                                {empresa.tipo_alimento}
                              </span>
                            </div>
                            <div className="mt-4">
                              <span className="descricao">Criado em:</span>
                              <span className="valor-desc">
                                {moment(empresa.criado_em, "DD/MM/YYYY").format(
                                  "DD/MM/YYYY",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="container-detalhe">
                          <header className="titulo-secao">
                            <span>Endereço da empresa</span>
                          </header>
                          <div className="secao-empresa">
                            <div className="endereco-empresa">
                              <div>
                                <span className="descricao">Logradouro:</span>
                                <span className="valor-desc">
                                  {empresa.endereco}
                                </span>
                              </div>
                              <div>
                                <span className="descricao">Complemento:</span>
                                <span className="valor-desc">
                                  {empresa.complemento}
                                </span>
                              </div>
                              <div className="mt-4">
                                <span className="descricao">Bairro:</span>
                                <span className="valor-desc">
                                  {empresa.bairro}
                                </span>
                              </div>
                              <div className="mt-4">
                                <span className="descricao">Cidade:</span>
                                <span className="valor-desc">
                                  {empresa.cidade}
                                </span>
                              </div>
                              <div className="mt-4">
                                <span className="descricao">CEP:</span>
                                <span className="valor-desc">
                                  {empresa.cep}
                                </span>
                              </div>
                              <div className="mt-4">
                                <span className="descricao">Estado:</span>
                                <span className="valor-desc">
                                  {empresa.estado}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {empresa.eh_distribuidor || empresa.eh_fornecedor ? (
                          <Fragment>
                            <div className="secao-distribuidor">
                              <header className="titulo-secao">
                                <span>Representante do Contrato</span>
                              </header>
                              <div className="secao-empresa">
                                <section className="contato-empresa">
                                  <div>
                                    <span className="descricao">E-mail:</span>
                                    <span className="valor-desc">
                                      {empresa.responsavel_email}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="descricao">Nome:</span>
                                    <span className="valor-desc">
                                      {empresa.responsavel_nome}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="descricao">Cargo:</span>
                                    <span className="valor-desc">
                                      {empresa.responsavel_cargo}
                                    </span>
                                  </div>
                                </section>
                                <section className="contato-empresa">
                                  <div>
                                    <span className="descricao">CPF:</span>
                                    <span className="valor-desc">
                                      {empresa.responsavel_cpf}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="descricao">Telefone:</span>
                                    <span className="valor-desc">
                                      {empresa.responsavel_telefone}
                                    </span>
                                  </div>
                                </section>
                              </div>
                            </div>

                            <div className="secao-distribuidor">
                              <header className="titulo-secao">
                                <span>Contatos da Empresa</span>
                              </header>
                              <div className="secao-empresa">
                                {empresa.contatos
                                  .filter((contato) => contato.nome)
                                  .map((contato) => (
                                    <section key="" className="contato-empresa">
                                      <div>
                                        <span className="descricao">Nome:</span>
                                        <span className="valor-desc">
                                          {contato.nome}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="descricao">
                                          Telefone/FAX:
                                        </span>
                                        <span className="valor-desc">
                                          {contato.telefone}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="descricao">
                                          E-mail:
                                        </span>
                                        <span className="valor-desc">
                                          {contato.email}
                                        </span>
                                      </div>
                                    </section>
                                  ))}
                              </div>
                            </div>

                            {empresa.contratos && (
                              <div className="secao-distribuidor">
                                <header className="titulo-secao">
                                  <span>Contratos</span>
                                </header>
                                <div className="secao-empresa">
                                  {empresa.contratos.map((contrato) => (
                                    <section
                                      key=""
                                      className="contrato-empresa"
                                    >
                                      <div>
                                        <span className="descricao">
                                          Nº do Contrato
                                        </span>
                                        <span className="valor-desc">
                                          {contrato.numero}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="descricao">
                                          Nº do Processo Administrativo:
                                        </span>
                                        <span className="valor-desc">
                                          {contrato.processo}
                                        </span>
                                      </div>
                                      {contrato.modalidade && (
                                        <Fragment>
                                          <div className="mt-2">
                                            <span className="descricao">
                                              Modalidade:
                                            </span>
                                            <span className="valor-desc">
                                              {contrato.modalidade.nome}
                                            </span>
                                          </div>
                                          {contrato.modalidade ===
                                          "PREGAO_ELETRONICO" ? (
                                            <Fragment>
                                              <div className="mt-2">
                                                <span className="descricao">
                                                  Nº do Pregão Eletrônico:
                                                </span>
                                                <span className="valor-desc">
                                                  {contrato.numero_pregao}
                                                </span>
                                              </div>
                                              <div className="mt-2">
                                                <span className="descricao">
                                                  Nº da ATA:
                                                </span>
                                                <span className="valor-desc">
                                                  {contrato.ata}
                                                </span>
                                              </div>
                                            </Fragment>
                                          ) : (
                                            <div className="mt-2">
                                              <span className="descricao">
                                                Nº da Chamada Pública:
                                              </span>
                                              <span className="valor-desc">
                                                {
                                                  contrato.numero_chamada_publica
                                                }
                                              </span>
                                            </div>
                                          )}
                                        </Fragment>
                                      )}
                                      <div className="mt-2 mb-3">
                                        <span className="descricao">
                                          Vigência do Contrato:
                                        </span>
                                        <span className="valor-desc">
                                          {contrato.vigencias.map(
                                            (vigencia) =>
                                              `${vigencia.data_inicial} até ${vigencia.data_final}`,
                                          )}
                                        </span>
                                      </div>
                                      <div className="mt-2 mb-3">
                                        <span className="descricao">
                                          Programa:
                                        </span>
                                        <span className="valor-desc">
                                          {contrato.programa_display}
                                        </span>
                                      </div>
                                    </section>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Fragment>
                        ) : (
                          <Fragment>
                            <div className="secao-representante">
                              <div className="nome-representante">
                                <div>
                                  <span className="descricao">
                                    Representante Legal:
                                  </span>
                                  <br />
                                  <span className="valor-desc">
                                    {empresa.representante}
                                  </span>
                                </div>
                                <div>
                                  <span className="descricao">Telefone:</span>
                                  <span className="valor-desc">
                                    {empresa.telefonefax}
                                  </span>
                                </div>
                              </div>
                              <div className="contato-representante">
                                <div>
                                  <span className="descricao">E-mail:</span>
                                  <br />
                                  <span className="valor-desc">
                                    {empresa.email}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <hr className="linha-detalhe" />

                            {empresa.nutricionistas.map((nutri, key) => {
                              return [
                                <Fragment key={key}>
                                  <div className="secao-representante pt-3">
                                    <div className="nome-representante">
                                      <div>
                                        <span className="descricao">
                                          Nutricionista Responsável Técnico:
                                        </span>
                                        <br />
                                        <span className="valor-desc">
                                          {nutri.nome}
                                          {nutri.super_admin_terceirizadas && (
                                            <span className="ms-1 badge badge-secondary">
                                              Admin
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="descricao">CRN</span>
                                        <span className="valor-desc">
                                          {nutri.crn}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="contato-nutri">
                                      <div>
                                        <span className="descricao">
                                          Telefone/Celular:
                                        </span>
                                        <br />
                                        <span className="valor-desc">
                                          {nutri.telefone}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="descricao">
                                          E-mail:
                                        </span>
                                        <br />
                                        <span className="valor-desc">
                                          {nutri.email}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Fragment>,
                              ];
                            })}

                            {empresa.nutricionistas.length > 0 && (
                              <hr className="linha-detalhe" />
                            )}

                            {empresa.editais.map((edital, key) => {
                              return [
                                <Fragment key={key}>
                                  <div className="secao-representante pt-3">
                                    <div className="nome-representante">
                                      <div>
                                        <span className="descricao">
                                          Edital de Pregão n°:
                                        </span>
                                        <span className="valor-desc">
                                          {edital.edital}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="descricao">
                                          Contrato n°:
                                        </span>
                                        <span className="valor-desc">
                                          {edital.contrato}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Fragment>,
                              ];
                            })}
                            {empresa.editais.length > 0 && (
                              <hr className="linha-detalhe" />
                            )}
                            <div className="lista-lotes">
                              {empresa.lotes.length > 0 && (
                                <div className="pt-2">
                                  <span className="descricao">
                                    Lotes de atendimento:
                                  </span>
                                </div>
                              )}
                              {empresa.lotes.length > 0 && (
                                <ul>
                                  {empresa.lotes.map((lote, key) => (
                                    <li key={key}>
                                      <Link
                                        to={`/configuracoes/cadastros/lote?uuid=${lote.uuid}`}
                                      >
                                        {lote.nome}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </Fragment>
                        )}
                      </td>
                    </tr>
                  ),
                ];
              })
            )}
          </table>
        </div>
      </div>
    );
  }
}

export default EmpresasCadastradas;
