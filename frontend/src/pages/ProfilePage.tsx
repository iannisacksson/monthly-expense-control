import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store";
import { useUpdateMe, useDeleteMe, useLogout } from "../hooks";
import Button from "../components/ui/Button/Button";
import Input from "../components/ui/Input/Input";
import Card from "../components/ui/Card/Card";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const updateMe = useUpdateMe();
  const deleteMe = useDeleteMe();
  const logout = useLogout();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const dto: { name?: string; email?: string; password?: string } = {};
    if (name !== user?.name) dto.name = name;
    if (email !== user?.email) dto.email = email;
    if (password) dto.password = password;

    updateMe.mutate(dto, {
      onSuccess: () => {
        setPassword("");
        setEditMode(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.")) {
      deleteMe.mutate();
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div className="page-hero__content">
          <div className="page-hero__eyebrow">Conta</div>
          <h1 className="page-title">Meu perfil</h1>
          <p className="page-subtitle">Gerencie suas informações de acesso.</p>
        </div>
        <div className="page-hero__actions">
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>
      </section>

      <section className="page-section">
        <Card>
          {!editMode ? (
            <div className="profile-view">
              <div className="profile-view__field">
                <span className="section-label">Nome</span>
                <strong>{user?.name}</strong>
              </div>
              <div className="profile-view__field">
                <span className="section-label">E-mail</span>
                <strong>{user?.email}</strong>
              </div>
              {saved && (
                <p className="auth-form__success">Perfil atualizado com sucesso.</p>
              )}
              <div className="action-row">
                <Button onClick={() => setEditMode(true)}>Editar perfil</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="auth-form">
              <Input
                id="profile-name"
                label="Nome"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                id="profile-email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="profile-password"
                label="Nova senha (deixe em branco para manter)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />

              {updateMe.error && (
                <p className="auth-form__error">
                  {(updateMe.error as Error).message || "Erro ao salvar"}
                </p>
              )}

              <div className="action-row">
                <Button type="submit" disabled={updateMe.isPending}>
                  {updateMe.isPending ? "Salvando…" : "Salvar"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditMode(false);
                    setName(user?.name ?? "");
                    setEmail(user?.email ?? "");
                    setPassword("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </Card>
      </section>

      <section className="page-section">
        <div className="page-section__header">
          <div>
            <div className="section-label">Zona de risco</div>
            <h2 className="page-section__title">Excluir conta</h2>
            <p className="page-section__subtitle">
              Essa ação é permanente e não pode ser desfeita.
            </p>
          </div>
        </div>
        {deleteMe.error && (
          <p className="auth-form__error">
            {(deleteMe.error as Error).message || "Erro ao excluir conta"}
          </p>
        )}
        <Button variant="secondary" onClick={handleDelete} disabled={deleteMe.isPending}>
          {deleteMe.isPending ? "Excluindo…" : "Excluir minha conta"}
        </Button>
      </section>
    </div>
  );
}
