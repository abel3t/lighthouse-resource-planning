import { PersonalType } from '@/enums';
import { SearchParams } from '@/types';
import axios from 'axios';

import prisma from './prisma';

export const getMembers = async (searchParams: SearchParams) => {
  const { page, sort = '', name: search } = searchParams;

  let [sortField, sortOrder] = (sort as string)?.split('.');

  if (sortField && !['name'].includes(sortField)) {
    sortField = 'name';
  }

  const $condition: Record<string, any> = {
    type: 'Member'
  };

  if (search) {
    $condition.name = {
      contains: search
    };
  }

  const members = await prisma.person.findMany({
    where: $condition,
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

export const deleteImageUploadThing = async (url: string) => {
  await axios.delete('api/uploadthing', {
    data: {
      url
    }
  });
};

export const getPersonById = async (id: string) => {
  return await prisma.person.findUnique({
    where: {
      id
    }
  });
};

export const getCareById = async (id: string) => {
  return await prisma.care.findUnique({
    where: {
      id
    }
  });
};

export const getFriendById = async (id: string) => {
  return await prisma.person.findUnique({
    where: {
      id,
      type: { not: PersonalType.Member }
    },
    include: { friend: true }
  });
};

export const getMemberById = async (id: string) => {
  return await prisma.person.findUnique({
    where: {
      id,
      type: PersonalType.Member
    },
    include: { friend: true }
  });
};

export const getFriendOfPerson = (personId: string) => {
  return prisma.person.findMany({
    where: {
      friendId: personId
    }
  });
};

export const getPersonHaveCares = (personId: string) => {
  return prisma.care.findMany({
    where: {
      personId
    }
  });
};

export const getPersonHaveDiscipleship = (personId: string) => {
  return prisma.discipleship.findMany({
    where: {
      personId
    },
    orderBy: {
      date: 'desc'
    }
  });
};
