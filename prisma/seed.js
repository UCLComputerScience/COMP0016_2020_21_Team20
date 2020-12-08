import prisma from '../lib/prisma.js';

const standards = [
  'Staff and Resources',
  'Staying Healthy',
  'Individual Care',
  'Timely Care',
  'Dignified Care',
  'Effective Care',
  'Safe Care',
];
const userTypes = [
  'Administrator',
  'Health Board',
  'Hospital',
  'Department',
  'Clinician',
];

const seedStandards = async () => {
  await Promise.all(
    standards.map(standard =>
      prisma.standards.create({ data: { name: standard } })
    )
  );
};

const seedUserTypes = async () => {
  await Promise.all(
    userTypes.map(type =>
      prisma.user_types.create({ data: { description: type } })
    )
  );
};

const seedEntities = async () => {
  await prisma.health_boards.create({
    data: {
      health_board_name: 'Demo Health Board',
      id: 1,
      hospitals: {
        create: {
          id: 1,
          hospital_name: 'Demo Hospital',
          departments: {
            create: { department_name: 'Demo Department' },
          },
        },
      },
    },
  });

  await prisma.users.create({
    data: {
      password: 'demo',
      user_type_id: 1,
      dept_clincian_user_type: {
        create: { departments: { connect: { id: 1 } } },
      },
    },
  });
};

const seedData = async () => {
  await seedStandards();
  await seedUserTypes();
  await seedEntities();
};

seedData()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
