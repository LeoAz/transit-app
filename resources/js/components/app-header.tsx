import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, Database, FileBarChart, Folder, LayoutGrid, Menu, Users } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import * as folders from '@/routes/folders/index';
import reports from '@/routes/reports';
import { index as usersIndex } from '@/routes/users/index';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

interface NotificationItem {
    id: string | number;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Dossiers',
        href: folders.index.url(),
        icon: Folder,
    },
    {
        title: 'Référentiel',
        href: '/referential/customers',
        icon: Database,
    },
    {
        title: 'Rapports',
        href: reports.index.url(),
        icon: FileBarChart,
    },
    {
        title: 'Utilisateurs',
        href: usersIndex.url(),
        icon: Users,
    },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props as any;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    // Récupération dynamique des notifications depuis props.auth.user.notifications
    const userNotifications: NotificationItem[] =
        auth?.user?.notifications || [];
    const unreadCount = userNotifications.filter((n) => !n.read).length;

    // Action pour tout marquer comme lu
    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(
            '/notifications/mark-all-read',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Toutes les notifications ont été marquées comme lues.');
                },
            }
        );
    };

    // Action au clic sur une notification individuelle
    const handleNotificationClick = (notificationId: string | number) => {
        router.post(
            `/notifications/${notificationId}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Navigation Mobile */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex flex-col space-y-4 text-sm">
                                        {mainNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className="flex items-center space-x-2 font-medium"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-5 w-5" />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Navigation Desktop */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                whenCurrentUrl(
                                                    item.href,
                                                    activeItemStyles,
                                                ),
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Actions de droite : Notifications & Menu Profil */}
                    <div className="ml-auto flex items-center space-x-3">
                        {/* Menu Déroulant des Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative size-9 rounded-full"
                                >
                                    <Bell className="size-5 opacity-80" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 flex size-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-80 p-0"
                            >
                                <div className="flex items-center justify-between p-3 border-b">
                                    <div className="flex items-center gap-2">
                                        <DropdownMenuLabel className="p-0 text-sm font-semibold">
                                            Notifications
                                        </DropdownMenuLabel>
                                        {unreadCount > 0 && (
                                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </div>

                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleMarkAllAsRead}
                                            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                                        >
                                            <CheckCheck className="size-3.5" />
                                            Tout marquer comme lu
                                        </Button>
                                    )}
                                </div>

                                <div className="max-h-80 overflow-y-auto divide-y">
                                    {userNotifications.length > 0 ? (
                                        userNotifications.map((n) => (
                                            <DropdownMenuItem
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n.id)}
                                                className={cn(
                                                    'flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-accent transition-colors',
                                                    !n.read
                                                        ? 'bg-primary/5 hover:bg-primary/10' // Mise en évidence si non lue
                                                        : 'opacity-75'
                                                )}
                                            >
                                                <div className="flex w-full items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        {/* Puce visuelle bleue pour les non lues */}
                                                        {!n.read && (
                                                            <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                                                        )}
                                                        <span
                                                            className={cn(
                                                                'text-xs truncate',
                                                                !n.read
                                                                    ? 'font-bold text-foreground'
                                                                    : 'font-medium text-muted-foreground'
                                                            )}
                                                        >
                                                            {n.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                                                        {n.time}
                                                    </span>
                                                </div>
                                                <p
                                                    className={cn(
                                                        'text-xs line-clamp-2 pl-3.5',
                                                        !n.read
                                                            ? 'text-foreground/90 font-normal'
                                                            : 'text-muted-foreground'
                                                    )}
                                                >
                                                    {n.description}
                                                </p>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-muted-foreground">
                                            Aucune notification pour le moment.
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Menu Utilisateur */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user?.avatar}
                                            alt={auth.user?.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user?.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
