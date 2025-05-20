import { useQuery } from "@tanstack/react-query";
import { requestTransformationWorkshop } from "./request";

export const useFetchRequestTransformationWorkshop = () => {
    return useQuery(["useRequestTransformationWorkshop"], () => requestTransformationWorkshop());
};