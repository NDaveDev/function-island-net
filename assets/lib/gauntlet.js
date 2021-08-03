// GLOBALS
var web3Mode = null;
var walletMode = 'metamask';
var currentAddress = null;
var dividendValue = 0;
var contract = null;
var myBalance = 0;

var buyPrice = 0;
var globalBuyPrice = 0;
var sellPrice = 0;
var bnbPrice = 0;
var currency = (typeof default_currency === 'undefined') ? 'USD' : default_currency;
var bnbPriceTimer = null;
var dataTimer = null;
var infoTimer = null;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            alert('Reload this page and enable access to use this dapp!');
        }
        
        startDapp();
        
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        startDapp();
    }
    // Non-dapp browsers...
    else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

let el = function (id) {
    return document.querySelector(id);
};

var strongHandsManagerABI = ([{"constant":false,"inputs":[{"name":"_unlockAfterNDays","type":"uint256"}],"name":"create","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"strongHand","type":"address"}],"name":"CreatedGauntlet","type":"event"},{"constant":true,"inputs":[],"name":"isGodlyChad","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myGauntlet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"strongHands","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]);

var gauntletABI = ([{"constant":true,"inputs":[],"name":"creationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawDividends","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"buyWithBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_howManyDays","type":"uint256"}],"name":"extendLock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unlockAfterNDays","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isLocked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"},{"name":"_amountOfTokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"developer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lockedUntil","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dividendsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_unlockAfterNDays","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);

var hourglassABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"customerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"bnbReinvested","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"}],"name":"onReinvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"customerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"incomingBNB","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"},{"indexed":true,"internalType":"address","name":"referredBy","type":"address"}],"name":"onTokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"customerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensBurned","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbEarned","type":"uint256"}],"name":"onTokenSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"customerAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"bnbWithdrawn","type":"uint256"}],"name":"onWithdraw","type":"event"},{"inputs":[{"internalType":"address","name":"_customerAddress","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_referredBy","type":"address"}],"name":"buy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"buyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokensToSell","type":"uint256"}],"name":"calculateBNBReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_bnbToSpend","type":"uint256"}],"name":"calculateTokensReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deployer","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_customerAddress","type":"address"},{"internalType":"bool","name":"_includeReferralBonus","type":"bool"}],"name":"dividendsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"exit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_includeReferralBonus","type":"bool"}],"name":"myDividends","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myStatus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myTotalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myTotalReferralEarnings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myTotalReferrals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myTotalWithdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reinvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOfTokens","type":"uint256"}],"name":"sell","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sellPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"statusOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBNBBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"totalDepositsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"totalReferralEarningsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"totalReferralsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"totalWithdrawalsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_toAddress","type":"address"},{"internalType":"uint256","name":"_amountOfTokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let hourglassAddress = '0x0c22C33eaEFC961Ed529a6Af4654B6c2f51c12D3'; // Mainnet

let strongHandsManagerAddress = '0x7f922e7313ac76bb3eD4B32Fd82B1aC482704984'; // Mainnet
// let strongHandsManagerAddress = '0x1AB23a3C2d362Bd8BF14770Ed4514aDa1f076cE2'; // Testnet

let strongHandsManagerContract = web3.eth.contract(strongHandsManagerABI);
let strongHandsManagerInstance = strongHandsManagerContract.at(strongHandsManagerAddress);

let hourglassContract = web3.eth.contract(hourglassABI);
let hourglassInstance = hourglassContract.at(hourglassAddress);

strongHandContract = web3.eth.contract(gauntletABI);
let myStrongHandInstance;

function startDapp() {
    setInterval(myStrongHand, 3000);
    updateBNBPrice();
}

