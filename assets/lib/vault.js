var url = new URL(window.location.href)
var _vault = url.searchParams.get("v")
const _symbol = (_vault !== null) ? _vault : "cake"

var _myTokens = 0;
var _myDividends = 0;
var _myPercentage = 0;

var _estimate = 0;
var _approvedAmount = 0;
var _tokenBalance = 0;
var _totalBalance = 0;
var _rewardsFund = 0;

var totalSupply;
var dividendBalance;
var _vaultStart;

var vaultType;

var startTimestamp;

var _myName;

var _places = 2;

var _userName;

let namesContractAddress = GANGSTER.BSC.SpecialContracts.gunsnames.contract;

////////////////////////////////////////

$(document).ready(init);

window.addEventListener('load', function () {
	prepareVaultInterface();
	setTimeout(detectWeb3, 500)
});

function detectWeb3() {
	if (typeof web3 !== 'undefined') {
		web3js = new Web3(web3.currentProvider)
		web3Mode = 'metamask'
	} else {

	}
}

function prepareVaultInterface() {
	if (_symbol == 'WBNB') {
		$("#buybacksRow").hide();
		vaultAddress = (GANGSTER.BSC.VaultContracts.wbnb.vault);
		tokenAddress = (GANGSTER.BSC.VaultContracts.wbnb.token);
		startTimestamp = (GANGSTER.BSC.VaultContracts.wbnb.start);
		vaultInstance = web3.eth.contract(vaultABI).at(vaultAddress);
		vaultType = 2;

	} else if (_symbol == 'BUSD') {
		$("#buybacksRow").hide();
		vaultAddress = (GANGSTER.BSC.VaultContracts.busd.vault);
		tokenAddress = (GANGSTER.BSC.VaultContracts.busd.token);
		startTimestamp = (GANGSTER.BSC.VaultContracts.busd.start);
		vaultInstance = web3.eth.contract(vaultABI).at(vaultAddress);
		vaultType = 2;

	} else if (_symbol == 'BTCB') {
		$("#buybacksRow").hide();
		vaultAddress = (GANGSTER.BSC.VaultContracts.btcb.vault);
		tokenAddress = (GANGSTER.BSC.VaultContracts.btcb.token);
		startTimestamp = (GANGSTER.BSC.VaultContracts.btcb.start);
		vaultInstance = web3.eth.contract(vaultABI).at(vaultAddress);
		vaultType = 2;

	} else if (_symbol == 'XSK') {
		$("#buybacksRow").hide();
		vaultAddress = (GANGSTER.BSC.VaultContracts.xsk.vault);
		tokenAddress = (GANGSTER.BSC.VaultContracts.xsk.token);
		startTimestamp = (GANGSTER.BSC.VaultContracts.xsk.start);
		vaultInstance = web3.eth.contract(vaultABI).at(vaultAddress);
		vaultType = 2;

	} else if (_symbol == 'OGX') {
		$("#buybacksRow").hide();
		vaultAddress = (GANGSTER.BSC.VaultContracts.ogx.vault);
		tokenAddress = (GANGSTER.BSC.VaultContracts.ogx.token);
		startTimestamp = (GANGSTER.BSC.VaultContracts.ogx.start);
		vaultInstance = web3.eth.contract(vaultABI).at(vaultAddress);
		vaultType = 2;
	} else if (_symbol == 'XGFI') {
		$("#buybacksRow").hide();
		startTimestamp = 1629999990;
		vaultAddress = (GANGSTER.BSC.VaultXContracts.xgfi.vault);
		tokenAddress = (GANGSTER.BSC.GFIToken.TOKENOMICS.stakingToken);
		startTimestamp = (GANGSTER.BSC.VaultContracts.ogx.start);
		vaultInstance = web3.eth.contract(specialVaultABI).at(vaultAddress);
		vaultType = 2;
	}

	// V2 vault checks
	if (_symbol == 'CAKE') {
		$("#buybacksRow").show();
		startTimestamp = 1627595701;
		vaultAddress = (GANGSTER.BSC.VaultV2Contracts.cake.vault);
		tokenAddress = (GANGSTER.BSC.Tokens.cake.token);
		vaultInstance = web3.eth.contract(vaultV2ABI).at(vaultAddress);
		vaultType = 1;

	} else if (_symbol == 'DAI') {
		$("#buybacksRow").show();
		startTimestamp = 1627914660;
		vaultAddress = (GANGSTER.BSC.VaultV2Contracts.dai.vault);
		tokenAddress = (GANGSTER.BSC.Tokens.dai.token);
		vaultInstance = web3.eth.contract(vaultV2ABI).at(vaultAddress);
		vaultType = 1;

	} else if (_symbol == 'ADA') {
		$("#buybacksRow").show();
		startTimestamp = 1627914780;
		vaultAddress = (GANGSTER.BSC.VaultV2Contracts.ada.vault);
		tokenAddress = (GANGSTER.BSC.Tokens.ada.token);
		vaultInstance = web3.eth.contract(vaultV2ABI).at(vaultAddress);
		vaultType = 1;

	} else if (_symbol == 'ETH') {
		$("#buybacksRow").show();
		startTimestamp = 1627595701;
		vaultAddress = (GANGSTER.BSC.VaultV2Contracts.eth.vault);
		tokenAddress = (GANGSTER.BSC.Tokens.eth.token);
		vaultInstance = web3.eth.contract(vaultV2ABI).at(vaultAddress);
		vaultType = 1;

	} else if (_symbol == 'LINK') {
		$("#buybacksRow").show();
		startTimestamp = 1627917540;
		vaultAddress = (GANGSTER.BSC.VaultV2Contracts.link.vault);
		tokenAddress = (GANGSTER.BSC.Tokens.link.token);
		vaultInstance = web3.eth.contract(vaultV2ABI).at(vaultAddress);
		vaultType = 1;
	}

	tokenInstance = web3.eth.contract(tokenABI).at(tokenAddress);
	namesInstance = web3.eth.contract(namesABI).at(namesContractAddress);
	$(".buybackToken").text("xSK");
	$(".tokenSymbol").text(_symbol);
	$("#tokenIcon").replaceWith("<img src='assets/img/tokens/" + _symbol + ".png' class='responsive-circle' width='20%' />");
	$("#contractLink").replaceWith('<a href="https://bscscan.com/address/' + vaultAddress + '" id="contractLink" type="button" class="btn btn-block btn-md btn-light roundedCorners"><i class="fas fa-dollar-sign"></i> View Contract</a>');
}

