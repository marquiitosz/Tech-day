import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LegacyAuthAdapter } from '../../infrastructure/acl/LegacyAuthAdapter';
import type { Empreendedor } from '../../domain/auth/Empreendedor';
import { UiCard } from '../components/UiCard';
import { UiButton } from '../components/UiButton';
import '../styles/design-system-v2.css';

const authAdapter = new LegacyAuthAdapter();

type EstadoCarregamento = 'carregando' | 'carregado' | 'erro';

export function V2Configuracoes() {
  const navigate = useNavigate();
  const [empreendedor, setEmpreendedor] = useState<Empreendedor | null>(null);
  const [estado, setEstado] = useState<EstadoCarregamento>('carregando');

  useEffect(() => {
    let montado = true;

    authAdapter
      .obterSessao()
      .then((resultado) => {
        if (!montado) return;
        if (!resultado) {
          navigate('/login', { replace: true });
          return;
        }
        setEmpreendedor(resultado);
        setEstado('carregado');
      })
      .catch(() => {
        if (montado) setEstado('erro');
      });

    return () => {
      montado = false;
    };
  }, [navigate]);

  function handleLogout() {
    void authAdapter.encerrarSessao().then(() => {
      navigate('/', { replace: true });
    });
  }

  return (
    <section className="ui-page-container">
      <div className="ui-content-wrapper" style={{ maxWidth: 680 }}>
        {/* Cabeçalho */}
        <div className="ui-page-header">
          <div>
            <p className="ui-tagline">Conta</p>
            <h1 className="ui-title">Configurações</h1>
          </div>
          <UiButton
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            ← Voltar
          </UiButton>
        </div>

        {/* Estado: carregando */}
        {estado === 'carregando' && (
          <UiCard>
            <p className="ui-subtitle">Carregando perfil…</p>
          </UiCard>
        )}

        {/* Estado: erro */}
        {estado === 'erro' && (
          <UiCard>
            <p style={{ color: '#f87171', fontSize: 14 }}>
              Não foi possível carregar os dados do perfil. Tente recarregar a
              página.
            </p>
          </UiCard>
        )}

        {/* Estado: carregado */}
        {estado === 'carregado' && empreendedor && (
          <>
            {/* Dados do perfil */}
            <UiCard title="Dados do perfil">
              <table className="ui-config-table">
                <tbody>
                  <tr>
                    <td className="ui-config-label">Nome</td>
                    <td className="ui-config-value">{empreendedor.nome}</td>
                  </tr>
                  <tr>
                    <td className="ui-config-label">E-mail</td>
                    <td className="ui-config-value">
                      {empreendedor.email.obterValor()}
                    </td>
                  </tr>
                  <tr>
                    <td className="ui-config-label">Tipo de empresa</td>
                    <td className="ui-config-value">
                      {empreendedor.tipoEmpresa.obterDescricao()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </UiCard>

            {/* Preferências */}
            <UiCard title="Preferências da conta">
              <p className="ui-subtitle">
                Opções de personalização e notificações estarão disponíveis em
                breve.
              </p>
            </UiCard>

            {/* Sessão */}
            <UiCard title="Sessão">
              <p className="ui-subtitle" style={{ marginBottom: '1rem' }}>
                Encerre sua sessão neste dispositivo com segurança.
              </p>
              <UiButton variant="danger" onClick={handleLogout}>
                Sair da conta
              </UiButton>
            </UiCard>
          </>
        )}
      </div>
    </section>
  );
}
