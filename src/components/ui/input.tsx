import { useTranslations } from 'next-intl';
import * as React from 'react';
import RCurrencyInput from 'react-currency-input-field';
import RPhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, onChange, ...props }, ref) => {
  const t = useTranslations();

  return (
    <RCurrencyInput
      intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
      name="input-name"
      placeholder={t('please_enter_an_amount')}
      defaultValue={0 as any}
      decimalsLimit={0}
      step={1000 as any}
      onValueChange={(value) => {
        if (onChange) {
          onChange?.((parseFloat(value as any) as any) || 0);
        }
      }}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'CurrencyInput';

const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, value, onChange, ...props }, ref) => {
  const t = useTranslations();

  return (
    <RPhoneInput
      international={false}
      withCountryCallingCode={false}
      placeholder={t('phone')}
      className={cn(
        'flex h-10 w-full rounded-md  border-0 border-input bg-background px-3 py-2 text-sm ring-offset-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      inputComponent={Input}
      country="VN"
      defaultCountry="VN"
      value={value as any}
      onChange={onChange as any}
      {...props}
    />
  );
});
Input.displayName = 'PhoneInput';

export { Input, CurrencyInput, PhoneInput };
