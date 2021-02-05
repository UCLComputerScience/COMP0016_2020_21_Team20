module.exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({ name: '@babel/plugin-proposal-class-properties' });
  actions.setBabelPlugin({ name: '@babel/plugin-transform-classes' });
};
