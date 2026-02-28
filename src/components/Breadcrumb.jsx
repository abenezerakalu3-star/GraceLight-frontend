import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
    if (!items?.length) return null;
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
            {items.map((item, i) => (
                <React.Fragment key={i}>
                    <ChevronRight size={16} className="shrink-0 text-gray-600" />
                    {i === items.length - 1 ? (
                        <span className="text-gold-500 font-medium">{item.label}</span>
                    ) : item.path ? (
                        <Link to={item.path} className="hover:text-gold-500 transition-colors">{item.label}</Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
