import type { TLang } from '../contexts/AppContext';

type TFloatToStringOptions = {
  showZero?: boolean;
  lang?: TLang;
};

type TCurrencyOptions = {
  showZero?: boolean;
  lang?: TLang;
};

export class NumberHandler {
  public static stringToFloat(
    value: string,
    decimalPlaces: number = 2,
  ): number {
    if (typeof value !== 'string') return 0;
    let isNegative = false;
    if (value.includes('-')) isNegative = true;
    value = value.replaceAll(/\D/g, '');
    const integer = value.slice(0, value.length - decimalPlaces);
    const decimal = value.slice(value.length - decimalPlaces);
    value = `${isNegative ? '-' : ''}${integer.padStart(1, '0')}.${decimal.padStart(2, '0')}`;
    return Number(value);
  }

  public static stringToInteger(value: string): number {
    let string = String(value);
    let isNegative = false;

    if (string.indexOf('-') !== -1) isNegative = true;

    if (string.indexOf('.') !== -1) {
      string = string.slice(0, string.indexOf('.'));
    }

    return Number(string.replace(/\D/g, '')) * (isNegative ? -1 : 1);
  }

  public static integerToString(value: number): string {
    if (value === 0) return '';
    return String(value);
  }

  public static floatToString(
    value: number,
    options?: TFloatToStringOptions,
  ): string {
    if (value === 0 && !options?.showZero) return '';
    const lang = options?.lang ?? 'ptBR';
    const separator = lang === 'ptBR' ? ',' : '.';
    return value.toString().replace('.', separator);
  }

  public static currency(value: number, options?: TCurrencyOptions): string {
    if (value === 0 && !options?.showZero) return '';

    const lang = options?.lang ?? 'ptBR';
    const formatedLang = `${lang.slice(0, 2)}-${lang.slice(2)}`;

    const currencies: Record<TLang, string> = {
      ptBR: 'BRL',
    };

    return new Intl.NumberFormat(formatedLang, {
      style: 'currency',
      currency: currencies[lang],
    }).format(value);
  }
}
