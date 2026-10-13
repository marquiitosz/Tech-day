/**
 * Value Object para manipulação segura e formatação de valores monetários (BRL).
 * Garante imutabilidade e cálculos precisos em centavos.
 */
export class ValorMonetario {
  private readonly centavos: number;

  private constructor(centavos: number) {
    this.centavos = Math.round(centavos);
  }

  public static deReais(reais: number): ValorMonetario {
    if (isNaN(reais)) {
      throw new Error('Valor monetário inválido.');
    }
    return new ValorMonetario(reais * 100);
  }

  public static deCentavos(centavos: number): ValorMonetario {
    if (isNaN(centavos)) {
      throw new Error('Centavos inválidos.');
    }
    return new ValorMonetario(centavos);
  }

  public static zero(): ValorMonetario {
    return new ValorMonetario(0);
  }

  public emReais(): number {
    return this.centavos / 100;
  }

  public somar(outro: ValorMonetario): ValorMonetario {
    return new ValorMonetario(this.centavos + outro.centavos);
  }

  public subtrair(outro: ValorMonetario): ValorMonetario {
    return new ValorMonetario(this.centavos - outro.centavos);
  }

  public ehNegativo(): boolean {
    return this.centavos < 0;
  }

  public formatar(): string {
    return (this.centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
