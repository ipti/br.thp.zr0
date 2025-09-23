import { useQuery } from "@tanstack/react-query";
import { requestTransformationWorkshop } from "./request-bff";

export const useFetchRequestTransformationWorkshop = () => {
    return useQuery(["useRequestTransformationWorkshop"], () => requestTransformationWorkshop());
};