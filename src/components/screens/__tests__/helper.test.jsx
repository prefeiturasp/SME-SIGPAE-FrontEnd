import { slugify } from "../helper";

describe("Teste slugfy", () => {
  it("test slugfy strings", () => {
    expect(slugify("Macarrão".toLocaleLowerCase())).toEqual(
      slugify("macaRRao".toLocaleLowerCase())
    );
  });
});
