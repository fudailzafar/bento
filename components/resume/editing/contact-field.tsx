import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

interface ContactFieldProps {
  cta: string;
  onChange: (newCta: string) => void;
}

export function ContactField({ cta, onChange }: ContactFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor="contact-cta"
        className="text-sm font-medium text-gray-700"
      >
        Contact CTA
      </Label>
      <Input
        id="contact-cta"
        type="text"
        value={cta}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a call-to-action or contact info..."
      />
    </div>
  );
}
