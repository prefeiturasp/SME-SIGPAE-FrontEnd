export const mockDadosDownloads = {
  count: 308,
  next: "http://hom-sigpae.sme.prefeitura.sp.gov.br/downloads/?page=2",
  previous: null,
  results: [
    {
      uuid: "a09730a8-2e28-46f3-898e-4a9e51ef18d0",
      identificador: "relatorio-adesao.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio-adesao_PXoOnRq.pdf",
      status: "Concluído",
      data_criacao: getPreviousDayFormatted(),
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "9be0960d-523b-433d-a2f8-53cec3753879",
      identificador: "relatorio-adesao.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio-adesao_kcShzjy.pdf",
      status: "Concluído",
      data_criacao: "08/07/2025 ás 16:24",
      msg_erro: "",
      visto: true,
    },
    {
      uuid: "6fc8f7ab-6f0a-4497-9f0a-dd874882a672",
      identificador: "relatorio-adesao.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio-adesao_xJqcQz4.pdf",
      status: "Concluído",
      data_criacao: "07/07/2025 ás 16:33",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "52ae7acb-256d-424e-94e3-3a8ee965951d",
      identificador: "relatorio-adesao.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio-adesao_x0jWWGx.pdf",
      status: "Concluído",
      data_criacao: "07/07/2025 ás 16:24",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "704ea361-eebb-4244-aa2f-6ab63d746843",
      identificador: "relatorio-adesao.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio-adesao_RFHb7jR.pdf",
      status: "Concluído",
      data_criacao: "07/07/2025 ás 16:23",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "1b82c40f-845a-487c-a885-da48ac899aa4",
      identificador:
        "Relatório Medição Inicial - CCI/CIPS CAMARA MUNICIPAL DE SAO PAULO - 03/2025.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/2025_o1gCDsS.pdf",
      status: "Concluído",
      data_criacao: "01/07/2025 ás 16:52",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "df1fe632-ff9c-406d-bbf2-8365f65f805f",
      identificador:
        "Relatório Medição Inicial - EMEBS HELEN KELLER - 03/2025.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/2025_jXMcc6f.pdf",
      status: "Concluído",
      data_criacao: "01/07/2025 ás 16:51",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "c8729a68-7db8-4d53-853c-59bb846d90dd",
      identificador: "relatorio_dietas_especiais.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio_dietas_especiais_vlh6W0W.pdf",
      status: "Concluído",
      data_criacao: "12/06/2025 ás 17:11",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "75726d6a-274b-4e69-9e7d-eb0791c7fc6a",
      identificador: "relatorio_historico_dietas_especiais_29_05_2025.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio_historico_dietas_especiais_29_05_2025_Rf5cFTf.pdf",
      status: "Concluído",
      data_criacao: "30/05/2025 ás 15:21",
      msg_erro: "",
      visto: false,
    },
    {
      uuid: "2adeaeec-e449-4e0b-bff4-55b0e54e6d30",
      identificador: "relatorio_historico_dietas_especiais_29_05_2025.pdf",
      arquivo:
        "http://hom-sigpae.sme.prefeitura.sp.gov.br/media/cental_downloads/relatorio_historico_dietas_especiais_29_05_2025_KV5wvo2.pdf",
      status: "Concluído",
      data_criacao: "30/05/2025 ás 15:19",
      msg_erro: "",
      visto: false,
    },
  ],
};

function getPreviousDayFormatted() {
  const now = new Date();
  const previousDay = new Date(now);
  previousDay.setDate(now.getDate() - 1);

  const day = String(previousDay.getDate()).padStart(2, "0");
  const month = String(previousDay.getMonth() + 1).padStart(2, "0");
  const year = previousDay.getFullYear();
  const hours = String(previousDay.getHours()).padStart(2, "0");
  const minutes = String(previousDay.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ás ${hours}:${minutes}`;
}
