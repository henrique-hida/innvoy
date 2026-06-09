export interface CepResult {
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
}

type ViaCepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

const str = (v: string | undefined) => v ?? '';

function toCepResult(data: ViaCepResponse): CepResult {
  return {
    street: str(data.logradouro),
    neighborhood: str(data.bairro),
    city: str(data.localidade),
    uf: str(data.uf),
  };
}

export async function fetchCep(raw: string): Promise<CepResult | null> {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) return null;
  const data = (await res.json()) as ViaCepResponse;
  if (data.erro) return null;
  return toCepResult(data);
}
