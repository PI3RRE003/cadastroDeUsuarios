import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const User = {
  create: (data) => prisma.user.create({ data }),
  findAll: (filters) => prisma.user.findMany({ where: filters }),
  update: (id, data) => prisma.user.update({ where: { id }, data }),
  delete: (id) => prisma.user.delete({ where: { id } }),
  findById: (id) => prisma.user.findUnique({id})
}
