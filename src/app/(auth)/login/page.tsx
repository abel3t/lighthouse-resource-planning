'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ')
});

export default function LoginPage() {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen animate-pulse items-center justify-center">
        <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    router.push('/');
  }

  return (
    <>
      {!isAuthenticated && (
        <div className="mx-auto mt-12 flex w-full flex-col justify-center space-y-6 p-8 sm:w-[350px] md:mt-16 lg:mt-24">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome to lrp! 👋🏻</h1>
            <p className="text-sm text-muted-foreground">Please sign-in to your account and start the adventure</p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);

  const ref = useRef<any>(null);

  const emailPasswordlessConnectionId = process.env.NEXT_PUBLIC_KINDE_CONNECTION_EMAIL_PASSWORD_LESS || '';
  const googleConnectionId = process.env.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE || '';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (ref?.current && values.email) {
      setIsLoading(true);
      ref.current.children?.[0]?.click();
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div ref={ref}>
            <LoginLink
              className="flex items-center"
              authUrlParams={{
                connection_id: emailPasswordlessConnectionId,
                login_hint: form.getValues('email')
              }}
            >
              <Button className="mt-3 w-full" disabled={isLoadingGoogle || isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In with Email
              </Button>
            </LoginLink>
          </div>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <LoginLink
        className="flex items-center"
        authUrlParams={{
          connection_id: googleConnectionId
        }}
        onClick={() => setIsLoadingGoogle(true)}
      >
        <Button className="w-full" variant="outline" type="button" disabled={isLoadingGoogle || isLoading}>
          {isLoadingGoogle ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Image src="/images/google-icon.png" className="mr-2" alt="google" width={20} height={20} />
          )}
          Sign In with Google
        </Button>
      </LoginLink>
    </div>
  );
}