// INIT: This only runs once on page load, then triggers the loops
function init() {
	$('#approve-btn').click(function () {
		var amount = MAX_INT_HEX;
		tokenInstance.approve(vaultAddress, amount, function (error, hash) {
			if (!error) {
				console.log(hash);
				alertify.success("🎩 Approving " + _symbol + " Vault");
			} else {
				console.log(error);
				alertify.error("❌ Could not approve the " + _symbol + " vault!");
			}
		});
	});

	$('#maxDeposit-btn').click(function () {
		$("#depositAmount").val(maxWalletAmount());
		alertify.warning("⚠ Max Deposit ⚠");
	});

	$('#maxResolve-btn').click(function () {
		$("#resolveAmount").val(maxStakedAmount());
		alertify.warning("⚠ Max Withdraw ⚠");
	});

	$('#maxTransfer-btn').click(function () {
		$("#transferAmount").val(maxStakedAmount());
		alertify.warning("⚠ Max Transfer ⚠");
	});

	$('#transfer-btn').click(function () {
		var amount = parseFloat($('#transferAmount').val());
		var to = $('#transferReceiver').val();
		if (amount > 0 && to.length == 42) {
			vaultInstance.transfer(to, web3.toWei(amount, 'ether'), function (error, hash) {
				if (!error) {
					console.log(hash);
					alertify.success("⏳ Processing Tx...");
				} else {
					console.log(error);
					alertify.error("❌ Could not transfer!");
				}
			});
		}
	});

	$('#deposit-btn').click(function () {
		var amount = parseFloat($('#depositAmount').val());
		if (amount > 0) {
			vaultInstance.deposit(web3.toWei(amount, 'ether'), function (error, hash) {
				if (!error) {
					console.log(hash);
					alertify.success("⏳ Processing Tx...");
				} else {
					console.log(error);
					alertify.error("❌ Could not deposit!");
				}
			});
		}
	});

	$('#resolve-btn').click(function () {
		var amount = parseFloat($('#resolveAmount').val());
		if (amount > 0) {
			if (vaultType == 1) {
				vaultInstance.withdraw(web3.toWei(amount, 'ether'), function (error, hash) {
					if (!error) {
						console.log(hash);
						alertify.success("⏳ Processing Tx...");
					} else {
						console.log(error);
						alertify.error("❌ Could not Unstake!");
					}
				});
			} else if (vaultType == 2) {
				vaultInstance.resolve(web3.toWei(amount, 'ether'), function (error, hash) {
					if (!error) {
						console.log(hash);
						alertify.success("⏳ Processing Tx...");
					} else {
						console.log(error);
						alertify.error("❌ Could not Unstake!");
					}
				});
			}
		}
	});

	$('#harvest').click(function () {
		if (_myDividends > 0) {
			vaultInstance.harvest(function (error, hash) {
				if (!error) {
					console.log(hash);
					alertify.success("⏳ Processing Tx...");
				} else {
					console.log(error);
					alertify.error("❌ Could not Harvest!");
				}
			});
		} else {
			alertify.warning("⚠ No Dividends ⚠");
		}
	});

	$('#compound').click(function () {
		if (_myDividends > 0) {
			vaultInstance.compound(function (error, hash) {
				if (!error) {
					console.log(hash);
					alertify.success("⏳ Processing Tx...");
				} else {
					console.log(error);
					alertify.error("❌ Could not Compound!");
				}
			});
		} else {
			alertify.warning("⚠ No Dividends ⚠");
		}
	});

	$('#sweep').click(function () {
		if (_myDividends > 0) {
			vaultInstance.sweep(function (error, hash) {
				if (!error) {
					console.log(hash);
					alertify.success("⏳ Processing Tx...");
				} else {
					console.log(error);
					alertify.error("❌ Error - Try Again!");
				}
			});
		} else {
			alertify.warning("⚠ No Funds ⚠");
		}
	});

	var filter = web3.eth.filter('latest');
	filter.watch(function (error, result) {
		update();
	});
	setTimeout(update, 3000);
	setTimeout(attachEvents, 5000);
}

