import ModalAddressCustomer from "@/app/profile/address/components/modal_add_addresss/modal_add_address";
import { useFetchRequestGetAddressCustomer } from "@/app/profile/address/service/query";
import { AddressList } from "@/app/profile/address/service/type";
import { ZButton } from "@/components/button/button";
import ZInputText from "@/components/input/input";
import ZInputMask from "@/components/input_mask/input_mask";
import InputAddress from "@/components/inputs_address/inputs_address";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import CardAddress from "../card_address/card_address";
import { CardContextType, CartContext } from "../../context/context";

export default function Address({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void;
}) {


  const [visibleAddAddress, setVisibleAddAddress] = useState(false)


  const { data: addressCustomerRequest } = useFetchRequestGetAddressCustomer()

  var addressList: AddressList | undefined = addressCustomerRequest


  function addingAddress() {
    return (
      <div className="w-8 md:w-7">
        <div className="p-3" />
        <h2>Novo endereço</h2>
        <div className="p-3" />
        <h2>Quem irá receber?</h2>
        <div className="p-3" />
        <Formik initialValues={{ name: "", phone: "" }} onSubmit={() => { }}>
          {({ values, handleChange, errors, touched, setFieldValue }) => {
            return (
              <Form>
                <div className="mb-4">
                  <div className="flex flex-column ">
                    <label className="mb-2">Nome</label>
                    <ZInputText
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Digite o seu name"
                      invalid={!!(errors.name && touched.name)}
                    ></ZInputText>
                    {errors.name && touched.name ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.name}</div>
                      </>
                    ) : null}{" "}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex flex-column ">
                    <label className="mb-2">Telefone</label>
                    <ZInputMask
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      mask="(99) 9 9999-9999"
                      placeholder="Digite o seu telefone"
                      invalid={!!(errors.phone && touched.phone)}
                    ></ZInputMask>
                    {errors.phone && touched.phone ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.phone}</div>
                      </>
                    ) : null}{" "}
                  </div>
                </div>
                <h2>Complete as informações do Endereço</h2>
                <div className="p-3" />
                <div className="grid">
                  <InputAddress
                    errors={errors}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    values={values}
                  />
                </div>
                <div className="flex flex-row justify-content-end">
                  <ZButton label="Salvar e continuar" />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
  return (
    <div>
      <div>
        <div className="m-4 flex flex-row justify-content-end">
          <ZButton label="Adicionar endereço" onClick={() => setVisibleAddAddress(!visibleAddAddress)} />
        </div>
        {addressList?.map((item) => {
          return (
            <div key={item.id}>
              <CardAddress item={item} /> 
            </div>
          )
        })}
         <div className="m-4 flex flex-row justify-content-end gap-1">
           <ZButton
          label="Voltar"
          security="secondary"
          onClick={() => {
            handleActiveIndex(0);
          }}
        />
          <ZButton label="Continuar" onClick={() => { handleActiveIndex(2) }}/>
        </div>
        {/* {addingAddress()} */}
        <ModalAddressCustomer visible={visibleAddAddress} onHide={() => setVisibleAddAddress(!visibleAddAddress)} />
      </div>
    </div>
  );
}
