import Database from './';

const db = new Database('test', {}, true);

test('Method get', async () => {
  const consult = db.select();
  const { data } = await consult;
  expect(data).toBe('SELECT * FROM test');
});

// test('Method get by id', async () => {
//   const consult = db.select('*', {where:{selector:'id', value:1}});
//   const { data } = await consult;
//   expect(data).toBe('SELECT * FROM test WHERE id=1');
// });
