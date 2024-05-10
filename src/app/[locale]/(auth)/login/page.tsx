import UserAuthForm from '@/app/[locale]/(auth)/login/user-form';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const isAuthenticated = await getKindeServerSession()?.isAuthenticated();

  const t = await getTranslations({ locale });

  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="mx-auto mt-12 flex w-full flex-col justify-center space-y-6 p-8 sm:w-[400px] md:mt-16 lg:mt-24">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('welcome_title')}</h1>
        <p className="text-sm text-muted-foreground">{t('welcome_subtitle')}</p>
      </div>
      <UserAuthForm />
      <p className="px-4 text-center text-sm text-muted-foreground">{t('confirm_policy_text')}</p>
    </div>
  );
}
