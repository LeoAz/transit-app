import { Link } from '@inertiajs/react';
import { Anchor, Building2, Calendar, Package } from 'lucide-react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { NavItem, BreadcrumbItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Clients',
        href: '/referential/customers',
        icon: Building2,
    },
    {
        title: 'Produits',
        href: '/referential/products',
        icon: Package,
    },
    {
        title: 'Navires',
        href: '/referential/vessels',
        icon: Anchor,
    },
    {
        title: 'Jours fériés',
        href: '/referential/holidays',
        icon: Calendar,
    },
];

interface ReferentialLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function ReferentialLayout({ children, breadcrumbs = [] }: ReferentialLayoutProps) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 py-6">
                <Heading
                    title="Référentiel"
                    description="Gérez les données de base de votre application"
                />

                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-64">
                        <nav
                            className="flex flex-col space-y-1 space-x-0"
                            aria-label="Référentiel"
                        >
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="lg"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start uppercase', {
                                        'bg-muted font-medium': isCurrentOrParentUrl(item.href),
                                    })}
                                >
                                    <Link href={item.href}>
                                        {item.icon && (
                                            <item.icon className="mr-2 h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1">
                        <section className="space-y-6">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
