import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks";
import Button from "../components/ui/Button/Button";
import Input from "../components/ui/Input/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: () => navigate("/") }
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="app-brand__mark">FC</div>
          <h1 className="auth-card__title">Entrar</h1>
          <p className="auth-card__subtitle">Finanças da Casa — controle mensal pessoal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className="ui-field">
            <label htmlFor="password" className="ui-label">Senha</label>
            <div className="ui-password-wrapper">
              <input
                id="password"
                className="ui-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="ui-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {login.error && (
            <p className="auth-form__error">
              {(login.error as Error).message || "Credenciais inválidas"}
            </p>
          )}

          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <p className="auth-card__footer">
          Não tem conta?{" "}
          <Link to="/register" className="auth-card__link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
