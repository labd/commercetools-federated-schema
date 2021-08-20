var copy = require('rollup-plugin-copy')

module.exports = {
  rollup(config, options) {
    return {...config, plugins: [...config.plugins, copy({targets: [{src: 'src/schema.graphql', dest: 'dist/'}]})]}
  },
};