import { DiscipleshipProcessColor, NOT_APPLICABLE } from '@/constant';
import { DiscipleshipProcess } from '@/enums';
import { Care, Discipleship } from '@prisma/client';
import { format } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getMemberById, getPersonHaveCares, getPersonHaveDiscipleship } from '@/lib/api';

export default async function MemberDetailPage({ params }: { params: { id: string; locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  const [member, discipleshipList, cares] = await Promise.all([
    getMemberById(params.id),
    getPersonHaveDiscipleship(params.id),
    getPersonHaveCares(params.id)
  ]);

  if (!member) {
    notFound();
  }

  return (
    <div className="mt-5 flex w-full flex-col md:flex-row">
      <div className="w-full lg:w-1/3">
        <div className="w-full rounded-md p-5  shadow-2xl">
          <div className="flex flex-col items-center justify-center p-4">
            <Avatar>
              <AvatarImage src={member.image || ''} alt="Avatar" />
              <AvatarFallback>{member.firstName?.[0] || 'A'}</AvatarFallback>
            </Avatar>

            <div className="py-2 font-bold">{member.name}</div>

            {member?.discipleshipProcess && (
              <Badge
                className="capitalize"
                style={{ backgroundColor: DiscipleshipProcessColor[member.discipleshipProcess as DiscipleshipProcess] }}
              >
                {t(member.discipleshipProcess.toLowerCase())}
              </Badge>
            )}
          </div>

          <Separator />

          <div>
            <div className="pt-2">
              <span className="font-bold">{t('introduced_by')}:</span> {member.friend?.name || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('gender')}:</span> {member.gender || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('phone')}:</span> {member.phone || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('email')}:</span> {member.email || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('date_of_birth')}:</span>{' '}
              {member.birthday ? format(new Date(member.birthday), 'dd/MM/yyyy') : NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('address')}:</span> {member.address || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('hometown')}:</span> {member.hometown || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">{t('description')}:</span> {member.description || NOT_APPLICABLE}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button>{t('edit')}</Button>
          </div>
        </div>
      </div>

      <div className="max-h-screen flex-1 overflow-scroll px-5">
        <Tabs defaultValue="care" className="w-[400px]">
          <TabsList>
            <TabsTrigger className="px-5" value="care">
              {t('cares')}
            </TabsTrigger>
            <TabsTrigger className="px-5" value="discipleship">
              {t('discipleship_process')}
            </TabsTrigger>
            <TabsTrigger className="px-5" value="friend">
              {t('relation_friends')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="care">
            <CaresTimeline cares={cares} t={t} />
          </TabsContent>
          <TabsContent value="discipleship">
            <DiscipleTimeline t={t} discipleshipList={discipleshipList} />
          </TabsContent>
          <TabsContent value="friend">Coming soon.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const CaresTimeline = ({ cares, t }: { cares: Care[]; t: Function }) => {
  return (
    <div className="flex w-full flex-col">
      <div className="w-full p-5">Care Timeline</div>

      {cares.map((care) => (
        <ol className="relative border-s border-gray-200 dark:border-gray-700" key={care.id}>
          <Timeline key={care.id} record={care} t={t} />
        </ol>
      ))}
    </div>
  );
};

const DiscipleTimeline = ({ discipleshipList, t }: { discipleshipList: Discipleship[]; t: Function }) => {
  return (
    <div className="flex w-full flex-col">
      <div className="w-full p-5">Discipleship Timeline</div>

      {discipleshipList.map((discipleship) => (
        <ol className="relative border-s border-gray-200 dark:border-gray-700" key={discipleship.id}>
          <Timeline t={t} key={discipleship.id} record={discipleship} />
        </ol>
      ))}
    </div>
  );
};

const Timeline = ({ record, t }: { record: Care; t: Function }) => {
  return (
    <li className="mb-4 ms-6">
      <div className="absolute -start-2 mt-0 h-4 w-4 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700" />

      <div className="mb-1 flex items-center gap-5 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 md:gap-10">
        {record.date ? format(new Date(record.date), 'dd/MM/yyyy') : NOT_APPLICABLE}
        <div>
          {t('care_by')} {record?.curatorName || NOT_APPLICABLE}
        </div>
      </div>

      <p className="text-md font-semibold text-gray-900 dark:text-white">{record?.personName || NOT_APPLICABLE}</p>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">{record.description || NOT_APPLICABLE}</p>
    </li>
  );
};
