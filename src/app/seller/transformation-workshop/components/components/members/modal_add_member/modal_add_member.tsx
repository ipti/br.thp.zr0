import { useFetchListUserTransformationWorkshop } from "@/app/seller/user/service/query";
import { UserList } from "@/app/seller/user/type";
import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZDropdown from "@/components/dropdown/dropdown";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { TransfWorkshopController } from "../../../service/controller";
import { useSearchParams } from "next/navigation";
import { getIdTw } from "@/service/localstorage";

export default function ModalAddMember({
  onHide,
  visible,
}: {
  visible: boolean;
  onHide: any;
}) {
  const { data: listUserRequest } = useFetchListUserTransformationWorkshop();

   const searchParams = useSearchParams();
  
    const idOt = searchParams.get("idOt");
  

  const transfWorkshopController = TransfWorkshopController();

  const schema = Yup.object().shape({
    user: Yup.object().required("Campo Obrigatório"),
  });

  var listUser: UserList | undefined = listUserRequest;

  var initial: { user: any | undefined } = { user: undefined };

  return (
    <ZDialog visible={visible} onHide={onHide} header={"Adicionar membro"}>
      <Formik
        initialValues={initial}
        validationSchema={schema}
        onSubmit={(values) => {
          transfWorkshopController.AddUserTransfWorkshopAction({
            user_fk: values.user?.id,
            tw_fk: idOt ? parseInt(idOt ?? "") : parseInt(getIdTw() ?? "1"),
          });
          onHide()
        }}
      >
        {({ values, errors, handleChange, touched }) => {
          return (
            <Form>
              <div className="p-2" />
              <ZDropdown
                options={listUser}
                optionLabel="name"
                filter
                name="user"
                value={values.user}
                onChange={handleChange}
                placeholder="Selecione o membro para adicionar"
                className="w-full md:w-25rem"
              />
              {errors.user && touched.user ? (
                <>
                  <div className="p-1" />
                  <div style={{ color: "red" }}>{errors.user.toLocaleString() ?? ""}</div>
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
