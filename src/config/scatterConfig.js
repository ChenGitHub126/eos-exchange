const envobj = {
    httpEndpoint: 'https://mainnet.meet.one',
    protocol: 'https',
    host: 'mainnet.meet.one',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};
const scatterConfig = {
    eosConfig: {
        httpEndpoint: envobj.httpEndpoint,
        chainId: envobj.chainId,
        verbose: false,
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