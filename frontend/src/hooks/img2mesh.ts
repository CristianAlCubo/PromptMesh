import JSZip from "jszip";
import ApiGateway from "../services/api-gateway";
import { useMutation } from "@tanstack/react-query";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";

export const useGenerateMesh = () => {
    return useMutation({
        mutationFn: async (image: Blob) => {
            const zipBlob = await ApiGateway.genMeshFromImage(image);
            const jszip = await JSZip.loadAsync(zipBlob.data);

            // Obtener el primer archivo .obj del zip
            const objFile = Object.values(jszip.files).find((file) =>
                file.name.toLowerCase().endsWith(".obj")
            );

            if (!objFile) {
                throw new Error("No se encontró un archivo .obj en el ZIP");
            }

            // Convertir el archivo a blob y crear URL
            const objBlob = await objFile.async("blob");
            return URL.createObjectURL(objBlob);
        },
    });
};

// Hook para cargar el modelo OBJ
export const useLoadModel = (objUrl: string | null) => {
    return useLoader(OBJLoader, objUrl || "");
};
