import scatterConfig from './scatterConfig.js';

export default {
    scatterConfig
};

/*
#define
Def_EosExchangePublicAccount
@"hello23zhang"

+(void)
eosBidOrder
{
    WSCoinAccount * account = [WSWallet accountInfoWithCoinSymbol
:@"EOS"];
    EosCoinAccount * ec = [[EosCoinAccount alloc] initWithCoinAccount:
    account
];
    id < WSCoinBusinessInterface > portal = account.busPortal;
    NSString * publishAccount = Def_EosExchangePublicAccount;
    NSString * action = @
    "bid";
    NSDictionary * args = @
    {
    @"maker":
        ec.name, //下单账户
            @
        "quantity"
    :@"1.0000 ZZC", //下单要买的币种和数量
    @"price":@"10",
    @"bid_contract":@"onedexchange", //要买币种的合约   EOS的话eosio.token
    @"source":@"1", //来源
    @"uuid":@"2"  // 随机数
    };
    [portal invokeFunction:
    publishAccount
    action:action
    args:args
    cb:^
    (BOOL
    state, id
    data
)
    {
        if (state) {
        } else {
        }
    }
];
}


+(void)
eosAskOrder
{
    WSCoinAccount * account = [WSWallet accountInfoWithCoinSymbol
:@"EOS"];
    EosCoinAccount * ec = [[EosCoinAccount alloc] initWithCoinAccount:
    account
];
    id < WSCoinBusinessInterface > portal = account.busPortal;
    NSString * publishAccount = Def_EosExchangePublicAccount;
    NSString * action = @
    "ask";
    NSDictionary * args = @
    {
    @"maker":ec.name, //下单账户
    @"quantity":@"1.0000 ZZC", //卖单的币种和类型
    @"price":@"1",
    @"ask_contract":@"onedexchange", //要买币种的合约   EOS的话eosio.token
    @"source":@"10",
    @"uuid":@"10"
    };
    [portal invokeFunction:
    publishAccount
    action:action
    args:args
    cb:^
    (BOOL
    state, id
    data
)
    {
        if (state) {
        } else {
        }
    }
];
}


+(void)
eosCancelOrder
{
    WSCoinAccount * account = [WSWallet accountInfoWithCoinSymbol
:@"EOS"];
    EosCoinAccount * ec = [[EosCoinAccount alloc] initWithCoinAccount:
    account
];
    id < WSCoinBusinessInterface > portal = account.busPortal;
    NSString * publishAccount = Def_EosExchangePublicAccount;
    NSString * action = @
    "cancelorder";
    NSDictionary * args = @
    {
    @"scope":@"77", //撤单种类
    @"maker":@"aa", //撤单的id
    @"uuid":@"333"
    };
    [portal invokeFunction:
    publishAccount
    action:action
    args:args
    cb:^
    (BOOL
    state, id
    data
)
    {
        if (state) {
        } else {
        }
    }
];
}*/
