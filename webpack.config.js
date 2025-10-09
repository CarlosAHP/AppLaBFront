const path = require('path');

module.exports = {
  // Suprimir advertencias de deprecación
  ignoreWarnings: [
    /DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE/,
    /DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE/,
  ],
  
  // Configuración del servidor de desarrollo
  devServer: {
    // Suprimir advertencias de deprecación
    onAfterSetupMiddleware: undefined,
    onBeforeSetupMiddleware: undefined,
    setupMiddlewares: (middlewares, devServer) => {
      // Configuración personalizada si es necesaria
      return middlewares;
    },
  },
};
