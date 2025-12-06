import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { z } from "zod";
import { DataTable } from "../components/Datatable";
import { EntityFormModal } from "../components/EntityFormModal";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.email("Formato de e-mail inválido."),
});
type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormValues>({ name: "", email: "" });
  const [validationErrors, setValidationErrors] = useState<z.ZodIssue[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // -------------------------------
  // Fetch Users
  // -------------------------------
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data as User[];
    },
  });

  // -------------------------------
  // Save / Create Mutation
  // -------------------------------
  const saveMutation = useMutation<User, Error, UserFormValues>({
    mutationFn: async (payload) => {
      if (editUser?.isAdmin) throw new Error("Não pode editar Admin");
      return editUser
        ? (await api.patch(`/users/${editUser._id}`, payload)).data
        : (await api.post("/users", payload)).data;
    },
    onSuccess: () => {
      toast.success("Salvo!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenForm(false);
      setEditUser(null);
      setForm({ name: "", email: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  // -------------------------------
  // Delete Mutation
  // -------------------------------
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      toast.success("Excluído!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Limpa o estado após a exclusão bem-sucedida
      setOpenConfirm(false);
      setUserToDelete(null);
    },
    onError: () => toast.error("Não foi possível excluir."),
  });

  // -------------------------------
  // Handlers
  // -------------------------------
  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "" });
    setValidationErrors([]);
    setOpenForm(true);
  };

  const openEdit = (user: User) => {
    if (user.isAdmin) {
      toast.error("Não pode editar Admin");
      return;
    }
    setEditUser(user);
    setForm({ name: user.name, email: user.email });
    setValidationErrors([]);
    setOpenForm(true);
  };

  const handleSubmit = () => {
    const res = userSchema.safeParse(form);
    if (!res.success) return setValidationErrors(res.error.issues);
    saveMutation.mutate(res.data);
  };

  const handleOpenConfirmDelete = (user: User) => {
    if (user.isAdmin) {
      toast.error("Não pode excluir Admin");
      return;
    }
    setUserToDelete(user);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete?.isAdmin && userToDelete?._id)
      deleteMutation.mutate(userToDelete._id);
  };

  const isDeleting = deleteMutation.isPending && userToDelete?._id;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={openCreate} className="btn">
          + Novo
        </Button>
      </div>

      <DataTable<User>
        items={Array.isArray(data) ? data : []}
        columns={[
          { header: "Nome", accessor: "name" },
          { header: "Email", accessor: "email" },
        ]}
        onEdit={openEdit}
        onDelete={handleOpenConfirmDelete}
        disableEdit={(u) => u.isAdmin === true}
        disableDelete={(u) => u.isAdmin === true}
        loading={isLoading}
        loadingDeleteItemId={isDeleting ? userToDelete!._id : null}
      />

      <EntityFormModal
        open={openForm}
        onOpenChange={setOpenForm}
        title={editUser ? "Editar Usuário" : "Criar Usuário"}
        fields={[
          { name: "name", label: "Nome", disabled: editUser?.isAdmin },
          { name: "email", label: "Email", disabled: editUser?.isAdmin },
        ]}
        values={form}
        onChange={(f, v) => setForm((prev) => ({ ...prev, [f]: v }))}
        onSubmit={handleSubmit}
        validationErrors={validationErrors}
        loading={saveMutation.isPending}
      />

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Exclusão do usuário"
        message={
          userToDelete?.isAdmin
            ? "Admin não pode ser excluído."
            : `Deseja excluir ${userToDelete?.name}?`
        }
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
