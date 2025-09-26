import { useQuery } from "@tanstack/react-query";
import { requestListUserTransformationWorkshop,  requestUserOne} from "./request";

export const useFetchListUserTransformationWorkshop = () => {
    return useQuery(["useListUserTransformationWorkshop"], () => requestListUserTransformationWorkshop());
};

export const useFetchRequestUserOne = (idUser?: string) => {
    return useQuery(["useFetchRequestUserOne", idUser], () => requestUserOne(idUser),  {
      enabled: !!idUser,
    });
};