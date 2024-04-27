import { CareTypeColor, CareTypeText, NOT_APPLICABLE } from '@/constant';
import { CarePriority, CareType, PersonalType } from '@/enums';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Account, Care } from '@prisma/client';
import { User2Icon, UserIcon } from 'lucide-react';

import { Timeline, TimelineItem } from '@/components/custom/timeline';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import prisma from '@/lib/prisma';

export default async function MemberPage() {
  const organization = await getKindeServerSession()?.getOrganization();

  const [totalMembers, totalFriends, totalUnbelievers] = await Promise.all([
    prisma.person.count({
      where: {
        organizationId: organization?.orgCode || '',
        type: PersonalType.Member
      }
    }),
    prisma.person.count({
      where: {
        organizationId: organization?.orgCode || '',
        type: { in: [PersonalType.Friend, PersonalType.Unsure, PersonalType.NewLife, PersonalType.NextStep] }
      }
    }),
    prisma.person.count({
      where: {
        organizationId: organization?.orgCode || '',
        type: PersonalType.Unbeliever
      }
    })
  ]);

  const [cares, accounts] = await Promise.all([
    prisma.care.findMany({
      where: {
        organizationId: organization?.orgCode || '',
        priority: CarePriority.Warning
      }
    }),
    prisma.account.findMany({
      where: {
        organizationId: organization?.orgCode || ''
      }
    })
  ]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className=" rounded-md p-5 shadow-lg">
        <div className="flex flex-col">
          <div className="text-lg font-bold">Over view</div>
        </div>

        <div className="flex justify-between py-3">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-sm bg-indigo-200 p-2 text-white">
              <User2Icon className="text-indigo-600" />
            </div>

            <div className="flex flex-col">
              <div className="font-bold">{totalMembers}</div>
              <div className="text-sm font-bold text-gray-500">Members</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="rounded-sm bg-yellow-100 p-2 text-white">
              <User2Icon className="text-yellow-600" />
            </div>

            <div className="flex flex-col">
              <div className="font-bold">{totalFriends}</div>
              <div className="text-sm font-bold text-gray-500">Friends</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="rounded-sm bg-cyan-100 p-2 text-white">
              <User2Icon className="text-cyan-600" />
            </div>

            <div className="flex flex-col">
              <div className="font-bold">{totalUnbelievers}</div>
              <div className="text-sm font-bold text-gray-500">Unbelievers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32 rounded-md shadow-lg"></div>

      <ScrollArea className="h-96 rounded-md p-2 shadow-lg">
        <div className="text-lg font-bold">Needing More Care</div>
        <NeedingMoreCares cares={cares} />
      </ScrollArea>

      <div className="h-96 rounded-md p-2 shadow-lg">
        <div className="text-lg font-bold">Top Caring People</div>
        <TopCaringPeople accounts={accounts} />
      </div>
    </div>
  );
}

const NeedingMoreCares = ({ cares }: { cares: Care[] }) => {
  return (
    <div className="ml-2 pt-4">
      <Timeline>
        {cares.map((care) => (
          <TimelineItem
            key={care.id}
            header={
              <div className="flex items-center space-x-5">
                <div className="text-sm font-bold">{care.personName || NOT_APPLICABLE}</div>
                {care.type && (
                  <Badge style={{ backgroundColor: CareTypeColor[care.type as CareType] }}>
                    {CareTypeText[care.type as CareType]}
                  </Badge>
                )}
              </div>
            }
          >
            <div className="text-primary">
              by <span className="font-bold">{care.curatorName || NOT_APPLICABLE}</span>
            </div>
            <div className="mt-2">
              <pre>{care.description}</pre>
            </div>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

const TopCaringPeople = ({ accounts }: { accounts: Account[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Care</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account, index) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium">#{index + 1}</TableCell>
            <TableCell>{account.name}</TableCell>
            <TableCell>OK</TableCell>
            <TableCell className="text-right">{10}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