function myStrongHand() {
    strongHandsManagerInstance.isGodlyChad((error, isGodlyChad) => {
        if (isGodlyChad) {
            
            $("#setupPanel").hide();
            $("#myDepositPanel").show();
            $('#myTimePanel').show();
            $('#myControlsPanel').show();

            strongHandsManagerInstance.myGauntlet((error, myStrongHandAddress) => {
                el('#address').innerHTML = myStrongHandAddress;

                myStrongHandInstance = strongHandContract.at(myStrongHandAddress);
                
                myStrongHandInstance.balanceOf((error, myB1VSBalance) => {
                    el('#myBalance').innerHTML = (web3.fromWei(myB1VSBalance, 'ether').toFixed(2) + " B1VS");
                    
                    hourglassInstance.calculateBNBReceived(myB1VSBalance, (error, result) => {
                        el('#myValue').innerHTML = ("Est. $" + (numberWithCommas(((result * bnbPrice) / 1e18).toFixed(2))) + " USD");
                    });
                });
                
                myStrongHandInstance.dividendsOf((error, myDividends) => {
                    el('#myDividends').innerHTML = (web3.fromWei(myDividends, 'ether').toFixed(2) + " BNB");

                    hourglassInstance.calculateBNBReceived(myDividends, (error, result) => {
                        el('#myDivsValue').innerHTML = ("Est. $" + (numberWithCommas(((result * bnbPrice) / 1e18).toFixed(2))) + " USD");
                    });
                });
                
                myStrongHandInstance.isLocked((error, isLocked) => {
                    if (isLocked) {
                        myStrongHandInstance.lockedUntil((error, lockedUntil) => {
                            var _until = new Date(lockedUntil * 1000);
                            el('#mystatus').innerHTML = '<strong>My <span class="text-danger">LOCKED</span> Gauntlet</strong>';
                            el('#lockedUntil').innerHTML = (_until.getDate() + "/" + (_until.getMonth() + 1) + "/" + _until.getFullYear());
                        });
                    } else {
                        $('#mySellPanel').show();
                    }
                });

                myStrongHandInstance.unlockAfterNDays((error, unlockAfterNDays) => {
                    el('#daysUntil').innerHTML = unlockAfterNDays;
                });
                myStrongHandInstance.creationDate((error, creationDate) => {
                    var _date = new Date(creationDate * 1000);
                    el('#created').innerHTML = (_date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear());
                });
            });

        } else {
            el('#address').innerHTML = ("Create a Gauntlet Today!");
            
            el('#myBalance').innerHTML = ("- B1VS");
            el('#myValue').innerHTML = ("- USD");
            el('#myDividends').innerHTML = ("- BNB");
            el('#myDivsValue').innerHTML = ("$- USD");
            
            el('#mystatus').innerHTML = ('<strong class="text-warning">NO GAUNTLET</b>');
            el('#lockedUntil').innerHTML = ('--/--/----');
            el('#daysUntil').innerHTML = ('-');
            el('#created').innerHTML = ('-');
            
            $("#myDepositPanel").hide();
            $('#myTimePanel').hide();
            $('#myControlsPanel').hide();
            $('#mySellPanel').hide();
            
            $("#setupPanel").show();
        }
    });
}

function convertEthToWei(e) {
    return 1e18 * e
}

function convertWeiToEth(e) {
    return e / 1e18
}

function updateBNBPrice() {
    clearTimeout(bnbPriceTimer);
    if (currency === 'B1VS') {
        bnbPrice = 1 / (sellPrice + ((buyPrice - sellPrice) / 2));
        bnbPriceTimer = setTimeout(updateBNBPrice, 5000);
    } else {
        $.getJSON('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=' + currency, function (result) {

            for (var key in result.binancecoin) {
                var bnb = result.binancecoin[key];
            }

            bnbPrice = parseFloat(bnb);
            $('.bnbPrice').text(bnbPrice);

            bnbPriceTimer = setTimeout(updateBNBPrice, 5000);
        });
    }
}

function getStrong() {
    strongHandsManagerInstance.create(el('#locktime').value, (error, result) => {
        if (!error) {
            alertify.success("Creating Gauntlet, please wait...");
        } else {
            alertify.error("Failed - Try again or check Tx...")
        }
    });
}

function buyB1VS() {
    myStrongHandInstance.buy({
        value: web3.toWei(el('#buyamount').value, 'ether')
    }, (error, result) => {
        if (!error) {
            alertify.success("Buying B1VS Shares, please wait...");
        } else {
            alertify.error("Failed - Try again or check Tx...")
        }
    });
}

function withdrawDividends() {
    myStrongHandInstance.withdrawDividends((error, result) => {
        if (!error) {
            alertify.success("Withdrawing Dividends, please wait...");
        } else {
            alertify.error("Failed - Try again or check Tx...")
        }
    });
}

function reinvestDividends() {
    myStrongHandInstance.reinvest((error, result) => {
        if (!error) {
            alertify.success("Reinvesting B1VS Shares, please wait...");
        } else {
            alertify.error("Failed - Try again or check Tx...")
        }
    });
}

function extendLock() {
    myStrongHandInstance.extendLock(el('#extendlocktime').value, (error, result) => {
        if (!error) {
            alertify.success("Extending Lock, please wait...");
        } else {
            alertify.error("Failed - Try again or check Tx...")
        }
    });
}

function sell() {
    myStrongHandInstance.sell(web3.toWei(el('#sellamount').value, 'ether'), (error, result) => {
        if (!error) {
            alertify.success("Selling B1VS Shares, please wait...");
        } else {
            alertify.error("Failed - Try again or check Tx...")
        }
    });
}
