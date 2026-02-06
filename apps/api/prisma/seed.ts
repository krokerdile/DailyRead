import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.group.upsert({
    where: { slug: "system" },
    update: {
      isSystem: true,
      name: "System Group"
    },
    create: {
      slug: "system",
      isSystem: true,
      name: "System Group"
    }
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
