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

  const { data: stateRequest } = useFetchRequestState();

  useEffect(() => {
    if (stateRequest) {
      setState(stateRequest);
    }
  }, [stateRequest]);

  const dadosCep = async (value: string, setFieldValue: any) => {
    if (value) {
      const cep = value.replace(/[^a-zA-Z0-9 ]/g, "");

      await axios
        .get("https://viacep.com.br/ws/" + cep + "/json/")
        .then((data) => {
          const stateCep = state?.find(
            (props) => props.acronym === data.data.uf
          );
          const cityCep = stateCep?.city.find(
            (props) => props.name === data.data.localidade.toUpperCase()
          );

          setFieldValue("address", data.data.logradouro);
          setFieldValue("neighborhood", data.data.bairro);
          setFieldValue("complement", data.data.complemento);
          setFieldValue("state", stateCep?.id);
          setFieldValue("city", cityCep?.id);
        })
        .catch((error) => {
          return error;
        });
    }
  };

  return { dadosCep, state, setStateId, stateId };
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
              props.dadosCep(e.target.value!, setFieldValue);
            }}
            name="cep"
          />
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
                  props.setStateId(e.target.value.id);
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
