import React from 'react';

export default function PageLayout({
    title,
    actions,
    children
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {actions && (
                    <div className="flex items-center gap-4">
                        {actions}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
