import { formataComoEventos } from "../helpers";

describe("formataComoEventos", () => {
  it("formata objetos como eventos da forma esperada", () => {
    const diasSobremesaDoce = [
      {
        data: "19/12/2024",
        tipo_unidade: { iniciais: "TU1", uuid: "uuid1" },
        edital_numero: "E1",
        edital: "edit_uuid1",
        criado_por: "user1",
        criado_em: "2024-12-19T10:00:00",
        uuid: "event_uuid1",
      },
      {
        data: "19/12/2024",
        tipo_unidade: { iniciais: "TU1", uuid: "uuid1" },
        edital_numero: "E2",
        edital: "edit_uuid2",
        criado_por: "user2",
        criado_em: "2024-12-19T11:00:00",
        uuid: "event_uuid2",
      },
    ];

    const expected = [
      {
        title: "TU1",
        tipo_unidade: { iniciais: "TU1", uuid: "uuid1" },
        data: "19/12/2024",
        start: new Date(2024, 11, 19, 0),
        end: new Date(2024, 11, 19, 1),
        allDay: true,
        criado_por: "user1",
        criado_em: "2024-12-19T10:00:00",
        uuid: "event_uuid1",
        editais_numeros: "\nE1\nE2",
        editais_numeros_virgula: ", E1, E2",
        editais_uuids: ["edit_uuid1", "edit_uuid2"],
      },
    ];

    const result = formataComoEventos(diasSobremesaDoce);
    expect(result).toEqual(expected);
  });
});
