const definitions = require('./configItems');

/**
 * Gets default config values
 * @returns {object} configMap
 */
module.exports = function getDefaultConfig() {
  const defaultMap = {};

  definitions.forEach(definition => {
    defaultMap[definition.key] = definition.default;
  });

  return defaultMap;
};
