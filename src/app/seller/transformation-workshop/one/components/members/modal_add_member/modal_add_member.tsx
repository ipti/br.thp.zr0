import { useFetchListUserTransformationWorkshop } from "@/app/seller/user/service/query";
import { UserList } from "@/app/seller/user/type";
import ZDialog from "@/components/dialog/dialog";

export default function ModalAddMember({onHide, visible}:{visible: boolean, onHide: any}) {
  const { data: listUserRequest } = useFetchListUserTransformationWorkshop();

  var listUser: UserList | undefined = listUserRequest;
  return (
    <ZDialog
      visible={visible}
      onHide={onHide}
    >
      <div>
        {listUser?.map((item, key) => {
          return <div key={key}>{item.name}</div>;
        })}
      </div>
    </ZDialog>

  );
}
