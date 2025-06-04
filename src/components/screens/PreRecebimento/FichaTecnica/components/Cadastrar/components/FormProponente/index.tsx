import React from "react";
import InputText from "src/components/Shareable/Input/InputText";
import { TerceirizadaComEnderecoInterface } from "interfaces/terceirizada.interface";

interface Props {
  proponente: TerceirizadaComEnderecoInterface;
}

const FormProponente: React.FC<Props> = ({ proponente }) => {
  return (
    <>
      <div className="row">
        <div className="col-6">
          <InputText
            label="CNPJ"
            valorInicial={proponente.cnpj}
            disabled={true}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <InputText
            label="Nome da Empresa/Organização"
            valorInicial={`${proponente.nome_fantasia} / ${proponente.razao_social}`}
            disabled={true}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <InputText
            label="Endereço"
            valorInicial={proponente.endereco}
            disabled={true}
          />
        </div>
        <div className="col-4">
          <InputText
            label="Nº"
            valorInicial={proponente.numero}
            disabled={true}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <InputText
            label="Complemento"
            valorInicial={proponente.complemento}
            disabled={true}
          />
        </div>
        <div className="col-4">
          <InputText
            label="Bairro"
            valorInicial={proponente.bairro}
            disabled={true}
          />
        </div>
        <div className="col-4">
          <InputText
            label="CEP"
            valorInicial={proponente.cep}
            disabled={true}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <InputText
            label="Cidade"
            valorInicial={proponente.cidade}
            disabled={true}
          />
        </div>
        <div className="col-4">
          <InputText
            label="Estado"
            valorInicial={proponente.estado}
            disabled={true}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <InputText
            label="E-mail"
            valorInicial={proponente.responsavel_email}
            required
            disabled={true}
          />
        </div>
        <div className="col-4">
          <InputText
            label="Telefone"
            valorInicial={proponente.responsavel_telefone}
            required
            disabled={true}
          />
        </div>
      </div>
    </>
  );
};

export default FormProponente;
