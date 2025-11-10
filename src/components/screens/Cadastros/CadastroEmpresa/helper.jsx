import { createTextMask } from "redux-form-input-masks";
import { getEnderecoPorCEP } from "src/services/cep.service";
import HTTP_STATUS from "http-status-codes";
import { removeCaracteresEspeciais } from "src/helpers/utilities";

export function transformaObjetos(objetos) {
  let lista = [];
  let obj = {};
  objetos.results.forEach((objeto) => {
    obj.uuid = objeto["uuid"];
    obj.label = objeto["nome"];
    obj.value = objeto["uuid"];
    lista.push(obj);
    obj = {};
  });
  return lista;
}

export const fieldCnpj = createTextMask({
  pattern: "99.999.999/9999-99",
  allowEmpty: false,
  guide: false,
});

export const fieldCpf = createTextMask({
  pattern: "999.999.999-99",
  allowEmpty: false,
  guide: false,
});

export const fieldCep = createTextMask({
  pattern: "99999-999",
  allowEmpty: false,
  guide: false,
});

export const fieldTel = createTextMask({
  pattern: "99 9999-9999",
  guide: false,
});

const retornaNutricionistas = (nutricionistas) => {
  const listaNutricionistas = nutricionistas.map((nutri) => {
    return {
      nome: nutri.nome,
      crn: nutri.crn_numero,
      super_admin_terceirizadas: nutri.super_admin_terceirizadas,
      telefone: nutri.contatos.length === 0 ? null : nutri.contatos[0].telefone,
      email: nutri.contatos.length === 0 ? null : nutri.contatos[0].email,
    };
  });
  return listaNutricionistas;
};

const retornaLotes = (lotes) => {
  const listaLotes = lotes.map((lote) => {
    return {
      nome: lote.nome,
      uuid: lote.uuid,
    };
  });
  return listaLotes;
};

const retornaEditalDeContrato = (contrato) => {
  if (contrato.edital) {
    return {
      edital: contrato.edital.numero,
      contrato: contrato.numero,
    };
  }
  return null;
};

const retornaEditais = (contratos) => {
  const listaEditais = contratos.map((contrato) => {
    return retornaEditalDeContrato(contrato);
  });
  return listaEditais;
};

export const retornArrayTerceirizadas = (response) => {
  const listaTerceirizadas = response.map((resp) => {
    return {
      uuid: resp.uuid,
      codigo_empresa: resp.id_externo,
      nome: resp.razao_social,
      nome_fantasia: resp.nome_fantasia,
      cnpj: resp.cnpj,
      status: resp.ativo ? "Ativa" : "Inativa",
      ativo: false,
      endereco: resp.endereco,
      cep: resp.cep,
      contatos: resp.contatos.map((contato) => {
        return {
          nome: contato.nome,
          telefone: contato.telefone,
          email: contato.email,
        };
      }),
      contratos: resp.contratos,
      eh_distribuidor: resp.tipo_servico !== "TERCEIRIZADA",
      telefone: resp.contatos.length === 0 ? null : resp.contatos[0].telefone,
      email: resp.contatos.length === 0 ? null : resp.contatos[0].email,
      representante: resp.representante_legal,
      telefonefax: resp.representante_telefone,
      email_representante: resp.representante_email,
      nutricionistas: retornaNutricionistas(resp.nutricionistas),
      editais: retornaEditais(resp.contratos),
      lotes: retornaLotes(resp.lotes),
      bairro: resp.bairro,
      cidade: resp.cidade,
      estado: resp.estado,
      numero: resp.numero,
      tipo: resp.eh_distribuidor ? "Distribuidor" : "Terceirizada",
      complemento: resp.complemento,
      responsavel_nome: resp.responsavel_nome,
      responsavel_email: resp.responsavel_email,
      responsavel_cpf: resp.responsavel_cpf,
      responsavel_telefone: resp.responsavel_telefone,
      responsavel_cargo: resp.responsavel_cargo,
      tipo_alimento: resp.tipo_alimento_display,
      tipo_empresa: resp.tipo_empresa_display,
      tipo_servico: resp.tipo_servico_display,
      numero_contrato: resp.numero_contrato,
      criado_em: resp.criado_em,
    };
  });
  return listaTerceirizadas;
};

