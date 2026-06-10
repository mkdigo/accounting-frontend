import type {
  TUserCreateData,
  TUserUpdateData,
  TPasswordReset,
} from '../api/user-api';
import type { TErrors } from '../components/Form/Wrapper';

export class UserValidatior {
  private _errors: TErrors = {};

  public get errors() {
    return this._errors;
  }

  private set errors(errors) {
    this._errors = { ...this.errors, ...errors };
  }

  private isValidName(name: string): boolean {
    if (name.length === 0 || name.length > 3) {
      return true;
    }
    this.errors = { name: ['Mínimo 3 letras.'] };
    return false;
  }

  public isValidEmail(email: string): boolean {
    const emailPattern = new RegExp(/(\w{3,}@)(\w{2,})(\.\w{2,})(\.\w{2}$)?/);
    if (email.length === 0 || emailPattern.test(email)) {
      return true;
    }
    this.errors = {
      email: ['Email inválido.'],
    };
    return false;
  }

  public isValidCellphone(cellphone: string): boolean {
    const cellphonePattern = new RegExp(
      /^(\+55\s)?(\(\d{2}\)\s)(9\d{4}-\d{4})$/,
    );
    if (cellphone.length === 0 || cellphonePattern.test(cellphone)) {
      return true;
    }
    this.errors = { cellphone: ['Celular inválido.'] };
    return false;
  }

  public isValidZipcode(zipcode: string): boolean {
    const zipcodePattern = new RegExp(/^\d{5}-\d{3}?/);
    if (zipcode.length === 0 || zipcodePattern.test(zipcode)) {
      return true;
    }
    this.errors = {
      zipcode: ['CEP inválido.'],
    };
    return false;
  }

  private isValidUsername(username: string): boolean {
    if (username.length === 0) return true;

    const errors: string[] = [];

    if (username.length < 5) {
      errors.push('Mínimo 5 letras.');
    }

    const usernamePattern = new RegExp(/^[a-zA-Z]\w{4,}/);
    if (!usernamePattern.test(username)) {
      errors.push('Nome de usuário inválido.');
    }

    if (errors.length === 0) return true;

    this.errors = { username: errors };

    return false;
  }

  private isValidPassword(password: string): boolean {
    if (password.length === 0) return true;

    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Mínimo 8 letras.');
    }

    if (String(password).search(/[A-Z]/) < 0) {
      errors.push('Deve ter no mínimo uma letra maiúscula.');
    }

    if (String(password).search(/[a-z]/) < 0) {
      errors.push('Deve ter no mínimo uma letra minúscula.');
    }

    if (String(password).search(/[0-9]/) < 0) {
      errors.push('Deve ter no mínimo um número.');
    }

    if (errors.length === 0) return true;

    this.errors = { password: errors };

    return false;
  }

  private isValidPasswordConfirmation(
    password: string,
    password_confirmation: string,
  ): boolean {
    if (
      password === password_confirmation ||
      password_confirmation.length === 0
    ) {
      return true;
    }

    this.errors = {
      password_confirmation: ['As senhas estão diferentes.'],
    };

    return false;
  }

  isValidCreateData(data: TUserCreateData): boolean {
    return (
      this.isValidName(data.name) &&
      this.isValidEmail(data.email) &&
      this.isValidCellphone(data.cellphone) &&
      this.isValidZipcode(data.zipcode) &&
      this.isValidUsername(data.username) &&
      this.isValidPassword(data.password) &&
      this.isValidPasswordConfirmation(
        data.password,
        data.password_confirmation,
      )
    );
  }

  isValidUpdateData(data: TUserUpdateData): boolean {
    return this.isValidName(data.name) && this.isValidUsername(data.username);
  }

  isValidPasswordResetData(data: TPasswordReset): boolean {
    return (
      this.isValidPassword(data.password) &&
      this.isValidPasswordConfirmation(
        data.password,
        data.password_confirmation,
      )
    );
  }
}
