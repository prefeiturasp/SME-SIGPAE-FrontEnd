export const mockDietas = {
  status: 200,
  data: [
    {
      id: 2441,
      uuid: "4d041563-e118-470a-b16d-51e6cd36699a",
      status_solicitacao: "CODAE_AUTORIZADO",
      aluno: {
        uuid: "29d5808a-fd04-4c59-8885-cb30f6a0a234",
        nome: "MARCELO DOMINGUES BRENTANO",
        codigo_eol: "6267142",
      },
      escola: {
        uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
        nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
      },
      escola_destino: {
        uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
        nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
      },
      alergias_intolerancias: [
        {
          id: 3,
          descricao: "ACIDURIA GLUTARICA",
        },
        {
          id: 4,
          descricao: "AGENESIA RENAL",
        },
      ],
      classificacao: {
        id: 7,
        descricao: "Para dietas de fenilcetonúria, Homocistinúria e Tirosemia",
        nome: "Tipo A RESTRIÇÃO DE AMINOÁCIDOS",
      },
      data_termino: "28/02/2024",
      data_inicio: "29/01/2024",
    },
  ],
};
