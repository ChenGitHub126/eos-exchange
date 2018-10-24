// const envobj = {
//     httpEndpoint: 'https://mainnet.meet.one',
//     protocol: 'https',
//     host: 'mainnet.meet.one',
//     port: 443,
//     chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
// };
const envobj = {
    httpEndpoint: 'https://api.kylin-testnet.eospace.io',
    protocol: 'https',
    host: 'api.kylin-testnet.eospace.io',
    port: 80,
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
};

const scatterConfig = {
    eosConfig: {
        keyProvider: '5JXUnLCE8b36hrLTSJUyhcJzbi3MwQb8XmCypJf3Hs3jyR8gscj',
        httpEndpoint: envobj.httpEndpoint,
        chainId: envobj.chainId,
        verbose: false,
        broadcast: true
    },
    network: {
        blockchain: 'eos',
        protocol: envobj.protocol,
        host: envobj.host,
        port: envobj.port,
        chainId: envobj.chainId,
    },
    eosOptions: {
        broadcast: true,
        sign: true,
        chainId: envobj.chainId,
    }
};

export default scatterConfig;
