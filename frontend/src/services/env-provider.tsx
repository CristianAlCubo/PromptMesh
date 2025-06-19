export default class EnvProvider {
  public static getEnv(key: string): string | null {
    return import.meta.env[key] || null;
  }
}