export const formataJsonParaEnvio = (valoresForm, valoresState) => {
  if (valoresState.ehDistribuidor) {
    const contatosEmpresa = valoresState.contatosPessoaEmpresa.map((item) => {
      return {
        nome: item.nome,
        telefone: removeCaracteresEspeciais(item.telefone),
        email: item.email,
      };
    });

    const contratos = valoresState.contratos.map((contrato, index) => {
      const payloadContrato = {
        uuid: contrato.uuid,
        processo: valoresForm[`numero_processo_${index}`],
        modalidade: valoresForm[`modalidade_${index}`],
        ata: valoresForm[`numero_ata_${index}`],
        numero_chamada_publica: valoresForm[`numero_chamada_publica_${index}`],
        numero_pregao: valoresForm[`numero_pregao_${index}`],
        vigencias: [
          {
            data_inicial: valoresForm[`vigencia_de_${index}`],
            data_final: valoresForm[`vigencia_ate_${index}`],
          },
        ],
        encerrado: contrato.encerrado ? true : false,
        programa: valoresForm[`programa_${index}`],
      };

      if (!contrato.uuid) {
        payloadContrato.numero = valoresForm[`numero_contrato_${index}`];
      }

      return payloadContrato;
    });

    const contatos = [...contatosEmpresa];

    return {
      nome_fantasia: valoresForm.nome_fantasia,
      tipo_alimento: valoresForm.tipo_alimento,
      tipo_empresa: valoresForm.tipo_empresa,
      tipo_servico: valoresForm.tipo_servico,
      numero_contrato: valoresForm.numero_contrato,
      razao_social: valoresForm.razao_social,
      cnpj: removeCaracteresEspeciais(valoresForm.cnpj),
      endereco: valoresForm.endereco,
      cep: valoresForm.cep.replace(/[^a-z0-9]/gi, ""),
      contatos: contatos,
      contratos: contratos,
      bairro: valoresForm.bairro,
      cidade: valoresForm.cidade,
      complemento: valoresForm.complemento,
      estado: valoresForm.estado,
      numero: valoresForm.numero,
      responsavel_cargo: valoresForm.responsavel_cargo,
      responsavel_cpf: removeCaracteresEspeciais(valoresForm.responsavel_cpf),
      responsavel_nome: valoresForm.responsavel_nome,
      responsavel_telefone: removeCaracteresEspeciais(
        valoresForm.responsavel_telefone,
      ),
      responsavel_email: valoresForm.responsavel_email,
      ativo: valoresForm.situacao,
    };
  } else {
    let contatosNutri = [];
    valoresState.contatosNutricionista.forEach((nutri) => {
      contatosNutri.push({
        nome: nutri.responsavel,
        crn_numero: nutri.crn,
        super_admin_terceirizadas:
          valoresState.contatosNutricionista.length === 1
            ? true
            : nutri.super_admin_terceirizadas,
        telefone: removeCaracteresEspeciais(nutri.telefone),
        email: nutri.email,
        eh_nutricionista: true,
      });
    });

    const contatosEmpresaFormatado = valoresState.contatosEmpresa.map(
      (item) => {
        return {
          telefone: removeCaracteresEspeciais(item.telefone),
          email: item.email,
        };
      },
    );

    const contatosEmpresa = [...contatosEmpresaFormatado, ...contatosNutri];

    return {
      nome_fantasia: valoresForm.nome_fantasia,
      razao_social: valoresForm.razao_social,
      cnpj: removeCaracteresEspeciais(valoresForm.cnpj),
      representante_legal: valoresForm.representante_legal,
      representante_telefone: valoresForm.telefone_representante
        ? valoresForm.telefone_representante.replace(/[^a-z0-9]/gi, "")
        : "",
      representante_email: valoresForm.representante_email,
      endereco: valoresForm.endereco,
      cep: valoresForm.cep.replace(/[^a-z0-9]/gi, ""),
      contatos: contatosEmpresa,
      bairro: valoresForm.bairro,
      cidade: valoresForm.cidade,
      complemento: valoresForm.complemento,
      estado: valoresForm.estado,
      numero: valoresForm.numero,
      responsavel_cargo: valoresForm.responsavel_cargo,
      responsavel_cpf: removeCaracteresEspeciais(valoresForm.responsavel_cpf),
      responsavel_nome: valoresForm.responsavel_nome,
      responsavel_telefone: valoresForm.responsavel_telefone
        ? valoresForm.responsavel_telefone.replace(/[^a-z0-9]/gi, "")
        : "",
      responsavel_email: valoresForm.responsavel_email,
      lotes: valoresState.lotesSelecionados,
    };
  }
};

export const buscaCep = async (value) => {
  const dadosEndereco = {
    desabilitado: true,
    bairro: null,
    cidade: null,
    endereco: null,
    estado: null,
  };
  const response = await getEnderecoPorCEP(value);
  if (value.length === 8) {
    if (response.status === HTTP_STATUS.OK && !response.data.erro) {
      const { data } = response;
      dadosEndereco.desabilitado = true;
      dadosEndereco.bairro = data.bairro;
      dadosEndereco.cidade = data.localidade;
      dadosEndereco.endereco = data.logradouro;
      dadosEndereco.estado = data.uf;
      dadosEndereco.request = true;
    } else {
      dadosEndereco.desabilitado = false;
    }
  }
  return dadosEndereco;
};
