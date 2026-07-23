'use strict';

const { v4: uuidv4 } = require('uuid');

// Fixed UUIDs so the tasks seeder can reference these deterministically
const CATEGORY_IDS = {
  work: '11111111-1111-1111-1111-111111111111',
  personal: '22222222-2222-2222-2222-222222222222',
  shopping: '33333333-3333-3333-3333-333333333333',
};

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    await queryInterface.bulkInsert('categories', [
      {
        id: CATEGORY_IDS.work,
        name: 'Work',
        created_at: now,
        updated_at: now,
      },
      {
        id: CATEGORY_IDS.personal,
        name: 'Personal',
        created_at: now,
        updated_at: now,
      },
      {
        id: CATEGORY_IDS.shopping,
        name: 'Shopping',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', {
      id: Object.values(CATEGORY_IDS),
    });
  },
};

module.exports.CATEGORY_IDS = CATEGORY_IDS;