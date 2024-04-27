import UserAuthForm from '@/app/(auth)/login/user-form';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const isAuthenticated = await getKindeServerSession()?.isAuthenticated();

  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="mx-auto mt-12 flex w-full flex-col justify-center space-y-6 p-8 sm:w-[350px] md:mt-16 lg:mt-24">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to lrp! 👋🏻</h1>
        <p className="text-sm text-muted-foreground">Please sign-in to your account and start the adventure</p>
      </div>
      <UserAuthForm />
      <p className="px-4 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link href="/terms-of-service" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
