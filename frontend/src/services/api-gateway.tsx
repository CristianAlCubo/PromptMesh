import EnvProvider from "./env-provider";
import axios, { type AxiosResponse } from "axios";

export default class ApiGateway {
  private static API_GATEWAY_URL: string =
    EnvProvider.getEnv("VITE_API_GATEWAY_URL") || "";

  public static async genImgsFromText(
    prompt: string
  ): Promise<AxiosResponse<Blob>> {
    const response = axios.post(
      `${this.API_GATEWAY_URL}/txt2img/generate-image`,
      {
        prompt,
        num_images: 4,
      },
      {
        responseType: "blob",
      }
    );
    return response;
  }

  public static async genMeshFromImage(
    image: Blob
  ): Promise<AxiosResponse<Blob>> {
    const formData = new FormData();
    formData.append("image", image);

    const response = axios.post(
      `${this.API_GATEWAY_URL}/img2mesh/generate-mesh`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      }
    );
    return response;
  }
}
