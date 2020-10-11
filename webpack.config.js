const path = require('path')
var webpack = require('webpack')


process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.CVA_PORT = process.env.CVA_PORT || 8080

const config = function (mode) {
    let conf = {
        mode: mode,   
        entry: ['./src/services/service.js'], 
        output: {
            path: path.resolve('./public/bundle'),
            filename: 'bundle.js',
            publicPath: '/public/bundle/',
        },
        watch:false,
        module: {
            rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'html-loader',
                    options: {}
                }
            },     
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.(png|jpg|gif)$/,
              use: [
                {
                  loader: 'url-loader?limit=8192&name=i/i-[hash].[ext]'
                },
              ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: 'file-loader',
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
            },
            ]   
        },
        resolve: {
            extensions: ['.js', '.html', '.css'],
            modules: [
              'node_modules'
            ]   
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            }),

        ],
        devServer: {
            watchOptions: {
                ignored: /node_modules/
            },
            contentBase: 'public',
            compress: true,
            hot: true,
            port: process.env.CVA_PORT
        }
    }
    if (mode === 'development') {
        conf.plugins.push(new webpack.HotModuleReplacementPlugin())
        conf.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    }

    return conf
}

module.exports = config(process.env.NODE_ENV)