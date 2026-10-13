import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import '../styles/design-system-v2.css';
import { LegacyAuthAdapter } from '../../infrastructure/acl/LegacyAuthAdapter';
import { AutenticarEmpreendedorUseCase } from '../../application/auth/AutenticarEmpreendedorUseCase';
import { UiButton } from '../components/UiButton';
import { UiInput } from '../components/UiInput';

const authAdapter = new LegacyAuthAdapter();
const autenticarUseCase = new AutenticarEmpreendedorUseCase(authAdapter);

export const V2Login: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const validarCampos = (): boolean => {
    let valido = true;
    setErroEmail('');
    setErroSenha('');
    setErroGeral('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErroEmail('Informe um e-mail válido.');
      valido = false;
    }

    if (!senha) {
      setErroSenha('Informe sua senha.');
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
      await autenticarUseCase.executar({ email, senha });
      navigate('/dashboard');
    } catch (err) {
      setErroGeral((err as Error).message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-page-container flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-[#13112a]/90 backdrop-blur-md border border-indigo-500/25 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <span className="ui-tagline">EmpreendaFácil V2</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Acesse sua Conta</h2>
          <p className="text-xs text-slate-400 mt-1">
            Entre para gerenciar seu fluxo de caixa, relatórios e falar com a Verity IA.
          </p>
        </div>

        {erroGeral && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {erroGeral}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <UiInput
            type="email"
            label="E-mail"
            placeholder="seu@negocio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={erroEmail}
            disabled={isLoading}
            required
          />

          <UiInput
            type="password"
            label="Senha"
            placeholder="Sua senha de acesso"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={erroSenha}
            disabled={isLoading}
            required
          />

          <UiButton
            type="submit"
            variant="primary"
            className="w-full mt-2 py-3"
            isLoading={isLoading}
          >
            Entrar no Sistema
          </UiButton>

          <div className="text-center mt-3 text-xs text-slate-400">
            Ainda não tem conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/formulario')}
              className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
            >
              Criar Conta Gratuita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
