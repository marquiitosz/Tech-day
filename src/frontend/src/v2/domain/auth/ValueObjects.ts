/**
 * Value Object para Validação de E-mail
 */
export class Email {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor.toLowerCase().trim();
  }

  public static criar(email: string): Email {
    if (!email || !email.trim()) {
      throw new Error('O e-mail é obrigatório.');
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) {
      throw new Error('Informe um formato de e-mail válido (ex: nome@empresa.com).');
    }
    return new Email(email);
  }

  public obterValor(): string {
    return this.valor;
  }
}

/**
 * Value Object para Senha do Empreendedor
 */
export class Senha {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  public static criar(senha: string): Senha {
    if (!senha) {
      throw new Error('A senha é obrigatória.');
    }
    if (senha.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }
    return new Senha(senha);
  }

  public obterValor(): string {
    return this.valor;
  }
}

/**
 * Enquadramento Jurídico da Empresa
 */
export type EnquadramentoEmpresa = 'MEI' | 'ME' | 'EPP';

export class TipoEmpresa {
  private readonly valor: EnquadramentoEmpresa;

  private constructor(valor: EnquadramentoEmpresa) {
    this.valor = valor;
  }

  public static criar(valor: string): TipoEmpresa {
    const normalizado = valor.toUpperCase();
    if (normalizado.includes('MEI') || normalizado.includes('INDIVIDUAL')) {
      return new TipoEmpresa('MEI');
    }
    if (normalizado.includes('EPP') || normalizado.includes('PEQUENO PORTE')) {
      return new TipoEmpresa('EPP');
    }
    if (normalizado.includes('ME') || normalizado.includes('MICROEMPRESA')) {
      return new TipoEmpresa('ME');
    }
    return new TipoEmpresa('MEI');
  }

  public obterValor(): EnquadramentoEmpresa {
    return this.valor;
  }

  public obterDescricao(): string {
    switch (this.valor) {
      case 'MEI':
        return 'Microempreendedor Individual (MEI)';
      case 'ME':
        return 'Microempresa (ME)';
      case 'EPP':
        return 'Empresa de Pequeno Porte (EPP)';
    }
  }
}
