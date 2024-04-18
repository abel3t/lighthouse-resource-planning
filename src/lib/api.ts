import { SearchParams } from '@/types';

import prisma from './prisma';

export const getMembers = async (searchParams: SearchParams) => {
  const { page, sort = '', name: search } = searchParams;

  let [sortField, sortOrder] = (sort as string)?.split('.');

  if (sortField && !['name'].includes(sortField)) {
    sortField = 'name';
  }

  const members = await prisma.person.findMany({
    where: {
      type: 'Member',
      name: {
        contains: search
      }
    },
    orderBy: {
      [sortField]: sortOrder
    }
  });

  return {
    data: members,
    pageCount: 1
  };
};

export async function createFundRecord(data: any) {
  if (!data || data.fundId) {
    console.log('Invalid data');
    return;
  }
  console.log('data', data);

  const a = await prisma.fund.update({
    where: {
      id: data.fundId
    },
    data: {
      amount: { increment: data.amount }
    }
  });
  console.log(a);

  // await prisma.$transaction([
  //   prisma.fundRecord.create({
  //     data
  //   }),
  //   prisma.fund.update({
  //     where: {
  //       id: data.fundId
  //     },
  //     data: {
  //       amount: { increment: data.amount }
  //     }
  //   })
  // ]);
}

export async function getFunds() {
  const records = await prisma.fund.findMany({});

  return records;
}

export async function getFundRecords() {
  const records = await prisma.fundRecord.findMany({
    include: {
      contributor: true
    }
  });

  return {
    data: records,
    pageCount: 1
  };
}
