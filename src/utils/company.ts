export class Company {
  public static getCompanyId(): string | null {
    return localStorage.getItem('companyId');
  }

  public static setCompanyId(id: string): void {
    localStorage.setItem('companyId', id);
  }

  public static removeCompanyId(): void {
    localStorage.removeItem('companyId');
  }
}
