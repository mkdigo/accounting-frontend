export class Mask {
  //example: (11) 94567-8901
  public static cellPhone(value: string | number): string {
    value = value.toString();

    value = value.replace(/\D/g, '');

    let formatedValue = `${value.substring(0, 2)}`;

    if (value.length > 2)
      formatedValue = `(${formatedValue}) ${value.substring(2, 7)}`;

    if (value.length > 7)
      formatedValue = `${formatedValue}-${value.substring(7, 11)}`;

    return formatedValue;
  }

  // example: 12345-123
  public static zipcode(value: string | number): string {
    value = value.toString();

    value = value.replace(/\D/g, '');

    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }

    return value;
  }
}
