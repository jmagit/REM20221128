import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs';

@Pipe({
  name: 'elipsis'
})
export class ElipsisPipe implements PipeTransform {
  transform(value: any, maxlen: number): any {
    return (!maxlen || maxlen < 2 || !value || value.length <= maxlen) ?
      value : (value.substr(0, maxlen - 1) + '\u2026');
  }
}

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): any {
    return value?.toString().toLowerCase().split(".").map(frase => frase.trim())
      .map((frase, index, array) => frase.length === 0  ? (array.length > 1 && index + 1 < array.length  ? (array[index + 1] ==='' ? '.' : '. '): '')
       : frase.charAt(0)?.toUpperCase() + frase?.substring(1) + (array.length > 1 && index + 1 < array.length ? (array[index + 1] ==='' ? '.' : '. '):''))
      .join('').trim()
    // return value?.charAt(0)?.toUpperCase() + value?.substring(1)?.toLowerCase();
  }
}

@Pipe({name: 'striptags'})
export class StripTagsPipe implements PipeTransform {

  transform(text: string, ...allowedTags: any[]): string {
    const etiquetas = `(?:.|\\s)*?`
    return allowedTags.length > 0
      ? text.replace(new RegExp(`<(?!\\/?(${allowedTags.join('|')})\\s*\\/?)[^>]+>`, 'g'), '')
      : text.replace(new RegExp(`<${etiquetas}>`, 'g'), '');
  }
}

@Pipe({
  name: 'errormsg'
})
export class ErrorMessagePipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return;
    }
    let msg = '';
    for (const err in value) {
      switch (err) {
        case 'required':
          msg += 'Es obligatorio. ';
          break;
        case 'minlength':
          msg += `Como mínimo debe tener ${value[err].requiredLength} caracteres. `;
          break;
        case 'maxlength':
          msg += `Como máximo debe tener ${value[err].requiredLength} caracteres. `;
          break;
        case 'pattern':
        case 'email':
          msg += 'El formato no es correcto. ';
          break;
        case 'min':
          msg += `El valor debe ser mayor o igual a ${value[err].min}. `;
          break;
        case 'max':
          msg += `El valor debe ser inferior o igual a ${value[err].max}. `;
          break;
        default:
          if (typeof value[err] === 'string')
            msg += `${value[err]}${value[err].endsWith('.')?'':'.'} `;
          else if (typeof value[err]?.message === 'string')
            msg += `${value[err].message}${value[err].message.endsWith('.')?'':'.'} `;
          break;
      }
    }
    return msg.trim();
  }
}

export const PIPES_CADENAS = [ ElipsisPipe, CapitalizePipe, StripTagsPipe, ErrorMessagePipe, ]
