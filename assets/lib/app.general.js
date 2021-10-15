// GLOBALS
var web3Mode = null;
var walletMode = 'metamask';

var contract = null;
var currentAddress = null;

var decimalChainID;

var currency = (typeof default_currency === 'undefined') ? 'USD' : default_currency;

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var wbnbPrice, busdPrice, btcbPrice, cakePrice, linkPrice, daiPrice, ethPrice, adaPrice, skPrice, xskPrice;

var _toShow = 3;

var priceTimer = null;

let GANGSTER = {
    "BSC": {
        Tokens: {
            "sidekick" : {
                base : { token: "0x5755E18D86c8a6d7a6E25296782cb84661E6c106"},
                staked : {token: "0xA74Ce0F84d3F6dF9DAe2967a8Cfa645bF6693195"},
                coingecko: "sidekick-token"
            },
            "gangster" : {
                base : { token: "0xe727A157757f2d8400108063E9BF9e29EF725Ba6"},
                staked : {token: "0x1CD615d281a1895f3E0463C67D071FEc56664a12"},
                coingecko: "sidekick-token"
            },
            "busd" : { token: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", coingecko: "binance-usd" },
            "btcb" : { token: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", coingecko: "bitcoin" },
            "wbnb" : { token: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", coingecko: "binance-coin" },
            
            "cake" : { token: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", coingecko: "pancakeswap-token" },
            "dai" : { token: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3", coingecko: "dai" },
            "eth" : { token: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", coingecko: "ethereum" },
            "ada" : { token: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", coingecko: "cardano" },
            "link" : { token: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD", coingecko: "chainlink" },
        },

        VaultContracts: {
            "ogx" : { token: "0x0935072f012190354ef41a66078250f1cf2846dd", vault: "0x851b726Be2082BA7Fd5EEC96F79b9093a346098e", symbol: "OGX", start: "1625011794" },
            "xsk" : { token: "0xA74Ce0F84d3F6dF9DAe2967a8Cfa645bF6693195", vault: "0x82a58Db1E81503658515b72F0f844531e14C76E0", symbol: "xSK", start: "1625011635" },
            "busd" : { token: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", vault: "0xd920Fa5D50a970698bcEA8dD5A9c25b4e62EfaB3", symbol: "BUSD", start: "1625011221" },
            "wbnb" : { token: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", vault: "0x5b68EfE78D9951a8C347A5Dc807998c40934CD14", symbol: "WBNB", start: "1625010939" },
            "btcb" : { token: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", vault: "0xe968D2E4ADc89609773571301aBeC3399D163c3b", symbol: "BTCB", start: "1625011422" }
        },

        VaultV2Contracts: {
            "cake" : { token: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", vault: "0xc1E043437BaC44a9896c45f72562EaE99B4EBc66", symbol: "CAKE", start: "1627595700" },
            "dai" : { token: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3", vault: "0x91d4A8e731C9351d72d83311eaC04458F896BF59", symbol: "DAI", start: "1627914660" },
            "link" : { token: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD", vault: "0x8563639c05dfB4b9f9f6E68089ec98D7e1561E41", symbol: "LINK", start: "1627917540" },
            "eth" : { token: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", vault: "0xD55eF590891395993Fb107b569545dd38cAEBad5", symbol: "ETH", start: "1627595700" },
            "ada" : { token: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", vault: "0xfD80f9B3C57Cef9dC384b3Dc82ACf08dA0776f1E", symbol: "ADA", start: "1627914780" },
        },

        MinerContracts: {
            "ronin" : { contract: "0x91146496652Fd42a744e4fBBa67383a193DBFaa8" },
            "kodi" : { contract: "0x91146496652Fd42a744e4fBBa67383a193DBFaa8" },
            "flokin" : { contract: "0x91146496652Fd42a744e4fBBa67383a193DBFaa8" },
        },

        SpecialContracts: {
            "hourglass" : { contract: "0x0c22C33eaEFC961Ed529a6Af4654B6c2f51c12D3" },
            "gauntlets" : { contract: "0x7f922e7313ac76bb3eD4B32Fd82B1aC482704984" },
            "gunsnames" : { contract: "0x7bE1aDbCDd63f3dBeAC6DD1B778d316856AD1725" },
            "distillery" : { contract: "0xF0e6E9F167dD9c43DA4686fB170D886bCb3f6eA4" },
            "reserve" : { contract: "0x5FfcF7FEA55098945f66460a160136eED4e7faA9" },
            "cards" : { contract: "0x48e97e0c336d8b8c7c672264a463eceb31d14ccd" },
            "moneypot": { contract: "0xE90c0651Ce4FddD8B8d7e1Daa1f0A14761a761B1" }
        },

        GFIToken: {
            MGE : {
                mge: "0x397fA5064E828fa8d8A65aa980B02fe76c4cEd88",
                mgd: "0xC99185bDA35753730e58101c6645d6AEC923F6E3"
            }, 
            TOKENOMICS : {
                devsplitter: "0xD753Ee4AA5501009Aa4F8193FA94cB9Ff781f43a",
                distillery: "0x68F22Ef8aA1C9556839B7F753195BB919F8E2244",
                floorcalc: "0x36f92F310A5789A7C7fbB171783Ac00e332Ff3CC",
                floorcalcV1: "0xbc76f1Af6c78FB914fEb6c425F5514048C02602E",
                eliteToken: "0x4ba31190Dc116D8b454E8EfC0e9a0551a7a06310",
                feeSplitter: "0xD952b6888C8DBB24E6D18Fe4b19f77df6f36bCE0",
                liquidityController: "0xA5469e5163a9b7bAa39eF1f01356D3E4773Dff93",
                oneShotSplitter: "0xC42caF14eD66d3E03FE016DDaF0B523b630a4ddA",
                stakingToken: "0x1CD615d281a1895f3E0463C67D071FEc56664a12",
                teamSplitter: "0x49f6d270978984053CeDC325Fd57c7869a54b05b"
            }, 
        },

        DEX: {
            Swap: {
                factory: "0xeb17Dd35e47B1a41ba4D86B3506ec1f9b680b56a"
            }
        }
    }
}

// Number with Commas
const numberWithCommas = (x) => {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}

const MAX_INT_HEX = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

window.addEventListener('load', async () => {

    // Log chain ID
    ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
        console.log(`hexadecimal string: ${chainId}`);
        decimalChainID = parseInt(chainId, 16);
        console.log(`decimal number: ` + decimalChainID);

        var network = 'Unsupported network detected';
        switch (decimalChainID) {
            case 1:
                console.log('This is mainnet');
                alertify.error("⛔ Wrong Network ⛔");
                network = 'WRONG NETWORK';
                disableUI();
                break
            case 2:
                console.log('This is the deprecated Morden test network.');
                alertify.error("⛔ Wrong Network ⛔");
                network = 'WRONG NETWORK';
                disableUI();
                break
            case 3:
                console.log('This is the ropsten test network.');
                alertify.error("⛔ Wrong Network ⛔");
                network = 'WRONG NETWORK';
                disableUI();
                break
            case 4:
                console.log('This is the Rinkeby test network.');
                alertify.error("⛔ Wrong Network ⛔");
                network = 'WRONG NETWORK';
                disableUI();
                break
            case 56:
                console.log('This is the BSC mainnet.');
                alertify.success("✔ Connected - Mainnet ✔");
                network = 'BSC Mainnet'
                enableUI();
                break
            case 97:
                console.log('This is the BSC Testnet');
                alertify.warning("✔ Connected - Testnet ✔");
                network = 'BSC Testnet'
                enableUI();
                break
            case 42:
                console.log('This is the Kovan test network.');
                alertify.error("⛔ Wrong Network ⛔");
                network = 'WRONG NETWORK';
                disableUI();
                break
            default:
                console.log('This is an unknown network.');
        }

    $('#network').text(network)

    }).catch((error) => {
        console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
    });

    // Log available accounts
    ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        console.log(`Accounts:\n${accounts.join('\n')}`);
        currentAddress = accounts[0];
    }).catch((error) => {
        console.error(`Error fetching accounts: ${error.message}.Code: ${error.code}. Data: ${error.data}`);
    });

    ethereum.on('chainChanged', (decimalChainID) => window.location.reload());
    ethereum.on('accountsChanged', () => window.location.reload());

    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        try {
            // Request account access if needed
            await ethereum.request('eth_requestAccounts');
        } catch (error) {
            
        }
    } else if (window.web3) {
        // Legacy dapp browsers...
        window.web3 = new Web3(web3.currentProvider);
    } else {
        // Non-dapp browsers...
        console.log('You need MetaMask or a Dapp Browser capable of connecting to Binance Smart Chain!');
    }
});

function detectWeb3() {
    if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider)
        web3Mode = 'metamask'
    } else {

    }
}

function disableUI() {
    $("#wrongNetwork").show();
    $(".page-wrapper").attr("data-sidebar-hidden", "hidden");
    $("#homeSection").hide();
    $("#toggle-sidebar-btn").hide();
}

function enableUI() {
    $("#homeSection").show();
    $(".page-wrapper").attr("data-sidebar-hidden", "hidden");
    $("#wrongNetwork").hide();
}

///////////////////////////////////////////////////////////////////////
// COMMON UTILITIES
///////////////////////////////////////////////////////////////////////

// Eth to Wei, and Wei to Eth
function toWei(e) {return 1e18 * e}
function fromWei(e) {return e / 1e18}

function log10(val) {return Math.log(val) / Math.log(10);}

function shortId(str, size) {
    return str.substr(0, size) + '...' + str.substr(str.length - size, str.length);
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData('Text', text)
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea')
        textarea.textContent = text
        textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
            return document.execCommand('copy') // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return false
        } finally {
            document.body.removeChild(textarea)
        }
    }
}

function exactNumber(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function formatNumber(n, maxDecimals) {
    var zeroes = Math.floor(log10(Math.abs(n)));
    var postfix = '';
    if (zeroes >= 9) {
        postfix = 'B';
        n /= 1e9;
        zeroes -= 9;
    } else if (zeroes >= 6) {
        postfix = 'M';
        n /= 1e6;
        zeroes -= 6;
    }

    zeroes = Math.min(maxDecimals, maxDecimals - zeroes);

    return (
        n.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: Math.max(zeroes, 0)
        }) + postfix
    );
}

function formatFinishingTime(time) {
    var date = new Date(time * 1000);
    var year = date.getFullYear();

    var month = months[date.getMonth()];
    // Days part from the timestamp
    var days = date.getDate();
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = date.getMinutes();
    // Seconds part from the timestamp
    var seconds = date.getSeconds();

    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

    // Will display time in 10:30:23 format
    var formattedTime = days + ' ' + month + ' ' + year + ', ' + strTime;
    return formattedTime;
}

function toReadableNumber(number, decimals, formatNumber) {
    if (formatNumber == true) {
        return (numberWithCommas((fromWei(number)).toFixed(decimals)));
    } else {
        return ((fromWei(number)).toFixed(decimals));
    }
}

function getURL(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match
        })
    }
}

Number.prototype.toFixedNoRounding = function(n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a = this.toString().match(reg)[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
        return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
 }

///////////////////////////////////
// SMART CONTRACT ABI
//////////////////////////////////

var tokenABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_newAddress","type":"address"},{"indexed":false,"internalType":"bool","name":"_isContract","type":"bool"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"AddedToWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_oldAddress","type":"address"},{"indexed":false,"internalType":"bool","name":"_isContract","type":"bool"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"RemovedFromWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_migrator","type":"address"},{"indexed":true,"internalType":"address","name":"_recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"StatsMigrated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_burner","type":"address"},{"indexed":false,"internalType":"address","name":"_burnedFrom","type":"address"},{"indexed":false,"internalType":"uint256","name":"_tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"TokensBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_minter","type":"address"},{"indexed":false,"internalType":"address","name":"_mintedTo","type":"address"},{"indexed":false,"internalType":"uint256","name":"_tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"TokensMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"Whitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"onCompound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_governance","type":"address"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onEjectGovernance","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"onFreeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"onHarvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"onUnfreeze","type":"event"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"constant":false,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"addToWhitelist","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burnTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"burnedOf","outputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"compound","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"distributeTokens","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"dividendsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"divisor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"eject","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"freeze","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"freezeFor","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"frozenOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"governance","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"harvest","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mintTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"mintedOf","outputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeFromWhitelist","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"scaledPayoutPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTokensBurned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTokensFrozen","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTokensMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"transferStatsTo","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"unfreeze","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

var vaultABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"address","name":"_rewardAddress","type":"address"},{"internalType":"uint256","name":"_rewardRate","type":"uint256"},{"internalType":"uint8","name":"_dripRate","type":"uint8"},{"internalType":"uint256","name":"_countdownBlocks","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_compounded","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onCompound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_deposited","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensRewarded","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onDonate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"made","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onMakeOriginalGangster","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_liquidated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensEarned","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onResolve","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_withdrawn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onWithdraw","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"accountOf","outputs":[{"internalType":"uint256[14]","name":"","type":"uint256[14]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"addOriginalGangster","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"calculateSharesReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"calculateTokensReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"compound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"dailyEstimate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositTo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"developer","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"dividendsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"donate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dripPoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dripRate","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"harvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"_isWhitelisted","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastPayout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRebaseTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myEarnings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"payoutFrequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rebaseFrequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"resolve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"tokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalClaims","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTxs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"users","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

var namesABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onCollectFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onReceiveDonation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"bool","name":"_isContract","type":"bool"}],"name":"onSetNameForAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onSetPrice","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"bool","name":"_status","type":"bool"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onToggleOriginalGangster","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_blacklistedAddress","type":"address"},{"indexed":true,"internalType":"address","name":"_og","type":"address"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"},{"indexed":false,"internalType":"string","name":"_reason","type":"string"}],"name":"onUpdateBlacklistForAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_blacklistedName","type":"string"},{"indexed":false,"internalType":"string","name":"_reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onUpdateBlacklistForName","type":"event"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"bool","name":"_isBlacklisted","type":"bool"},{"internalType":"string","name":"_reason","type":"string"}],"name":"setBlacklistAddressStatus","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_reason","type":"string"}],"name":"setBlacklistNameStatus","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"setNameRecord","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"name":"setNameRecordOf","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setPrice","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sweep","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"toggleOriginalGangster","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[],"name":"_devwallet","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"checkAvailability","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"checkIsBlacklistedAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"checkIsBlacklistedName","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"getAddressByName","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getNameByAddress","outputs":[{"internalType":"string","name":"name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"txs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

var vaultV2ABI = ([{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onBuyback","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_compounded","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onCompound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_deposited","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onDonate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onDonateBNB","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onSetBuyback","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_pool","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_divs","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_fees","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onSetFeeSplit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldSR","type":"address"},{"indexed":false,"internalType":"address","name":"_newSR","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onSetSwapRouter","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldTR","type":"address"},{"indexed":false,"internalType":"address","name":"_newTR","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onSetTokenRouter","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"_toggle","type":"bool"},{"indexed":false,"internalType":"string","name":"_reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onToggleBuyback","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"invested","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"soldTokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_liquidated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensEarned","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_withdrawn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onWithdraw","type":"event"},{"inputs":[],"name":"compound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositTo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"donate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newToken","type":"address"}],"name":"setBuybackToken","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pool","type":"uint256"},{"internalType":"uint256","name":"_divs","type":"uint256"},{"internalType":"uint256","name":"_fees","type":"uint256"}],"name":"setFeeSplit","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_swapRouter","type":"address"}],"name":"setSwapRouter","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenRouter","type":"address"}],"name":"setTokenRouter","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sweep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"enable","type":"bool"},{"internalType":"string","name":"_reason","type":"string"}],"name":"toggleBuyback","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"address","name":"_tokenRouter","type":"address"}],"name":"updateTokenRouter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_buybackTokenAddress","type":"address"},{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"address","name":"_tokenRouter","type":"address"},{"internalType":"address","name":"_swapRouter","type":"address"},{"internalType":"address","name":"_reserveAddress","type":"address"},{"internalType":"uint8","name":"_dripRate","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"accountOf","outputs":[{"internalType":"uint256[14]","name":"","type":"uint256[14]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bnbReceiver","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buybackEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buybacksBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buybackToken","outputs":[{"internalType":"contract Token","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"calculateSharesReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"calculateTokensReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"dailyEstimate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"dividendsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dripPoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dripRate","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"forDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"forFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"forPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastPayout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebaseTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myEarnings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"payoutFrequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebaseFrequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reserveAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sellPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"stakingToken","outputs":[{"internalType":"contract Token","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"tokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenUniswapV2Router","outputs":[{"internalType":"contract iRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBuyBack","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalClaims","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTxs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract iRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"users","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wbnb","outputs":[{"internalType":"contract Token","name":"","type":"address"}],"stateMutability":"view","type":"function"}]);
