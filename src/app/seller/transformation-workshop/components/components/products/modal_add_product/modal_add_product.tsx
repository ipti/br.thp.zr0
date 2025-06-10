import { useFetchRequestProduct } from "@/app/seller/product/service/query";
import { UserList } from "@/app/seller/user/type";
import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZDropdown from "@/components/dropdown/dropdown";
import ZInputNumber from "@/components/input_number/input_number";
import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { TransfWorkshopController } from "../../../service/controller";
import { getIdTw } from "@/service/localstorage";

export default function ModalAddProduct({
  onHide,
  visible,
}: {
  visible: boolean;
  onHide: any;
}) {
  const { data: productsRequest } = useFetchRequestProduct();

  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");

  const transfWorkshopController = TransfWorkshopController();

  const schema = Yup.object().shape({
    product: Yup.object().required("Campo Obrigatório"),
    quantity: Yup.number().required("Campo Obrigatório")
  });

  var listProduct: UserList | undefined = productsRequest;

  var initial: { product: any | undefined, quantity: number | undefined } = { product: undefined,quantity: 0 };

  return (
    <ZDialog visible={visible} onHide={onHide} header={"Adicionar Produtos"}>
      <Formik
        initialValues={initial}
        validationSchema={schema}
        onSubmit={(values) => {
          transfWorkshopController.AddProductTransfWorkshopAction({
            product_fk: values.product?.id,
            tw_fk: idOt ? parseInt(idOt ?? "") : parseInt(getIdTw() ?? "1"),
            quantity: values.quantity ?? 0
          });
          onHide();
        }}
      >
        {({ values, errors, handleChange, touched, setFieldValue }) => {
          return (
            <Form>
              <div className="mb-4">
                <div className="flex flex-column">
                <label className="mb-2">Produtos</label>
                  <ZDropdown
                    options={listProduct}
                    optionLabel="name"
                    filter
                    name="product"
                    value={values.product}
                    onChange={handleChange}
                    placeholder="Selecione o produto para adicionar"
                    className="w-full md:w-25rem"
                  />
                  {errors.product && touched.product ? (
                    <>
                      <div className="p-1" />
                      <div style={{ color: "red" }}>
                        {errors.product.toLocaleString() ?? ""}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              <div>
                <div className="flex flex-column">
                  <label className="mb-2">Quantidade</label>
                  <ZInputNumber
                    name="quantity"
                    value={values.quantity}
                    onChange={(e) => setFieldValue("quantity", e.value)}
                    placeholder="Digite a altura"
                    invalid={!!(errors.quantity && touched.quantity)}
                  ></ZInputNumber>
                  {errors.quantity && touched.quantity ? (
                    <>
                      <div className="p-1" />
                      <div style={{ color: "red" }}>{errors.quantity}</div>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="p-3" />
              <div className="flex flex-row justify-content-center">
                <ZButton label="Adicionar" />
              </div>
            </Form>
          );
        }}
      </Formik>
    </ZDialog>
  );
}
