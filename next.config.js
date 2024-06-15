const path = require('path');

module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                net: false,
                tls: false,
                'pg-query-stream': false,
                'pg': false,
                'pg-hstore': false,
                'sqlite3': false,
                'tedious': false,
                'pg-native': false,
                'oracledb': false,
            };
        }

        config.resolve.alias = {
            ...config.resolve.alias,
            'pg-query-stream': false,
            'pg': false,
            'pg-hstore': false,
            'sqlite3': false,
            'tedious': false,
            'pg-native': false,
            'oracledb': false,
        };

        return config;
    },
};
