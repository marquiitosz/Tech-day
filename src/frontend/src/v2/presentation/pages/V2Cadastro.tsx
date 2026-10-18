import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design-system-v2.css';
import { LegacyAuthAdapter } from '../../infrastructure/acl/LegacyAuthAdapter';
import { CadastrarEmpreendedorUseCase } from '../../application/auth/CadastrarEmpreendedorUseCase';
import { UiButton } from '../components/UiButton';
import { UiInput } from '../components/UiInput';
import { UiSelect } from '../components/UiSelect';

const authAdapter = new LegacyAuthAdapter();
const cadastrarUseCase = new CadastrarEmpreendedorUseCase(authAdapter);

export const V2Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoEmpresa, setTipoEmpresa] = useState('Microempreendedor Individual (MEI)');

  const [erroNome, setErroNome] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validarCampos = (): boolean => {
    let valido = true;
    setErroNome('');
    setErroEmail('');
    setErroSenha('');
    setErroGeral('');

    if (!nome.trim()) {
      setErroNome('Informe o seu nome completo.');
      valido = false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErroEmail('Informe um e-mail válido (exemplo: voce@empresa.com).');
      valido = false;
    }

    if (!senha || senha.length < 6) {
      setErroSenha('A senha deve conter no mínimo 6 caracteres.');
      valido = false;
    }

    return valido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    setIsLoading(true);
    setErroGeral('');

    try {
      await cadastrarUseCase.executar({
        nome,
        email,
        senha,
        tipoEmpresa,
      });

      setSucesso(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setErroGeral((err as Error).message || 'Falha ao cadastrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-page-container flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-[#13112a]/90 backdrop-blur-md border border-indigo-500/25 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <span className="ui-tagline">EmpreendaFácil V2</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Crie sua Conta</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tenha acesso a ferramentas de gestão financeira, relatórios e consultoria inteligente.
          </p>
        </div>

        {erroGeral && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {erroGeral}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
            ✓ Cadastro concluído com sucesso! Redirecionando...
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <UiInput
            label="Nome Completo"
            placeholder="Seu nome ou razão social"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={erroNome}
            disabled={isLoading || sucesso}
            required
          />

          <UiInput
            type="email"
            label="E-mail Empresarial"
            placeholder="seu@negocio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={erroEmail}
            disabled={isLoading || sucesso}
            required
          />

          <UiInput
            type="password"
            label="Senha de Acesso"
            placeholder="Mínimo de 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={erroSenha}
            disabled={isLoading || sucesso}
            required
          />

          <UiSelect
            label="Enquadramento do Negócio"
            value={tipoEmpresa}
            onChange={(e) => setTipoEmpresa(e.target.value)}
            disabled={isLoading || sucesso}
          >
            <option value="Microempreendedor Individual (MEI)" className="bg-[#13112a]">
              MEI — Microempreendedor Individual
            </option>
            <option value="Microempresa (ME)" className="bg-[#13112a]">
              ME — Microempresa
            </option>
            <option value="Empresa de Pequeno Porte (EPP)" className="bg-[#13112a]">
              EPP — Empresa de Pequeno Porte
            </option>
          </UiSelect>

          <UiButton
            type="submit"
            variant="primary"
            className="w-full mt-2 py-3"
            isLoading={isLoading}
            disabled={sucesso}
          >
            Criar Minha Conta
          </UiButton>

          <div className="text-center mt-3 text-xs text-slate-400">
            Já possui uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
            >
              Fazer Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
