import { FormControl } from '@angular/forms';
import { isValidNumber, parse } from 'libphonenumber-js';
import { AppDefaults } from 'src/app/app.constants';

export class AppValidators {
  static customRequired(control: FormControl) {
    try {
      const regex = /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/;
      if (
        typeof control.value !== 'undefined' &&
        control.value != null &&
        control.value !== '' &&
        control.value.trim().length === 0 &&
        !regex.test(control.value)
      ) {
        return { customRequired: true };
      }
      return null;
    } catch (error) {
      return { customRequired: true };
    }
  }

  static contact(control: FormControl): any {
    try {
      if (typeof control.value !== 'undefined' && control.value != null && control.value !== '') {
        const isContactValid = isValidNumber(parse(`${control.value}`, 'IN'));
        if (!isContactValid || isNaN(control.value)) {
          return { contact: true };
        } else {
          return null;
        }
      }
    } catch (error) {
      return { contact: true };
    }
  }

  static email(control: FormControl) {
    const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
    if (typeof control.value !== 'undefined' && control.value != null && control.value !== '' && !emailRegex.test(control.value)) {
      return { email: true };
    }
    return null;
  }

  static fileType(allowedFileType: Array<string>): any {
    return (control: FormControl) => {
      const type = control && control.value ? control.value.type : null;
      if (type && allowedFileType.indexOf(type) === -1) {
        return { fileType: true };
      }
      return null;
    };
  }

  static fileSize(maxSize: number = AppDefaults.MIN_ALLOWED_FILE_SIZE): any {
    return (control: FormControl) => {
      const size = control && control.value ? control.value.size : null;
      const type = control && control.value ? control.value.type : null;
      if (size > maxSize) {
        return { fileSize: true };
      }
      return null;
    };
  }
}
