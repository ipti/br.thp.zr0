"use client"
import axios from "axios";
import { useEffect, useState } from "react";

import { StateList } from "./type";
import ZInputText from "../input/input";
import ZDropdown from "../dropdown/dropdown";
import { useFetchRequestState } from "./query";
import ZInputMask from "../input_mask/input_mask";

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

  const dadosCep = async (value: string, setFieldValue: any) => {
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
  values: any;
  handleChange: any;
  errors: any;
  touched: any;
  setFieldValue: any;
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
          <label>CEP </label>
          <div className="p-2" />
          <ZInputMask
            value={values.cep}
            mask="99999-999"
            placeholder="Cep"
            onChange={(e) => {
              setFieldValue("cep", e.target.value);
              props.setCepError(null);
              props.dadosCep(e.target.value!, setFieldValue);
            }}
            name="cep"
          />
          {props.cepLoading ? (
            <div style={{ marginTop: "8px" }}>Consultando CEP...</div>
          ) : null}
          {props.cepError ? (
            <div style={{ color: "red", marginTop: "8px" }}>{props.cepError}</div>
          ) : null}
          {errors.cep && touched.cep ? (
            <div style={{ color: "red", marginTop: "8px" }}>{errors.cep}</div>
          ) : null}
        </div>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label>Endereço </label>
          <div className="p-2" />
          <ZInputText
            value={values.address}
            placeholder="Endereço"
            onChange={handleChange}
            name="address"
          />
          {errors.address ? (
            <div style={{ color: "red", marginTop: "8px" }}>
              {errors.address}
            </div>
          ) : null}
        </div>
      </div>
       <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label>Número </label>
          <div className="p-2" />
          <ZInputText
            value={values.number}
            placeholder="Número"
            onChange={handleChange}
            name="number"
          />
          {errors.number ? (
            <div style={{ color: "red", marginTop: "8px" }}>
              {errors.number}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label>Bairro/Povoado </label>
          <div className="p-2" />
          <ZInputText
            value={values.neighborhood}
            placeholder="Bairro/Povoado"
            onChange={handleChange}
            name="neighborhood"
          />
          {errors.neighborhood ? (
            <div style={{ color: "red", marginTop: "8px" }}>
              {errors.neighborhood}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <div className="flex flex-column">
          <label>Complemento </label>
          <div className="p-2" />
          <ZInputText
            value={values.complement}
            placeholder="Complemento"
            onChange={handleChange}
            name="complement"
          />
          {errors.complement && touched.complement ? (
            <div style={{ color: "red", marginTop: "8px" }}>
              {errors.complement}
            </div>
          ) : null}
        </div>
      </div>
      {props.state && (
        <>
          <div className="mb-4 col-12 md:col-6">
            <div className="flex flex-column">
              <label>Estado *</label>
              <div className="p-2" />
              <ZDropdown
                value={values.state}
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
              />
              {errors.state ? (
                <div style={{ color: "red", marginTop: "8px" }}>
                  {errors.state}
                </div>
              ) : null}
            </div>
          </div>
          {props.stateId && (
            <div className="mb-4 col-12 md:col-6">
              <div className="flex flex-column">
                <label>Cidade *</label>
                <div className="p-2" />
                <ZDropdown
                  value={values.city}
                  placeholder="Cidade"
                  name="city"
                  optionLabel="name"
                   optionValue="id"
                  onChange={handleChange}
                  options={
                    props.state.find((item) => item.id === props.stateId)?.city
                  }
                />
                {errors.city ? (
                  <div style={{ color: "red", marginTop: "8px" }}>
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
