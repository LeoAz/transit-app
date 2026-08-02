import { Head, useForm } from "@inertiajs/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";
import { destroy as destroyUser, index as usersIndex } from "@/routes/users";
import type { User } from "@/types";
import { UserFormModal } from "./user-form-modal";

interface UsersIndexProps {
    users: User[];
    roles: { value: string; label: string }[];
}

export default function UsersIndex({ users, roles }: UsersIndexProps) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | undefined>(
        undefined
    );

    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (selectedUser) {
            destroy(destroyUser.url(selectedUser.id), {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setSelectedUser(undefined);
                    toast.success("Utilisateur supprimé avec succès.");
                },
            });
        }
    };

    const columns = [
        {
            header: "Code",
            accessorKey: "code",
            sortable: true,
        },
        {
            header: "Nom",
            accessorKey: "name",
            sortable: true,
        },
        {
            header: "Email",
            accessorKey: "email",
            sortable: true,
        },
        {
            header: "Téléphone",
            accessorKey: "phone",
        },
        {
            header: "Zone",
            accessorKey: "zone",
            cell: (user: User) => user.zone || "-",
        },
        {
            header: "Rôle",
            accessorKey: "role",
            sortable: true,
            cell: (user: User) => {
                const label = roles.find((r) => r.value === user.role)?.label || user.role;
                return (
                    <Badge variant="outline">
                        {label}
                    </Badge>
                );
            },
        },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (user: User) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                        }}
                    >
                        <Edit2 className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        onClick={() => {
                            setSelectedUser(user);
                            setIsConfirmOpen(true);
                        }}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Utilisateurs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Utilisateurs
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Gérez les utilisateurs et leurs permissions.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedUser(undefined);
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter un utilisateur
                    </Button>
                </div>

                <DataTable
                    data={users}
                    columns={columns}
                    searchPlaceholder="Rechercher..."
                />
            </div>

            <UserFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                user={selectedUser}
                roles={roles}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Supprimer l'utilisateur"
                description={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser?.name} ? Cette action est irréversible.`}
                onConfirm={handleDelete}
                isLoading={processing}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: dashboard.url() },
        { title: "Utilisateurs", href: usersIndex.url() },
    ],
};
