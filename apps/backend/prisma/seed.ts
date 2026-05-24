import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const workTypes = [
  'Кладка перегородок',
  'Монтаж опалубки',
  'Заливка бетона',
  'Армирование',
  'Гидроизоляция',
  'Монтаж кровли',
  'Штукатурные работы',
  'Монтаж инженерных систем',
  'Земляные работы',
  'Отделочные работы',
];

async function main() {
  for (const name of workTypes) {
    await prisma.workType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Seeded work types');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
