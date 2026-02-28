import React from 'react';

export const SkeletonLine = ({ className = '' }) => (
    <div className={`h-4 bg-dark-700 rounded animate-pulse ${className}`} />
);

export const SkeletonCard = () => (
    <div className="card animate-pulse">
        <div className="h-48 bg-dark-700 rounded-lg mb-4" />
        <SkeletonLine className="w-3/4 mb-2" />
        <SkeletonLine className="w-1/2 mb-4" />
        <div className="flex gap-2">
            <div className="h-8 w-20 bg-dark-700 rounded" />
            <div className="h-8 w-16 bg-dark-700 rounded" />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
    <div className="bg-dark-800 rounded-lg overflow-hidden border border-gold-500/10 animate-pulse">
        <div className="h-12 bg-dark-700" />
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-14 border-t border-dark-700 flex gap-4 px-4 items-center">
                <div className="h-4 w-1/4 bg-dark-600 rounded" />
                <div className="h-4 w-1/3 bg-dark-600 rounded" />
                <div className="h-4 w-20 bg-dark-600 rounded" />
            </div>
        ))}
    </div>
);

export const SkeletonPage = () => (
    <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="h-10 w-64 bg-dark-700 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    </div>
);

export default { SkeletonLine, SkeletonCard, SkeletonTable, SkeletonPage };
