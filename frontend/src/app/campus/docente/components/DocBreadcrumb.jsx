'use client';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/**
 * Breadcrumb shadcn/ui para el panel docente.
 * Items: [{ label, href? }]
 * El último item sin href se renderiza como página activa.
 */
export function DocBreadcrumb({ items = [] }) {
    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList>
                {/* Inicio siempre primero */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link
                            href="/campus/docente/dashboard"
                            className="flex items-center gap-1.5"
                        >
                            <Home size={13} />
                            <span className="hidden sm:inline">Inicio</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <BreadcrumbItem key={i}>
                            <BreadcrumbSeparator />
                            {!isLast && item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage className="font-semibold">
                                    {item.label}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
