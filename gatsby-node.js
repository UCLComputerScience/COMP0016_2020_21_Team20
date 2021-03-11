module.exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({ name: '@babel/plugin-proposal-class-properties' });
  actions.setBabelPlugin({ name: '@babel/plugin-transform-classes' });
};

/**
 * https://github.com/gatsbyjs/gatsby/issues/25297#issuecomment-651163951
 * This plugin: https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
 * is built into the default Gatsby Babel configuration (and actually, Next's preset too).
 * React Suite `Panel` components (and probably others) require PropTypes to be in production
 * too, so that breaks some of the component docs when building the docs site.
 * This disables transformation for node_modules so we don't get the PropTypes removed
 * when we don't want.
 *
 * Ideally we should disable the plugin (it also has an `ignore` option), but I couldn't
 * manage to override the babelrc for Docz/Gatsby successfully, so this works for now.
 */
module.exports.onCreateWebpackConfig = ({ getConfig, actions, stage }) => {
  const webpackConfig = getConfig();

  if (stage === 'build-javascript') {
    const dependencyRulesIndex = webpackConfig.module.rules.findIndex(rule => {
      return (
        rule.test &&
        rule.test.toString() === '/\\.(js|mjs)$/' &&
        typeof rule.exclude === 'function'
      );
    });

    webpackConfig.module.rules.splice(dependencyRulesIndex, 1);
  }

  actions.replaceWebpackConfig(webpackConfig);
};
