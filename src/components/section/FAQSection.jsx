"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is your return policy?",
      answer:
        "You can return any item within 30 days of receiving your order. Just make sure it is unused, and in its original packaging.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order has shipped, you will receive an email with tracking information. You can track your order on the carrier's website using the tracking number.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes! We offer international shipping to most countries. You can select your country during checkout to see shipping options.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us via email at support@example.com or call our customer support line at (123) 456-7890. Our team is available 24/7.",
    },
    {
      question: "Can I modify my order after placing it?",
      answer:
        "Unfortunately, once an order has been placed, it cannot be modified. However, you can cancel the order and place a new one.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto p-8 bg-background rounded-3xl shadow-xl transition-colors">
      <h1 className="text-4xl font-extrabold text-foreground mb-10 text-center tracking-tight">
        Frequently Asked Questions
      </h1>

      <Accordion
        type="single"
        collapsible
        value={openIndex}
        onValueChange={setOpenIndex}
        className="space-y-4"
      >
        {faqData.map(({ question, answer }, index) => (
          <AccordionItem key={index} value={String(index)}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
