import { NOT_APPLICABLE } from '@/constant';
import { Care, Discipleship } from '@prisma/client';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getFriendById, getPersonHaveDiscipleship } from '@/lib/api';

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const friend = await getFriendById(params.id);
  const discipleshipList = await getPersonHaveDiscipleship(params.id);

  if (!friend) {
    notFound();
  }

  return (
    <div className="mt-5 flex w-full flex-col md:flex-row">
      <div className="w-full lg:w-1/3">
        <div className="w-full rounded-md p-5  shadow-2xl">
          <div className="flex flex-col items-center justify-center p-4">
            <Avatar>
              <AvatarImage src={friend.image || ''} alt="Avatar" />
              <AvatarFallback>{friend.firstName?.[0] || 'A'}</AvatarFallback>
            </Avatar>

            <div className="py-2 font-bold">{friend.name}</div>

            <div>{friend.type}</div>
          </div>

          <Separator />

          <div>
            <div className="pt-2">
              <span className="font-bold">Introduced By:</span> {friend.friend?.name || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Gender:</span> {friend.gender || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Phone:</span> {friend.phone || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Email:</span> {friend.email || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Birthday:</span>{' '}
              {friend.birthday ? format(new Date(friend.birthday), 'dd/MM/yyyy') : NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Address:</span> {friend.address || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Hometown:</span> {friend.hometown || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Description:</span> {friend.description || NOT_APPLICABLE}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button>Edit</Button>
          </div>
        </div>
      </div>

      <div className="max-h-screen flex-1 overflow-scroll px-5">
        <Tabs defaultValue="discipleship" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="discipleship">Care</TabsTrigger>
            <TabsTrigger value="friend">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="discipleship">
            <DiscipleTimeline discipleshipList={discipleshipList} />
          </TabsContent>
          <TabsContent value="friend">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const DiscipleTimeline = ({ discipleshipList }: { discipleshipList: Discipleship[] }) => {
  return (
    <div className="flex w-full flex-col">
      <div className="w-full p-5">Discipleship Timeline</div>

      {discipleshipList.map((discipleship) => (
        <ol className="relative border-s border-gray-200 dark:border-gray-700" key={discipleship.id}>
          <Timeline key={discipleship.id} record={discipleship} />
        </ol>
      ))}
    </div>
  );
};

const Timeline = ({ record }: { record: Care }) => {
  return (
    <li className="mb-4 ms-6">
      <div className="absolute -start-2 mt-0 h-4 w-4 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700" />

      <div className="mb-1 flex items-center gap-5 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 md:gap-10">
        {record.date ? format(new Date(record.date), 'dd/MM/yyyy') : NOT_APPLICABLE}
        <div>by {record?.curatorName || NOT_APPLICABLE}</div>
      </div>

      <p className="text-md font-semibold text-gray-900 dark:text-white">{record?.personName || NOT_APPLICABLE}</p>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">{record.description || NOT_APPLICABLE}</p>
    </li>
  );
};
