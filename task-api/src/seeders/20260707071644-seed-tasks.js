'use strict';

const { v4: uuidv4 } = require('uuid');

const CATEGORY_IDS = {
  work: '11111111-1111-1111-1111-111111111111',
  personal: '22222222-2222-2222-2222-222222222222',
  shopping: '33333333-3333-3333-3333-333333333333',
};

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('tasks', [
      {
        id: uuidv4(),
        title: 'Finish quarterly report',
        description: 'Compile Q3 numbers and send to finance team',
        category_id: CATEGORY_IDS.work,
        status: 'open',
        due_date: daysFromNow(3),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Review pull requests',
        description: 'Clear the backlog of open PRs on the main repo',
        category_id: CATEGORY_IDS.work,
        status: 'open',
        due_date: daysFromNow(1),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Prepare team standup notes',
        description: null,
        category_id: CATEGORY_IDS.work,
        status: 'done',
        due_date: daysFromNow(-1),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Book dentist appointment',
        description: 'Six-month checkup, call before noon',
        category_id: CATEGORY_IDS.personal,
        status: 'open',
        due_date: daysFromNow(5),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Renew passport',
        description: 'Current one expires next month',
        category_id: CATEGORY_IDS.personal,
        status: 'open',
        due_date: daysFromNow(10),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Read chapter 5 of book club novel',
        description: null,
        category_id: CATEGORY_IDS.personal,
        status: 'done',
        due_date: daysFromNow(-3),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, coffee',
        category_id: CATEGORY_IDS.shopping,
        status: 'open',
        due_date: daysFromNow(0),
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        title: 'Order new running shoes',
        description: 'Old pair is worn out, check size chart first',
        category_id: CATEGORY_IDS.shopping,
        status: 'open',
        due_date: daysFromNow(7),
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tasks', null);
  },
};