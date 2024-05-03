import { NOT_APPLICABLE } from '@/constant';
import { Care } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

import { getCareDetailById } from '@/lib/api';

export default async function DiscipleDetailPage({ params }: { params: { id: string } }) {
  const care = await getCareDetailById(params.id);

  if (!care) {
    notFound();
  }

  return (
    <div className="mt-5 flex w-full flex-col md:flex-row">
      <div className="w-full lg:w-1/3">
        <div className="w-full rounded-md p-5  shadow-2xl">
          <div>
            <div className="pt-2">
              <span className="font-bold">Member:</span> {care.personName || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Discipleship Type:</span> {care.type || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Priority:</span> {care.priority || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Ngày:</span>{' '}
              {care.date ? format(new Date(care.date), 'dd/MM/yyyy') : NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Curator:</span> {care.curatorName || NOT_APPLICABLE}
            </div>
            <div className="pt-2">
              <span className="font-bold">Description:</span> {care.description || NOT_APPLICABLE}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button>Edit</Button>
          </div>
        </div>
      </div>

      <div className="max-h-screen flex-1 overflow-scroll px-5">
        <AspectRatio ratio={16 / 9}>
          <Image className="object-contain" fill src={care.image || ''} alt="Image"></Image>
        </AspectRatio>
      </div>
    </div>
  );
}
