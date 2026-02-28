import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-dark-700 last:border-0">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white">{question}</span>
                {isOpen ? <Minus className="text-gold-500" /> : <Plus className="text-gold-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 \${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                <p className="text-gray-400 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "When are your service times?",
            answer: "We have Sunday Worship Service at 4:00 AM (local time) / 10:00 AM. We also have Wednesday Bible Study at 11:00 PM (local time) / 5:00 PM."
        },
        {
            question: "Do you have children's ministry?",
            answer: "Yes! GraceKids runs simultaneously with our main Sunday service, providing age-appropriate biblical teaching and fun activities."
        },
        {
            question: "How can I join a cell group?",
            answer: "You can sign up for a cell group at the Info Desk after service or contact us via the form below. We have groups meeting in various locations across Hawassa."
        },
        {
            question: "Is there parking available?",
            answer: "Yes, we have ample parking space within the church compound for all attendees."
        }
    ];

    return (
        <section className="py-20 bg-dark-800">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400">Common questions about GraceLight Church.</p>
                </div>
                <div className="bg-dark-900 rounded-2xl p-8 border border-dark-700 shadow-xl">
                    {faqs.map((faq, idx) => (
                        <FAQItem key={idx} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
