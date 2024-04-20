import { notFound } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCareById } from '@/lib/api';

export default async function CareDetailPage({ params }: { params: { id: string } }) {
  const care = await getCareById(params.id);

  if (!care) {
    notFound();
  }

  return (
    <div className="flex w-full">
      <div className="w-1/3 p-5">
        <div>Image</div>

        <div>Abel Tran</div>

        <div>Disciple process</div>

        <div>Introduced By</div>
        <Separator />
      </div>

      <div className="flex-1">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Discipleship Process</TabsTrigger>
            <TabsTrigger value="password">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Make changes to your account here.</TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
