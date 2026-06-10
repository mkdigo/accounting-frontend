type TZipcodeResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
};

export class ZipcodeApi {
  public async get(zipcode: string): Promise<TZipcodeResponse | null> {
    const response = await fetch(
      `${import.meta.env.VITE_ZIPCODE_API_URL}/${zipcode}`,
    );
    if (!response.ok) return null;
    return response.json();
  }
}
