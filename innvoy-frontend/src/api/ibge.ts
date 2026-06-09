export interface Municipality {
  nome: string;
  uf: string;
  estado: string;
}

type RawMunicipality = {
  nome: string;
  microrregiao: { mesorregiao: { UF: { sigla: string; nome: string } } };
};

let cache: Municipality[] | null = null;

function toMunicipality(m: RawMunicipality): Municipality {
  return {
    nome: m.nome,
    uf: m.microrregiao.mesorregiao.UF.sigla,
    estado: m.microrregiao.mesorregiao.UF.nome,
  };
}

export async function fetchMunicipalities(): Promise<Municipality[]> {
  if (cache) return cache;
  const res = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome',
  );
  const data = (await res.json()) as RawMunicipality[];
  cache = data.map(toMunicipality);
  return cache;
}

export function findByUf(uf: string, list: Municipality[]): Municipality | undefined {
  return list.find((m) => m.uf === uf);
}