// UPDATE: This happens every 3 seconds, to keep data nice & fresh
function update() {
	web3.eth.getBalance(currentAddress, function (e, r) {
		$('.address-balance').text(fromWei(r).toFixed(6) + ' BNB')

		$("#bscscanLink").replaceWith('<a href="https://bscscan.com/address/' + currentAddress + '" id="bscscanLink" class="dropdown-item" target="_blank" rel="nofollow"><i class="fas fa-wallet"></i> My Wallet</a>');

		$("#qrImage").replaceWith('<img src="https://chart.googleapis.com/chart?chs=350x350&amp;cht=qr&amp;chl=' + currentAddress + '&amp;choe=UTF-8" />');
		$("#myAddr").replaceWith('<strong>' + shortId(currentAddress, 7) + '</strong>');
	});

	tokenInstance.allowance(currentAddress, vaultAddress, function (e, r) {
		_approvedAmount = r / 1e58;
		console.log("Your approved tokens: " + _approvedAmount);
		if (r > (1000000000000000 * 1e18)) {
			$("#approveSection").hide();
			$("#depositButtonSection").show();
		} else {
			$("#depositButtonSection").hide();
			$("#approveSection").show();
		}
	});

	namesInstance.getNameByAddress.call(currentAddress, function (e, r) {
		_myName = r;
		$(".username").text(r);
	});

	vaultInstance.totalSupply.call(function (error, result) {
		_totalStaked = result / 1e18;
		$('#stakedBalance').text(numberWithCommas((_totalStaked).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.totalBalance.call(function (error, result) {
		_totalBalance = result / 1e18;
		$('#totalBalance').text(numberWithCommas((_totalBalance).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.myTokens.call(function (error, result) {
		_myTokens = result / 1e18;
		_myPercentage = (_myTokens * 100) / _totalBalance;

		$('#myStake').text(numberWithCommas(_myTokens.toFixed(_toShow)) + ' ' + _symbol);
		$('#myStakePercentage').text(numberWithCommas(_myPercentage.toFixed(_toShow)));
	});

	vaultInstance.myEarnings.call(function (error, result) {
		_myDividends = result;
		$('#myEarnings').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.users.call(function (error, result) {
		$('#playerCount').text(numberWithCommas(result));
	});

	vaultInstance.dripPoolBalance.call(function (error, result) {
		_rewardsFund = result;
		$('#rewardsFund').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.accountOf.call(currentAddress, function (error, result) {
		$('#deposited').text(numberWithCommas((result[0] / 1e18).toFixed(_toShow)) + ' ' + _symbol);
		$('#withdrawn').text(numberWithCommas((result[1] / 1e18).toFixed(_toShow)) + ' ' + _symbol);
		$('#rewarded').text(numberWithCommas((result[2] / 1e18).toFixed(_toShow)) + ' ' + _symbol);
		$('#compounded').text(numberWithCommas((result[3] / 1e18).toFixed(_toShow)) + ' ' + _symbol);
		$('#contributed').text(numberWithCommas((result[4] / 1e18).toFixed(_toShow)) + ' ' + _symbol);
		$('#transferredShares').text(numberWithCommas((result[5] / 1e18).toFixed(_toShow)));
		$('#receivedShares').text(numberWithCommas((result[6] / 1e18).toFixed(_toShow)));


		$('#xInvested').text(result[7]);
		$('#xRewarded').text(result[8]);
		$('#xContributed').text(result[9]);
		$('#xWithdrawn').text(result[10]);
		$('#xTransferredShares').text(result[11]);
		$('#xReceivedShares').text(result[12]);
		$('#xRolled').text(result[13]);
	});

	vaultInstance.balanceOf.call(currentAddress, function (error, result) {
		$('#myBalance').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.dividendsOf.call(currentAddress, function (error, result) {
		$('#myDividends').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.totalClaims.call(function (error, result) {
		$('#totalClaims').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.totalDeposits.call(function (error, result) {
		$('#totalDeposits').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	vaultInstance.totalTxs.call(function (error, result) {
		$('#totalTxCount').text(result);
	});

	tokenInstance.balanceOf.call(currentAddress, function (error, result) {
		_tokensInUserWallet = result;
		$("#myWalletBalance").text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	if (vaultType == 2) {
		vaultInstance.startTime.call(function (error, result) {
			startTimestamp = result;
		})
	}

	vaultInstance.dailyEstimate.call(currentAddress, function (error, result) {
		if (!error) {
			_estimate = result;

			let dripApy = (_myTokens > 0) ? _estimate * 365 * 100 / _myTokens : 0

			let start = startTimestamp;
			let now = Math.floor(Date.now() / 1000)

			let daysRunning = (now - start) / 86400
			let totalVolume = _rewardsFund / 0.08

			let instantDaily = totalVolume / daysRunning
			let instantApy = 100 * 365 * 0.02 * instantDaily / totalSupply
			let apy = instantApy + dripApy

			if (apy === 0 || Number.isNaN(apy)) {
				$('#vault-APY').text("calculating...");
				return;
			}

			$("#vault-APY").text("~" + numberWithCommas((apy / 1e18).toFixed(_toShow)) + "% APY");
		} else {
			console.log(error);
		}
	});

	vaultInstance.totalSupply.call(function (error, result) {
		totalSupply = result;
		$('#totalSupply').text(numberWithCommas((result / 1e18).toFixed(_toShow)) + ' ' + _symbol);
	});

	// WHAT-YOU-GET PREDICTOR
	$('#depositAmount').on('input change', function () {
		var value = parseFloat($(this).val()) * 1e18;

		if (value === 0 || Number.isNaN(value)) {
			$('#deposit-hint').text("10% Tax applies");
			return;
		}

		if (value > 0) {
			let _return = ((value / 100) * 90);
			$('#deposit-hint').text("Your Deposit: " + numberWithCommas((_return / 1e18).toFixed(_toShow)) + " " + _symbol);
		}
	});

	$('#resolveAmount').on('input change', function () {
		var value = parseFloat($(this).val()) * 1e18;

		if (value === 0 || Number.isNaN(value)) {
			$('#resolve-hint').text("10% Tax applies");
			return;
		}

		if (value > 0) {
			let _return = ((value / 100) * 90);
			$('#resolve-hint').text("Your Withdrawal: " + numberWithCommas((_return / 1e18).toFixed(_toShow)) + " " + _symbol);
		}
	});

	$('#transferAmount').on('input change', function () {
		var value = parseFloat($(this).val()) * 1e18;
		let _return = 0;

		if (value === 0 || Number.isNaN(value)) {
			$('#transfer-hint').text("");
			_return = 0;
			return;
		}

		if (value > 0) {
			let _return = (_myTokens - (value / 1e18));

			if (_return < 0) {
				$('#transfer-hint').text("You do not have enough " + _symbol + "!");
			} else {
				$('#transfer-hint').text("You will have : " + numberWithCommas((_return).toFixed(_toShow)) + " " + _symbol + " remaining!");
			}
		}
	});

	// WHAT-YOU-GET PREDICTOR
}

function maxWalletAmount() {
	var amount = (_tokensInUserWallet / 1e18);
	return (exactNumber(amount, _places));
}

function maxStakedAmount() {
	var amount = _myTokens;
	return (exactNumber(amount, _places));
}

function usernameOf(_addressToCheck) {
	console.log("User Address is " + _addressToCheck);
	namesInstance.getNameByAddress.call(_addressToCheck, function (error, result) {
		console.log("User who just did that is " + result);
		if (result.length == 0) {
			_userName = "Someone";
		} else {
			_userName = result;
		}
	});
}

function addressOf(userName) {
	namesInstance.getAddressByName.call(userName, function (error, result) {
		console.log(result);
		if (result == "0x0000000000000000000000000000000000000000") {
			return "-";
		} else {
			return result;
		}
	});
}

// EVENTS: The notifications system for the web UI - watches chain for 1 block
function attachEvents() {
	// Always start from 1 block behind
	web3.eth.getBlockNumber(function (error, result) {
		console.log("Current Block Number is", result);
		vaultInstance.allEvents({
			fromBlock: result - 1,
		}, function (e, result) {
			let currentUserEvent = web3.eth.accounts[0] == result.args["_user"];
			switch (result.event) {
				// Deposit notification - All users
				case 'onDeposit':
					if (currentUserEvent) {
						$("#depositAmount").val("");
						$("#depositAmount").trigger("change");

						let _x = numberWithCommas((result.args._deposited.div(1e18) * 0.9).toFixed(_toShow));
						let _y = numberWithCommas(result.args.tokensRewarded.div(1e18).toFixed(_toShow));

						alertify.success('💸 Success! 💰');
					} else {
						var _resultAddr = result.args["_user"];
						var _resultBals = numberWithCommas((result.args._deposited.div(1e18)).toFixed(_toShow));

						namesInstance.getNameByAddress(_resultAddr, function (error, result) {
							console.log("User who just did that is " + result);
							if (result.length == 0) {
								alertify.success("💸 Dividends! Someone deposited " + _resultBals + " " + _symbol);
							} else {
								alertify.success("💸 Dividends! " + result + " deposited " + _resultBals + " " + _symbol);
							}
						});
					}

					break;

					// Withdraw notification - All users
				case 'onResolve':
					if (currentUserEvent) {
						$("#withdrawAmount").val("");
						$("#withdrawAmount").trigger("change");

						alertify.success('💸 Success! 💰');
					} else {
						var _resultAddr = result.args["_user"];
						var _resultBals = numberWithCommas((result.args._liquidated.div(1e18) * 0.9).toFixed(_toShow));

						namesInstance.getNameByAddress(_resultAddr, function (error, result) {
							console.log("User who just did that is " + result);
							if (result.length == 0) {
								alertify.success("💸 Dividends! 💸");
							} else {
								alertify.success("💸 Dividends! 💸");
							}
						});
					}

					break;

					// Harvest notification - User only
				case 'onWithdraw':
					if (currentUserEvent) {
						alertify.success('🚜 Harvested ↗');
					}
					break;

					// Transfer notification - User only
				case 'onTransfer':
					if (currentUserEvent) {
						$("#transferAmount").trigger("change");
						alertify.success('💸 Success! 💰');
					}
					break;
			}
		})
	})
}