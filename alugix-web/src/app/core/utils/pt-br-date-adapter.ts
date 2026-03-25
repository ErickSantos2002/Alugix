import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * Adapter que estende o NativeDateAdapter para parsear datas no formato dd/MM/yyyy,
 * padrão brasileiro usado pela DateMaskDirective.
 */
@Injectable()
export class PtBrDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const str = value.trim();
      const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const day   = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // 0-based
        const year  = parseInt(match[3], 10);
        if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 1000) {
          return new Date(year, month, day);
        }
      }
    }
    return super.parse(value);
  }
}
