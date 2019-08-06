const router = require('express').Router();
const connections = require('../models/connections');
const Cache = require('../models/Cache.js');
const driver = require('../drivers');
const mustBeAuthenticated = require('../middleware/must-be-authenticated.js');
const sendError = require('../lib/sendError');

router.get(
  '/api/schema-info/:connectionId',
  mustBeAuthenticated,
  async function(req, res) {
    const reload = req.query.reload === 'true';
    const cacheKey = 'schemaCache:' + req.params.connectionId;
    try {
      let [conn, cache] = await Promise.all([
        connections.findOneById(req.params.connectionId),
        // This has problems in TravisCI for some reason...
        Cache.findOneByCacheKey(cacheKey)
      ]);

      if (!conn) {
        throw new Error('Connection not found');
      }

      if (cache && !reload) {
        const schemaInfo =
          typeof cache.schema === 'string'
            ? JSON.parse(cache.schema)
            : cache.schema;

        return res.json({ schemaInfo });
      }

      if (!cache) {
        cache = new Cache({ cacheKey });
      }

      const schemaInfo = await driver.getSchema(conn);
      if (Object.keys(schemaInfo).length) {
        // Schema needs to be stringified as JSON
        // Column names could have dots in name (incompatible with nedb)
        cache.schema = JSON.stringify(schemaInfo);
        await cache.save();
      }
      return res.json({ schemaInfo });
    } catch (error) {
      if (error.message === 'Connection not found') {
        return sendError(res, error);
      }
      sendError(res, error, 'Problem getting schema info');
    }
  }
);

module.exports = router;
