import ApiGateway from "../services/api-gateway";
import JSZip from "jszip";
import { useMutation } from "@tanstack/react-query";

export const useGenerateImages = () => {
    return useMutation({
        mutationFn: async (prompt: string) => {
            const zipBlob = await ApiGateway.genImgsFromText(prompt); // retorna zip
            const jszip = await JSZip.loadAsync(zipBlob.data);
            const blobs = await Promise.all(
                Object.values(jszip.files).map((f) => f.async("blob"))
            );
            return blobs.map((blob) => URL.createObjectURL(blob));
        },
    });
};
