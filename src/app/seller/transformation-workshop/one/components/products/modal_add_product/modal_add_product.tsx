import { useFetchListProductTransformationWorkshop } from "@/app/seller/user/service/query";
import { UserList } from "@/app/seller/user/type";
import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZDropdown from "@/components/dropdown/dropdown";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { AddUserTransfWorkshopController } from "../../../service/controller";
import { useSearchParams } from "next/navigation";
import { useFetchRequestProduct } from "@/app/seller/product/service/query";

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
  

  const addUserTransfWorkshopController = AddUserTransfWorkshopController();

  const schema = Yup.object().shape({
    product: Yup.object().required("Campo Obrigatório"),
  });

  var listProduct: UserList | undefined = productsRequest;

  var initial: { product: any | undefined } = { product: undefined };

  return (
    <ZDialog visible={visible} onHide={onHide} header={"Adicionar Produtos"}>
      <Formik
        initialValues={initial}
        validationSchema={schema}
        onSubmit={(values) => {
          console.log(values);
          addUserTransfWorkshopController.AddProductTransfWorkshopAction({
            product_fk: values.product?.id,
            tw_fk: parseInt(idOt ?? ""),
          });
          onHide()
        }}
      >
        {({ values, errors, handleChange, touched }) => {
          return (
            <Form>
              <div className="p-2" />
              <ZDropdown
                options={listProduct}
                optionLabel="name"
                filter
                name="product"
                value={values.product}
                onChange={handleChange}
                placeholder="Selecione o membro para adicionar"
                className="w-full md:w-25rem"
              />
              {errors.product && touched.product ? (
                <>
                  <div className="p-1" />
                  <div style={{ color: "red" }}>{errors.product.toLocaleString() ?? ""}</div>
                </>
              ) : null}
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
