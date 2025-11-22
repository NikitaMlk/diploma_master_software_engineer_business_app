"use client";

import { CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ComparisonTableSection() {
  const features = [
    { feature: "Affordable Pricing", ours: true, others: false },
    { feature: "Easy Integration", ours: true, others: true },
    { feature: "24/7 Support", ours: true, others: false },
    { feature: "Customizable", ours: true, others: true },
    { feature: "Advanced Security", ours: true, others: false },
  ];

  return (
    <section className="bg-background py-14 px-8 rounded-3xl shadow-lg max-w-5xl mx-auto transition-colors">
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center tracking-tight">
        Why Choose Us?
      </h2>
      <p className="mt-2 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto">
        Compare our product with the competition.
      </p>

      <div className="mt-10 overflow-x-auto rounded-lg border border-muted">
        <Table className="w-full">
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="text-left text-lg font-semibold">Features</TableHead>
              <TableHead className="text-center text-lg font-semibold">Our Product</TableHead>
              <TableHead className="text-center text-lg font-semibold">Others</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map(({ feature, ours, others }, idx) => (
              <TableRow
                key={feature}
                className={idx % 2 === 0 ? "bg-muted/20" : ""}
              >
                <TableCell className="font-medium text-foreground">{feature}</TableCell>
                <TableCell className="text-center">
                  {ours ? (
                    <CheckCircle className="text-primary mx-auto" size={24} />
                  ) : (
                    <XCircle className="text-destructive mx-auto" size={24} />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {others ? (
                    <CheckCircle className="text-primary mx-auto" size={24} />
                  ) : (
                    <XCircle className="text-destructive mx-auto" size={24} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
