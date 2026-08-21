"use client"
import axios from "axios";
import { useEffect, useState } from "react";

import { StateList } from "./type";
import ZInputText from "../input/input";
import ZDropdown from "../dropdown/dropdown";
import { useFetchRequestState } from "./query";
import ZInputMask from "../input_mask/input_mask";
import { FormikProps } from "formik";

export type AddressFormValues = {
  cep: string
  address: string
  number: string
  neighborhood: string
  complement: string
  state?: number
  city?: number
}

const InputAddressState = () => {
  const [state, setState] = useState<StateList | undefined>();
  const [stateId, setStateId] = useState<number | undefined>();
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const { data: stateRequest } = useFetchRequestState();

  useEffect(() => {
    if (stateRequest) {
      setState(stateRequest);
    }
  }, [stateRequest]);

  const dadosCep = async (
    value: string,
    setFieldValue: FormikProps<AddressFormValues>['setFieldValue']
  ) => {
    const cep = value.replace(/\D/g, "");

    if (cep.length !== 8) {
      setCepError(null);
      return;
    }

    setCepLoading(true);
    setCepError(null);

    try {
      const response = await axios.get("https://viacep.com.br/ws/" + cep + "/json/");
      if (response.data?.erro) {
        setCepError("CEP não encontrado.");
        return;
      }

      const stateCep = state?.find(
        (props) => props.acronym === response.data.uf
      );
      const cityCep = stateCep?.city.find(
        (props) => props.name === response.data.localidade?.toUpperCase()
      );

      setFieldValue("address", response.data.logradouro ?? "");
      setFieldValue("neighborhood", response.data.bairro ?? "");
      setFieldValue("complement", response.data.complemento ?? "");
      setFieldValue("state", stateCep?.id);
      setFieldValue("city", cityCep?.id);

      if (!stateCep || !cityCep) {
        setCepError("CEP encontrado, mas não foi possível selecionar estado e cidade automaticamente.");
      }
    } catch {
      setCepError("Não foi possível consultar o CEP agora.");
    } finally {
      setCepLoading(false);
    }
  };

  return { dadosCep, state, setStateId, stateId, cepLoading, cepError, setCepError };
};

const InputAddress = ({
  errors,
  handleChange,
  touched,
  values,
  setFieldValue,
}: {
  values: AddressFormValues;
  handleChange: FormikProps<AddressFormValues>['handleChange'];
  errors: FormikProps<AddressFormValues>['errors'];
  touched: FormikProps<AddressFormValues>['touched'];
  setFieldValue: FormikProps<AddressFormValues>['setFieldValue'];
}) => {
  const props = InputAddressState();

  useEffect(() => {
    if (values.state) {
      props.setStateId(values.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.state]);

  useEffect(() => {
    const cep = values.cep?.replace(/\D/g, "");
    if (props.state?.length && cep?.length === 8 && !values.state) {
      void props.dadosCep(values.cep, setFieldValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.state, values.cep]);


  return (
    <>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label htmlFor="address-cep">CEP</label>
          <div className="p-2" />
          <ZInputMask
            value={values.cep}
            id="address-cep"
            mask="99999-999"
            placeholder="Cep"
            onChange={(e) => {
              setFieldValue("cep", e.target.value);
              props.setCepError(null);
              props.dadosCep(e.target.value!, setFieldValue);
            }}
            name="cep"
            aria-describedby="address-cep-feedback"
            invalid={Boolean((errors.cep && touched.cep) || props.cepError)}
          />
          <div id="address-cep-feedback" aria-live="polite">
            {props.cepLoading ? <div style={{ marginTop: "8px" }}>Consultando CEP...</div> : null}
            {props.cepError ? <div role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>{props.cepError}</div> : null}
            {errors.cep && touched.cep ? <div role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>{errors.cep}</div> : null}
          </div>
        </div>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label htmlFor="address-street">Endereço</label>
          <div className="p-2" />
          <ZInputText
            value={values.address}
            id="address-street"
            placeholder="Endereço"
            onChange={handleChange}
            name="address"
            aria-describedby={errors.address ? 'address-street-error' : undefined}
            invalid={Boolean(errors.address)}
          />
          {errors.address ? (
            <div id="address-street-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
              {errors.address}
            </div>
          ) : null}
        </div>
      </div>
       <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label htmlFor="address-number">Número</label>
          <div className="p-2" />
          <ZInputText
            value={values.number}
            id="address-number"
            placeholder="Número"
            onChange={handleChange}
            name="number"
            aria-describedby={errors.number ? 'address-number-error' : undefined}
            invalid={Boolean(errors.number)}
          />
          {errors.number ? (
            <div id="address-number-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
              {errors.number}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label htmlFor="address-neighborhood">Bairro/Povoado</label>
          <div className="p-2" />
          <ZInputText
            value={values.neighborhood}
            id="address-neighborhood"
            placeholder="Bairro/Povoado"
            onChange={handleChange}
            name="neighborhood"
            aria-describedby={errors.neighborhood ? 'address-neighborhood-error' : undefined}
            invalid={Boolean(errors.neighborhood)}
          />
          {errors.neighborhood ? (
            <div id="address-neighborhood-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
              {errors.neighborhood}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label htmlFor="address-complement">Complemento</label>
          <div className="p-2" />
          <ZInputText
            value={values.complement}
            id="address-complement"
            placeholder="Complemento"
            onChange={handleChange}
            name="complement"
            aria-describedby={errors.complement ? 'address-complement-error' : undefined}
            invalid={Boolean(errors.complement)}
          />
          {errors.complement && touched.complement ? (
            <div id="address-complement-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
              {errors.complement}
            </div>
          ) : null}
        </div>
      </div>
      {props.state && (
        <>
          <div className="mb-4 col-12 md:col-6">
            <div className="flex flex-column">
              <label htmlFor="address-state">Estado *</label>
              <div className="p-2" />
              <ZDropdown
                value={values.state}
                inputId="address-state"
                placeholder="Estado"
                name="state"
                optionLabel="name"
                optionValue="id"
                onChange={(e) => {
                  setFieldValue("state", e.target.value);
                  props.setStateId(e.target.value);
                  setFieldValue("city", undefined);
                }}
                options={props.state}
                aria-describedby={errors.state ? 'address-state-error' : undefined}
                invalid={Boolean(errors.state)}
              />
              {errors.state ? (
                <div id="address-state-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
                  {errors.state}
                </div>
              ) : null}
            </div>
          </div>
          {props.stateId && (
            <div className="mb-4 col-12 md:col-6">
              <div className="flex flex-column">
                <label htmlFor="address-city">Cidade *</label>
                <div className="p-2" />
                <ZDropdown
                  value={values.city}
                  inputId="address-city"
                  placeholder="Cidade"
                  name="city"
                  optionLabel="name"
                   optionValue="id"
                  onChange={handleChange}
                  options={
                    props.state.find((item) => item.id === props.stateId)?.city
                  }
                  aria-describedby={errors.city ? 'address-city-error' : undefined}
                  invalid={Boolean(errors.city)}
                />
                {errors.city ? (
                  <div id="address-city-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
                    {errors.city}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default InputAddress;
