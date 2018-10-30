const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

console.log('本地启动或构建的文件信息 | ------------------------------开始--------------------------------');

console.log('本地启动或构建的文件信息 | ------------------------------结束--------------------------------');


// const baseUrl = process.env.NODE_ENV === 'production' ? '/multi-page-Vue/dist/' : '/';

module.exports = {
  // 项目在服务器的根目录
  baseUrl: '/onedex/',
  // 打包目录
  // outputDir: 'dist',
  // 打包后静态资源存放目录，默认为"static"
  // assetsDir: 'static',
  // lintOnSave: true,
  // runtimeCompiler: true,
  // productionSourceMap: false,
  // parallel: undefined,
  // css: {
  //   extract: true,
  //   sourceMap: false,
  // },

  // configureWebpack: (config) => {
  //   vuxLoader.merge(config, {
  //     plugins: [
  //       'vux-ui',
  //       {
  //         name: 'duplicate-style',
  //         options: {
  //           cssProcessorOptions: {
  //             safe: true,
  //             zindex: false,
  //             autoprefixer: {
  //               add: true,
  //               browsers: [
  //                 'iOS >= 7',
  //                 'Android >= 4.1',
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       {
  //         name: 'less-theme',
  //         path: 'src/common/styles/theme.less', // 相对项目根目录路径
  //       },
  //     ],
  //   });
  //   if (process.env.NODE_ENV === 'production') {
  //     // 为生产环境修改配置...
  //   } else {
  //     // 为开发环境修改配置...
  //   }
  // },

  // chainWebpack: (config) => {
  //   config.resolve.alias
  //     .set('@', resolve('src'))
  //     .set('_assets', resolve('src/assets'));
  // },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://newdex.340wan.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },

  lintOnSave: undefined
};
