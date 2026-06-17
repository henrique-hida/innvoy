import { useState, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchCep } from '@/api/cep';
import { fetchMunicipalities, findByUf, type Municipality } from '@/api/ibge';
import { maskZip } from '@/lib/masks';
import { UF_TO_STATE } from '@/lib/states';
import { useLang } from '@/i18n/context';
import { FormField } from './FormField';
import { Stepper } from './Stepper';
import type { AddressFields } from './formState';

type FieldErrors = Record<string, string>;

interface Props {
  fields: AddressFields;
  errors: FieldErrors;
  onChange: (fields: AddressFields) => void;
  onBack: () => void;
  onSubmit: () => void;
  onDeactivate?: () => Promise<void>;
  submitLabel: string;
  submitting: boolean;
  deactivating: boolean;
  isActive: boolean;
}

function parseCityOption(val: string): { name: string; uf: string } | null {
  const m = /^(.+?)\s*\(([A-Z]{2})\)$/.exec(val);
  return m ? { name: m[1], uf: m[2] } : null;
}

function resolveStateName(uf: string, municipalities: Municipality[]): string {
  const m = findByUf(uf, municipalities);
  return m ? m.estado : (UF_TO_STATE[uf] ?? '');
}

function applyCity(
  fields: AddressFields,
  name: string,
  uf: string,
  municipalities: Municipality[],
): AddressFields {
  return {
    ...fields,
    citySearch: `${name} (${uf})`,
    cityName: name,
    stateAbbreviation: uf,
    stateName: resolveStateName(uf, municipalities),
  };
}

function renderDeactivateBtn(
  show: boolean,
  onClick: () => void,
  loading: boolean,
  isActive: boolean,
  label: string,
  loadingLabel: string,
) {
  if (!show) return null;
  return (
    <Button type="button" variant="destructive" onClick={onClick} disabled={loading || !isActive}>
      {loading ? loadingLabel : label}
    </Button>
  );
}

export default function Step2({
  fields,
  errors,
  onChange,
  onBack,
  onSubmit,
  onDeactivate,
  submitLabel,
  submitting,
  deactivating,
  isActive,
}: Props) {
  const { t } = useLang();
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    void fetchMunicipalities()
      .then(setMunicipalities)
      .catch(() => undefined)
      .finally(() => setCitiesLoading(false));
  }, []);

  const set = (key: keyof AddressFields) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...fields, [key]: e.target.value });

  const handleZipChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...fields, zipCode: maskZip(e.target.value) });

  const handleZipBlur = async () => {
    setCepLoading(true);
    const result = await fetchCep(fields.zipCode);
    setCepLoading(false);
    if (!result) return;
    onChange(
      applyCity(
        { ...fields, street: result.street, neighborhood: result.neighborhood },
        result.city,
        result.uf,
        municipalities,
      ),
    );
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = parseCityOption(val);
    if (parsed) {
      onChange(applyCity(fields, parsed.name, parsed.uf, municipalities));
    } else {
      onChange({ ...fields, citySearch: val, cityName: val });
    }
  };

  const handleDeactivateClick = () => {
    if (onDeactivate) void onDeactivate();
  };

  return (
    <>
      <Stepper current={2} />

      <fieldset className="mb-5 rounded-xl border p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.addressLegend}
        </legend>

        <div className="mb-4">
          <FormField
            id="zipCode"
            label={cepLoading ? t.zipCodeLooking : t.zipCodeField}
            error={errors.zipCode}
            className="max-w-[160px]"
          >
            <Input
              id="zipCode"
              value={fields.zipCode}
              onChange={handleZipChange}
              onBlur={() => void handleZipBlur()}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-4">
          <FormField id="street" label={t.streetField} error={errors.street}>
            <Input id="street" value={fields.street} onChange={set('street')} />
          </FormField>

          <FormField id="addressNumber" label={t.numberField} error={errors.addressNumber}>
            <Input
              id="addressNumber"
              value={fields.addressNumber}
              onChange={set('addressNumber')}
              inputMode="numeric"
            />
          </FormField>

          <FormField id="complement" label={t.complementField} error={errors.complement}>
            <Input id="complement" value={fields.complement} onChange={set('complement')} />
          </FormField>

          <FormField id="neighborhood" label={t.neighborhoodField} error={errors.neighborhood}>
            <Input id="neighborhood" value={fields.neighborhood} onChange={set('neighborhood')} />
          </FormField>

          <FormField
            id="citySearch"
            label={citiesLoading ? t.cityLoading : t.cityField}
            error={errors.citySearch}
          >
            <Input
              id="citySearch"
              value={fields.citySearch}
              onChange={handleCityChange}
              list="city-options"
              autoComplete="off"
            />
            <datalist id="city-options">
              {municipalities.map((m) => (
                <option key={`${m.nome}-${m.uf}`} value={`${m.nome} (${m.uf})`} />
              ))}
            </datalist>
          </FormField>
        </div>
      </fieldset>

      <div className="flex justify-between gap-3">
        <div className="flex gap-2">
          {renderDeactivateBtn(
            !!onDeactivate,
            handleDeactivateClick,
            deactivating,
            isActive,
            t.deactivateGuest,
            t.deactivating,
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            {t.backStep}
          </Button>
          <Button type="button" disabled={submitting} onClick={onSubmit}>
            {submitting ? t.saving : submitLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
