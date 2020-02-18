const assert = require('assert');
const utils = require('../utils');

describe('api/connections', function() {
  let connection;

  before(function() {
    return utils.resetWithUser();
  });

  it('Returns empty array', async function() {
    const body = await utils.get('admin', '/api/connections');
    assert(!body.error, 'Expect no error');
    assert(Array.isArray(body.connections), 'connections is an array');
    assert.equal(body.connections.length, 0, '0 length');
  });

  it('Creates connection', async function() {
    const body = await utils.post('admin', '/api/connections', {
      driver: 'postgres',
      name: 'test connection',
      host: 'localhost',
      database: 'testdb',
      username: 'username',
      password: 'password'
    });

    assert(!body.error, 'no error');
    assert(body.connection._id, 'has _id');
    assert.equal(body.connection.driver, 'postgres');
    assert.equal(body.connection.username, 'username');
    connection = body.connection;
  });

  it('Gets array of 1', async function() {
    const body = await utils.get('admin', '/api/connections');
    assert.equal(body.connections.length, 1, '0 length');
  });

  it('Updates connection', async function() {
    const body = await utils.put(
      'admin',
      `/api/connections/${connection._id}`,
      {
        driver: 'postgres',
        name: 'test connection update',
        host: 'localhost',
        database: 'testdb',
        username: 'username',
        password: 'password'
      }
    );

    assert(!body.error, 'no error');
    assert(body.connection._id, 'has _id');
    assert.equal(body.connection.name, 'test connection update');
    assert.equal(body.connection.driver, 'postgres');
    assert.equal(body.connection.username, 'username');
  });

  it('Gets updated connection', async function() {
    const body = await utils.get('admin', `/api/connections/${connection._id}`);

    assert(!body.error, 'no error');
    assert.equal(body.connection.name, 'test connection update');
  });

  it('Requires authentication', function() {
    return utils.get(null, `/api/connections/${connection._id}`, 302);
  });

  it('Create requires admin', function() {
    return utils.post(
      'editor',
      '/api/connections',
      {
        driver: 'postgres',
        name: 'test connection 2',
        host: 'localhost',
        database: 'testdb',
        username: 'username',
        password: 'password'
      },
      403
    );
  });

  it('Deletes connection', async function() {
    const body = await utils.del('admin', `/api/connections/${connection._id}`);
    assert(!body.error, 'no error');
  });

  it('Returns empty array', async function() {
    const body = await utils.get('admin', '/api/connections');
    assert(!body.error, 'Expect no error');
    assert(Array.isArray(body.connections), 'connections is an array');
    assert.equal(body.connections.length, 0, '0 length');
  });
});
