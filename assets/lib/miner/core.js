const prefix = ""
const prefix2 = "assets/img/"


var modal
var modalContent
var lastNumEggs = -1
var lastNumMiners = -1
var lastSecondsUntilFull = 100
var lastHatchTime = 0
var eggstohatch1 = 2592000
var lastUpdate = new Date().getTime()

var currentMiner;
var tvl;
var key;
var currentAddr;
var spend = 0;
var usrBal = 0;
var price = 0;
var balance = 0;
var decimals = 0;
var fixed = 0;
var spendAllowance = 0;
var startSpend = 0;
var step = 0;
var tokenName;
var minerName;
var coinGeckoName;
var refRate = 0;
var dailyReturn;
var aprReturn;
var contractLink;
var step1;
var step2;
var tokenMiner;
var miner;
var bchainName;
var bchainId = -1;
var dexName;
var dexLink;

var chainId = -1;
var nextChainId;
var nextAddr;

var mineImage;

var active = false;
var canSell = true;
var canHatch = true;
var refreshCooledDown = false;

var maticLaunch;
var ftmLaunch;
var avaxLaunch;
var busdLaunch;
var usdcLaunch;
var cakeLaunch;
var dogeLaunch;
var ethLaunch;

window.addEventListener("load", async function() {
  key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f");
  miner = getQueryVariable('miner');
  if (miner == null || miner == 0) {
    miner = 1;
  }

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await ethereum.enable();
    } catch (error) {
      console.error(error);
    }
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  }

  loadMiner(miner);
  controlLoop();
  switchLoop();

  refreshCooledDown = false;
  setTimeout(() => { refreshCooledDown = true }, 2000);
});

