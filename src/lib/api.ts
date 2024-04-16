import { SearchParams } from "@/types";
import prisma from "./prisma";

export const getMembers = async (searchParams: SearchParams) => {
  const { page, sort = '', name: search } = searchParams;

  let [sortField, sortOrder] = (sort as string)?.split(".");

  if (sortField && !['name'].includes(sortField)) {
    sortField = 'name';
  }

  const members = await prisma.person.findMany({
    where: {
      type: 'Member',
      name: {
        contains: search
      },
    },
    orderBy: {
      [sortField]: sortOrder
    }
  });

  return {
    data: members,
    pageCount: 1
  }
}

export async function createFundRecord(data: any) {
  console.log('datane', data)

  if (!data) {
    return
  }

 console.log('datane2', data)
  const test = await prisma.fundRecord.create({
    data
  })

  console.log('trstest', test)
}

export async function getFundRecords() {
  const records = await prisma.fundRecord.findMany({
    include: {
      contributor: true
    },
  });

  return {
    data: records,
    pageCount: 1
  }
}