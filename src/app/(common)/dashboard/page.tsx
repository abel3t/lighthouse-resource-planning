import { CareTypeColor, CareTypeText, NOT_APPLICABLE } from '@/constant';
import { CarePriority, CareType, PersonalType } from '@/enums';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Account, Care } from '@prisma/client';
import { formatRelative, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { User2Icon } from 'lucide-react';

import { Timeline, TimelineItem } from '@/components/custom/timeline';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';

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

  const twoMonthsAgo = subMonths(new Date(), 2);
  const [cares, accounts] = await Promise.all([
    prisma.care.findMany({
      where: {
        organizationId: organization?.orgCode || '',
        priority: { in: [CarePriority.Warning, CarePriority.Normal] },
        date: { gte: twoMonthsAgo }
      },
      orderBy: [{ priority: 'desc' }, { date: 'desc' }]
    }),
    prisma.account.findMany({
      where: {
        organizationId: organization?.orgCode || ''
      }
    })
  ]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-3 text-xs md:mt-0 md:text-sm lg:grid-cols-2">
      <div className="rounded-md p-5 shadow-lg">
        <div className="flex flex-col">
          <div className="text-md font-bold md:text-lg">Over view</div>
        </div>

        <div className="flex justify-between py-3">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-sm bg-indigo-200 p-2 text-white">
              <User2Icon className="text-indigo-600" />
            </div>

            <div className="flex flex-col">
              <div className="font-bold">{totalMembers}</div>
              <div className="text-xs font-bold text-gray-500 md:text-sm">Members</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="rounded-sm bg-yellow-100 p-2 text-white">
              <User2Icon className="text-yellow-600" />
            </div>

            <div className="flex flex-col">
              <div className="font-bold">{totalFriends}</div>
              <div className="text-xs font-bold text-gray-500 md:text-sm">Friends</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="rounded-sm bg-cyan-100 p-2 text-white">
              <User2Icon className="text-cyan-600" />
            </div>

            <div className="flex flex-col">
              <div className="font-bold">{totalUnbelievers}</div>
              <div className="text-xs font-bold text-gray-500 md:text-sm">Unbelievers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden h-32 rounded-md shadow-lg md:block"></div>

      <ScrollArea className="h-96 rounded-md p-2 shadow-lg">
        <div className="text-md font-bold md:text-lg">Needing More Care</div>
        <NeedingMoreCares cares={cares} />
      </ScrollArea>

      <div className="h-96 rounded-md p-2 shadow-lg">
        <div className="text-md font-bold md:text-lg">Top Caring People</div>
        <TopCaringPeople accounts={accounts} />
      </div>
    </div>
  );
}

const formatRelativeLocale = {
  lastWeek: "EEEE 'tuần trước' '-' dd/MM/yyyy",
  yesterday: "'Hôm qua' '-' dd/MM/yyyy",
  today: "'Hôm nay'",
  tomorrow: "'Ngày mai'",
  nextWeek: "EEEE 'tới'",
  other: 'P'
};

const NeedingMoreCares = ({ cares }: { cares: Care[] }) => {
  return (
    <div className="ml-2 pt-4">
      <Timeline>
        {cares.map((care) => (
          <TimelineItem
            key={care.id}
            dotClassName={cn({
              'bg-red-500': care.priority === CarePriority.Warning,
              'bg-yellow-500': care.priority === CarePriority.Normal
            })}
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
              <span className="ml-5">
                {formatRelative(care.date, new Date(), {
                  locale: {
                    ...vi,
                    formatRelative: (token) => formatRelativeLocale[token]
                  }
                })}
              </span>
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
