import { Head, useForm } from "@inertiajs/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "admin":
                return "default";
            case "supervisor":
                return "secondary";
            case "shipper":
                return "outline";
            case "entry_agent":
                return "outline";
            default:
                return "outline";
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-900";
            case "supervisor":
                return "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-900";
            case "shipper":
                return "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-900";
            case "entry_agent":
                return "bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-900";
            default:
                return "";
        }
    };

    const columns = [
        {
            header: 'Code',
            accessorKey: 'code',
            sortable: true,
        },
        {
            header: 'Nom',
            accessorKey: 'name',
            sortable: true,
        },
        {
            header: 'Email',
            accessorKey: 'email',
            sortable: true,
        },
        {
            header: 'Téléphone',
            accessorKey: 'phone',
        },
        {
            header: 'Zone',
            accessorKey: 'zone',
            cell: (user: User) => user.zone || '-',
        },
        {
            header: 'Rôle',
            accessorKey: 'role',
            sortable: true,
            cell: (user: User) => {
                const label =
                    roles.find((r) => r.value === user.role)?.label ||
                    user.role;

                return (
                    <Badge
                        variant="outline"
                        className={getRoleBadgeClass(user.role)}
                    >
                        {label}
                    </Badge>
                );
            },
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (user: User) => (
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsModalOpen(true);
                                }}
                            >
                                <Edit2 className="h-4 w-4 text-blue-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Modifier</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsConfirmOpen(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Supprimer</TooltipContent>
                    </Tooltip>
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