function refreshData() {
  if (tokenMiner) { spendLimit(limit => { spend = limit }); }

  contractBalance(result => {
    balance = +result;
    rawStr = numberWithCommas(Number(result).toFixed(fixed));
    const tokenBal = stripDecimals(rawStr, fixed) + " " + tokenName;
    if (+price > 0 && +balance > 0) {
      dollarBal = stripDecimals(numberWithCommas((+price * +balance).toFixed(0)), 0);
      const bal = tokenBal + " ($" + dollarBal + ")";
      console.log(bal);
      document.getElementById('contract-balance').textContent = bal;
    } else {
      document.getElementById('contract-balance').textContent = tokenBal;
    }
  });

  userBalance(result => {
    usrBal = result;
    rawStr = numberWithCommas(Number(result).toFixed(fixed));
    document.getElementById('user-balance').textContent = stripDecimals(rawStr, fixed) + " " + tokenName;
  });

  lastHatch(currentAddr, hatch => { lastHatchTime = hatch });

  getMyEggs(eggs => {
    console.log("eggs=" + eggs);
    if(lastNumEggs != eggs) {
      lastNumEggs = eggs;
      lastUpdate = new Date().getTime();
    }
    if(lastNumMiners == 0 ) {
      document.getElementById("until-full").textContent = "?";
    } else {
      secs = eggstohatch1 - eggs / lastNumMiners;
      lastSecondsUntilFull = secs;
      document.getElementById("until-full").textContent = secondsToString(secs);
    }
  });

  getMyMiners(function(miners) {
    lastNumMiners = miners
    doc = document.getElementsByClassName('num-miners');
    for(var i = 0; i < doc.length;i++) {
      if(doc[i]) {
        doc[i].textContent = translateQuantity(miners);
      }
    }
    document.getElementById('production-rate').textContent=formatEggs(lastNumMiners * 60 * 60);
  });

  updateBuyPrice();
  updateSellPrice();
}
function approve() {
  approveToken(document.getElementById('spend-allowance').value);
}
function buyMiners() {
  ref = getQueryVariable('ref');
  if(ref) {
    if (ref.substring(0, 2) == "XX") {
      ref = ref.substring(2);
      ref = CryptoJS.AES.decrypt(ref.toString(), key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
    }
  }
  if (!web3.utils.isAddress(ref)) {
    ref = currentAddr;
  }

  console.log('ref=', ref);

  buyEggs(ref, document.getElementById('eth-to-spend').value, result => {
    displayTransactionMessage();
  });
}
function compound() {
  ref = getQueryVariable('ref');
  if(ref) {
    if (ref.substring(0, 2) == "XX") {
      ref = ref.substring(2);
      ref = CryptoJS.AES.decrypt(ref.toString(), key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
    }
  }
  if (!web3.utils.isAddress(ref)) {
    ref = currentAddr;
  }
  console.log('ref=', ref);
  hatchEggs(ref, displayTransactionMessage);
}
function updateBuyPrice() {
  calculateEggBuy(document.getElementById('eth-to-spend').value, result => {
    document.getElementById('eggs-to-buy').textContent = formatEggs(result);
  });
}
function updateSellPrice() {
  getMyEggs(eggs => {
    if (eggs > 0) {
      calculateEggSell(eggs, result => {
        document.getElementById('sell-price').textContent = formatVal(result);
      });
    }
  });
}
function secondsToString(seconds) {
  seconds = Math.max(seconds, 0);
  var numhours = Math.floor((seconds % 86400) / 3600);
  var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
  return numhours + "h " + numminutes + "m";
}
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
  }
  return false;
}
function numberWithCommas(amt) {
  const parts = amt.toString().split('.');
  const first = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if(parts[1]) {
    return first + "." + parts[1];
  } else {
    return first;
  }
}
function formatVal(amt) {
  return numberWithCommas(parseFloat(parseFloat(amt).toFixed(fixed)));
}
function displayTransactionMessage() {
  displayModalMessage("Transaction Submitted");
}
function displayModalMessage(message){
  modal.style.display = "block";
  modalContent.textContent = message;
  setTimeout(removeModal, 3000);
}
function removeModal() {
  modalContent.innerHTML = "";
  modal.style.display = "none";
}
function formatEggs(eggs) {
  return translateQuantity(Number(eggs / eggstohatch1).toFixed(fixed));
}
function stripDecimals(str, num){
  if (str.indexOf('.') > -1){
    var left = str.split('.')[0];
	var right = str.split('.')[1];
	return left + '.' + right.slice(0,num);
  }
  else {
    return str;
  }
}
function controlLoop() {
  if(active) { refreshData(); }
  setTimeout(controlLoop, 2500);
}
function switchLoop() {
  if(refreshCooledDown) { checkSwitch(); }
  setTimeout(switchLoop, 2500);
}
function translateQuantity(quantity) {
  return numberWithCommas(Number(quantity).toFixed(2));
}
async function loadMiner(index) {

  active = false;
  currentMiner = index;
  minersContract = null;
  tokenContract = null;

  spend = 0;
  usrBal = 0;
  price = 0;
  balance = 0;

  switch(+index) {
    case 1:
      decimals = 8;
      fixed = 3;
      spendAllowance = 10000;
      startSpend = 1;
      step = 1;
      minerName = "Printer";
      tokenName = "POKR";
      minersAbi = minersTokenAbi;
      minersAddr = "0xfbbB9C1947D629cA421b797dFA188f669f8DAbed";
      tokenAddr = "0xDbf4EFd96389388CC01455011685511f8cDFE762";
      refRate = "3%";
      dailyReturn = "3%";
      aprReturn = "1,095%";
      contractLink = "https://bscscan.com/address/0xDbf4EFd96389388CC01455011685511f8cDFE762#code";
      step1 = "1.";
      step2 = "2.";
      tokenMiner = true;
      bchainId = 56;
      bchainName = "BSC";
      dexName = "PancakeSwap";
      dexLink = "https://pancakeswap.finance/swap?outputCurrency=" + tokenAddr;
      mineImage = "tokens/pokr.png";
    break;
  }

  //-----

  if (window.ethereum) {
    try {
      minersContract = await new window.web3.eth.Contract(minersAbi, minersAddr);
      if(tokenMiner) {
        tokenContract = await new window.web3.eth.Contract(tokenAbi, tokenAddr);
      }
      let accounts = await window.web3.eth.getAccounts();
      currentAddr = accounts[0];
    } catch (error) {
      console.error(error);
    }
  }
  else if (window.web3) {
    minersContract = await new window.web3.eth.Contract(minersAbi, minersAddr);
    if(tokenMiner) {
      tokenContract = await new window.web3.eth.Contract(tokenAbi, tokenAddr);
    }
    let accounts = await window.web3.eth.getAccounts();
    currentAddr = accounts[0];
  }

  chainId = await window.web3.eth.net.getId();
  if (+bchainId != +chainId) {
    console.log("CHAIN="+chainId);
    console.log("BCHAIN="+bchainId);
    alert("Wrong network (" + bchainId + "!=" + chainId+ "). Switch to " + bchainName);
  }

  //-----

  if(tokenMiner) {
    document.getElementById('token-miner').style.display = 'block';
  } else {
    document.getElementById('token-miner').style.display = 'none';
  }
  doc = document.getElementsByClassName('miner-name');
  for(var i = 0; i < doc.length;i++) {
    if(doc[i]) {
      doc[i].textContent = minerName;
    }
  }
  doc = document.getElementsByClassName('miners-name');
  for(var i = 0; i < doc.length;i++) {
    if(doc[i]) {
      doc[i].textContent = minerName + "s";
    }
  }
  doc = document.getElementsByClassName('mined-name');
  for(var i = 0; i < doc.length;i++) {
    if(doc[i]) {
      if (minerName == "Miner") {
        doc[i].textContent = "Mined";
      } else {
        doc[i].textContent = "Minted";
      }

    }
  }
  doc = document.getElementsByClassName('token-name');
  for(var i = 0; i < doc.length;i++) {
    if(doc[i]) {
      doc[i].textContent = tokenName;
    }
  }
  doc = document.getElementsByClassName('dex-name');
  for(var i = 0; i < doc.length;i++) {
    if(doc[i]) {
      doc[i].textContent = dexName;
    }
  }
  document.getElementById('dex-link').href = dexLink;
  document.getElementById('ref-rate').textContent = refRate;
  document.getElementById('daily-return').textContent = dailyReturn;
  document.getElementById('apr-return').textContent = aprReturn;
  document.getElementById('contract-link').href = contractLink;
  document.getElementById('step-1').textContent = step1;
  document.getElementById('step-2').textContent = step2;
  document.getElementById('spend-allowance').value = spendAllowance;
  document.getElementById('spend-allowance').step = step;
  document.getElementById('eth-to-spend').value = startSpend;
  document.getElementById('eth-to-spend').step = step;

  document.getElementById("token-image").src = prefix2 + mineImage;
  document.documentElement.setAttribute('data-theme', tokenName);

  const encr = CryptoJS.AES.encrypt(currentAddr, key, { mode: CryptoJS.mode.ECB });
  document.getElementById('ref-link').innerText = window.location.origin + "/miner.html?miner=" + index + "&ref=" + "XX" + encr.toString();

  var url;
  const ref = getQueryVariable('ref');
  if(ref) {
    url = window.location.origin + prefix + "/miner.html?miner=" + index + "&ref=" + ref;
  } else {
    url = window.location.origin + prefix + "/miner.html?miner=" + index;
  }
  history.pushState({}, null, url);

  active = true;
}

function daysDiff(end, start) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const differenceMs = Math.abs(end - start);
  return Math.round(differenceMs / ONE_DAY);
}
async function checkSwitch() {
  if (window.ethereum) {
    nextWeb3 = new Web3(window.ethereum);
    try {
      let accounts = await nextWeb3.eth.getAccounts();
      nextAddr = accounts[0];
    } catch (error) {
      console.error(error);
    }
  }
  else if (window.web3) {
    nextWeb3 = new Web3(window.web3.currentProvider);
    let accounts = await nextWeb3.eth.getAccounts();
    nextAddr = accounts[0];
  }
  nextChainId = await nextWeb3.eth.net.getId();

  if(chainId != -1 && (nextAddr != currentAddr || nextChainId != chainId)) {
    //console.log("SWITCHED");
    loadMiner(currentMiner);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}