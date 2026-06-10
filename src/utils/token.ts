export class Token {
  public static get(): string | null {
    return localStorage.getItem('token');
  }

  public static set(token: string): void {
    localStorage.setItem('token', token);
  }

  public static remove(): void {
    localStorage.removeItem('token');
  }
}
