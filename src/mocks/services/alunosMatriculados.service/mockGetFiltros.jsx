export const mockGetFiltros = {
  lotes: [
    {
      uuid: "3d2164c6-985c-489d-9091-e433f7aad338",
      nome: "Teste",
      diretoria_regional: {
        uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
        nome: "DIRETORIA REGIONAL DE EDUCACAO IPIRANGA",
      },
    },
  ],
  diretorias_regionais: [
    {
      uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
      nome: "DIRETORIA REGIONAL DE EDUCACAO IPIRANGA",
    },
  ],
  tipos_unidade_escolar: [
    {
      uuid: "1cc69b3e-6210-4825-bf67-274d3c050bc0",
      iniciais: "EMEF",
    },
  ],
  escolas: [
    {
      uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
      nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
      diretoria_regional: {
        uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
        nome: "DIRETORIA REGIONAL DE EDUCACAO IPIRANGA",
      },
      tipo_unidade: {
        uuid: "1cc69b3e-6210-4825-bf67-274d3c050bc0",
        iniciais: "EMEF",
      },
      lote: {
        uuid: "3d2164c6-985c-489d-9091-e433f7aad338",
        nome: "Teste",
      },
    },
  ],
  tipos_turmas: ["REGULAR", "PROGRAMAS"],
};
