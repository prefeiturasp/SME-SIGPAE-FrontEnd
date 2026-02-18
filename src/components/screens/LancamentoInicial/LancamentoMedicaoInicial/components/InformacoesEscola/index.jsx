import { Collapse } from "antd";

export default ({ escolaInstituicao, loteEscolaSimples, historicoEscola }) => {
  const { Panel } = Collapse;

  const formataEnderencoCompleto = (endereco) => {
    return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro} - CEP: ${endereco.cep}`;
  };

  return (
    <div className="col-8 info-ue">
      <div className="ps-0 label-adjustments">
        <Collapse expandIconPosition="end">
          <Panel header="Informações da Unidade Educacional">
            <div className="row">
              <div className="col-12 info-label">
                <label>NOME DA UE</label>
                <p className="value-label">
                  {historicoEscola && historicoEscola.nome}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-8 info-label">
                <label>DRE</label>
                <p className="value-label">
                  {escolaInstituicao &&
                    escolaInstituicao.diretoria_regional.nome}
                </p>
              </div>
              <div className="col-4 info-label">
                <label>Telefone</label>
                <p className="value-label">
                  {escolaInstituicao && escolaInstituicao.contato.telefone}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-8 info-label">
                <label>E-mail</label>
                <p className="value-label">
                  {escolaInstituicao && escolaInstituicao.contato.email}
                </p>
              </div>
              <div className="col-4 info-label">
                <label>Lote</label>
                <p className="value-label">{loteEscolaSimples}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 info-label">
                <label>Endereço</label>
                <p className="value-label">
                  {escolaInstituicao &&
                    formataEnderencoCompleto(escolaInstituicao.endereco)}
                </p>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};
