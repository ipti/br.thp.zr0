import { useQuery } from "@tanstack/react-query";
import { requestListUserTransformationWorkshop } from "./request";

export const useFetchListUserTransformationWorkshop = () => {
    return useQuery(["useListUserTransformationWorkshop"], () => requestListUserTransformationWorkshop());
};