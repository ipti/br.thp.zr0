import { useFetchListUserTransformationWorkshop } from "@/app/seller/user/service/query";
import { UserList } from "@/app/seller/user/type";
import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZDropdown from "@/components/dropdown/dropdown";
import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { MemberTransfWorkshopController } from "../../service/controller";

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
  

  const memberTransfWorkshopController = MemberTransfWorkshopController();

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
          memberTransfWorkshopController.AddUserTransfWorkshopAction({
            user_fk: values.user?.id,
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
