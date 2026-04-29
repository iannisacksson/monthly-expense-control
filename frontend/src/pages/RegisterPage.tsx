import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister, useLogin } from "../hooks";
import Button from "../components/ui/Button/Button";
import Input from "../components/ui/Input/Input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const register = useRegister();
  const login = useLogin();
  const navigate = useNavigate();
  const isPending = register.isPending || login.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          login.mutate(
            { email, password },
            { onSuccess: () => navigate("/") }
          );
        },
      }
    );
  };

  const error = register.error ?? login.error;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="app-brand__mark">FC</div>
          <h1 className="auth-card__title">Criar conta</h1>
          <p className="auth-card__subtitle">Comece a controlar suas finanças mensais</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="name"
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
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
                autoComplete="new-password"
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

          {error && (
            <p className="auth-form__error">
              {(error as Error).message || "Erro ao criar conta"}
            </p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando conta…" : "Criar conta"}
          </Button>
        </form>

        <p className="auth-card__footer">
          Já tem conta?{" "}
          <Link to="/login" className="auth-card__link">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
