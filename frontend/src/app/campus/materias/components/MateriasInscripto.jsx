'use client';

import { useState } from 'react';
import { CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const INITIAL_SHOW = 4;

export function InscripcionAlert({ misInscripciones = [] }) {
    const [showAll, setShowAll] = useState(false);

    if (!misInscripciones || misInscripciones.length === 0) {
        return null;
    }

    const visible = showAll ? misInscripciones : misInscripciones.slice(0, INITIAL_SHOW);
    const hasMore = misInscripciones.length > INITIAL_SHOW;

    return (
        <div className="mb-10">
            <h2 className="text-lg font-bold text-primary dark:text-white mb-4 border-b pb-2 flex items-center gap-2">
                <Info size={20} className="text-primary " />
                Mis Cursadas Activas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visible.map((insc) => (
                    <Card key={insc.id} className="shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-primary dark:bg-gree-800 text-sm mb-1.5">
                                    {insc.clase?.materia?.nombre || 'Materia sin especificar'}
                                </h4>
                                <Badge className="bg-green-800 text-white dark:bg-green-800 border border-green-200 dark:border-green-800">
                                    {insc.estado.toUpperCase()}
                                </Badge>
                            </div>
                            <div className=" p-2 rounded-full">
                                <CheckCircle className="text-green-800" size={24} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {hasMore && (
                <div className="mt-4 text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                        className="text-muted-foreground hover:text-foreground gap-1"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp size={16} />
                                Mostrar menos
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} />
                                Ver todas ({misInscripciones.length})
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
