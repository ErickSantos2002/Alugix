import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Aplica máscara dd/MM/yyyy em inputs de data.
 * Aceita apenas dígitos; barras são inseridas automaticamente.
 */
@Directive({
  selector: '[appDateMask]',
  standalone: true,
})
export class DateMaskDirective {
  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  /** Bloqueia qualquer tecla que não seja dígito ou tecla de navegação */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const nav = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (nav.includes(event.key) || event.ctrlKey || event.metaKey) return;
    if (event.key >= '0' && event.key <= '9') return;
    event.preventDefault();
  }

  /** Formata o valor como dd/MM/yyyy enquanto o usuário digita */
  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const selStart = input.selectionStart ?? 0;
    const prevLen  = input.value.length;

    // Extrai apenas dígitos, limitado a 8
    const raw = input.value.replace(/\D/g, '').slice(0, 8);

    // Monta a máscara
    let formatted = raw;
    if (raw.length > 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    } else if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }

    input.value = formatted;

    // Reposiciona cursor levando em conta as barras inseridas
    const diff = formatted.length - prevLen;
    const newPos = Math.max(0, selStart + diff);
    input.setSelectionRange(newPos, newPos);
  }
}
