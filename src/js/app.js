App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    miner: "0x0000000000000000000000000000000000000000",
    minerName: null,
    mineInformation: null,
    mineLatitude: null,
    mineLongitude: null,
    itemNotes: null,
    itemPrice: 0,
    productPrice: 0,
    manufacturer: "0x0000000000000000000000000000000000000000",
    retailer: "0x0000000000000000000000000000000000000000",
    customer: "0x0000000000000000000000000000000000000000",

    init: async () => {
        App.readForm();
        return await App.initWeb3();
        /// Setup access to blockchain
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.miner = $("#miner").val();
        App.minerName = $("#minerName").val();
        App.mineInformation = $("#mineInformation").val();
        App.mineLatitude = $("#mineLatitude").val();
        App.mineLongitude = $("#mineLongitude").val();
        App.itemNotes = $("#itemNotes").val();
        App.itemPrice = $("#itemPrice").val();
        App.productPrice = $("#productPrice").val();
        App.manufacturer = $("#manufacturer").val();
        App.masterjeweler = $("#masterjeweler").val();
        App.retailer = $("#retailer").val();
        App.customer = $("#customer").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.miner, 
            App.minerName, 
            App.mineInformation, 
            App.mineLatitude, 
            App.mineLongitude, 
            App.itemNotes, 
            App.itemPrice, 
            App.manufacturer, 
            App.retailer, 
            App.customer
        );
    },

    initWeb3: async () => {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access");
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            console.log('Using localhost ganache as provider!');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
        $(document).on('change', App.handleChange);
    },

    handleChange: async (event) => {
        var processId = parseInt($(event.target).data('id'));
        if (processId == 24) {
            const file = event.target.files[0];
            $('#selectedIpfsFile').val(file.name);
            console.log(file);
        }
    },

    handleButtonClick: async (event) => {
        App.getMetaskAccountID();
        
        App.readForm();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch (processId) {
            case 0:
                return await App.giveMeAllRoles(event);
            case 1:
                return await App.mineItem(event);
            case 2:
                return await App.sellItem(event);
            case 3:
                return await App.buyItem(event)
            case 4:
                return await App.sendItem(event);
            case 5:
                return await App.receiveItem(event);
            case 6:
                return await App.sendItemToCut(event);
            case 7:
                return await App.receiveItemToCut(event);
            case 8:
                return await App.cutItem(event);
            case 9:
                return await App.returnCutItem(event);
            case 10:
                return await App.receiveCutItem(event);
            case 11:
                return await App.markForPurchasing(event);
            case 12:
                return await App.sendItemForPurchasing(event);
            case 13:
                return await App.receiveItemForPurchasing(event);
            case 14:
                return await App.putUpForPurchasing(event);
            case 15:
                return await App.purchaseItem(event);
            case 16:
                return await App.fetchItem(event);
            case 17:
                return await App.fetchItemBufferOne(event);
            case 18:
                return await App.fetchItemBufferTwo(event);
            case 19:
                $('#file-input').click();
                break;
            case 20:
                return await App.readHash(event);
        }
    },
    giveMeAllRoles: async(event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed(); 
            const result = await instance.giveMeAllRoles();
            console.log('giveMeAllRoles', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    mineItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed(); 
            const result = await instance.mineItem(
                App.upc, 
                App.minerName, 
                App.mineInformation, 
                App.mineLatitude, 
                App.mineLongitude, 
                App.itemNotes  
            );
            console.log('mineItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    sellItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            let itemPrice = web3.toWei(App.itemPrice, "ether");
            let result = await instance.sellItem(App.upc, itemPrice);
            console.log('sellItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    buyItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            let value = Number(prompt("Please enter value to send in ether"));
            if (value > 0) {
                const walletValue = web3.toWei(value, "ether");
                const result = await instance.buyItem(App.upc, {value: walletValue});
                console.log('buyItem', result);
            }
        } catch(err) {
            console.log(err.message);
        };
    },

    sendItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.sendItem(App.upc);
            console.log('sendItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    receiveItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveItem(App.upc);
            console.log('receiveItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    sendItemToCut: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.sendItemToCut(App.upc, App.masterjeweler);
            console.log('sendItemToCut', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    receiveItemToCut: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveItemToCut(App.upc);
            console.log('receiveItemToCut', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    cutItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.cutItem(App.upc);
            console.log('cutItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    returnCutItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.returnCutItem(App.upc);
            console.log('returnCutItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    receiveCutItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveCutItem(App.upc);
            console.log('receiveCutItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    markForPurchasing: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            let productPrice = web3.toWei(App.productPrice, "ether");
            const result = await instance.markForPurchasing(App.upc, productPrice);
            console.log('markForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },    

    sendItemForPurchasing: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.sendItemForPurchasing(App.upc, App.retailer);
            console.log('sendItemForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    receiveItemForPurchasing: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveItemForPurchasing(App.upc);
            console.log('receiveItemForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    putUpForPurchasing: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.putUpForPurchasing(App.upc);
            console.log('putUpForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    purchaseItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            let value = Number(prompt("Please enter value to send in ether"));
            if (value > 0) {
                const walletValue = web3.toWei(value, "ether");
                const result = await instance.purchaseItem(App.upc, {value: walletValue});
                console.log('purchaseItem', result);
            }
        } catch(err) {
            console.log(err.message);
        };
    },

    fetchItem: async (event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.fetchItem(App.upc);
            console.log('fetchItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    fetchItemBufferOne: async () => {
        App.upc = $('#upc').val();
        console.log('upc', App.upc);
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.fetchItemBufferOne.call(App.upc);
            App.consoleLogfetchItemBufferOne(result);
            App.updateFieldsBufferOne(result);
        } catch(err) {
          console.log(err.message);
        };
    },

    fetchItemBufferTwo: async () => {
        try {                
            const instance = await App.contracts.SupplyChain.deployed();
            let result = await instance.fetchItemBufferTwo.call(App.upc);
            App.consoleLogfetchItemBufferTwo(result);
            App.updateFieldsBufferTwo(result);
        } catch(err) {
          console.log(err.message);
        };
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
    },
    
    uploadHash: async(hash) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.uploadHash(App.upc, hash);
            console.log('uploadHash', result);
        } catch(err) {
            console.log
            console.log(err.message);
        };
    },

    readHash: async(event) => {
        try {
            event.preventDefault();
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.readHash.call(App.upc);
            $('#selectedIpfsFile').val(result);
            console.log('readHash', result);
        } catch(err) {
            console.log(err.message);
        }
    },

    consoleLogfetchItemBufferOne: (result) => {
        console.log('sku:' + Number(result[0]));
        console.log('upc:' + Number(result[1]));
        console.log('owner:' + result[2]);
        console.log('miner:' + result[3]);
        console.log('minerName:' + result[4]);
        console.log('mineInformation:' + result[5]);
        console.log('mineLatitude:' + result[6]);
        console.log('mineLongitude:' + result[7]);
    },

    consoleLogfetchItemBufferTwo: (result) => {
        console.log('sku:' + Number(result[0]));
        console.log('upc:' + Number(result[1]));
        console.log('productID:' + Number(result[2]));
        console.log('itemNotes:' + result[3]);
        console.log('itemPrice:' + web3.fromWei(result[4], "ether"));
        console.log('productPrice:' + web3.fromWei(result[5], "ether"));
        console.log('itemState:' + Number(result[6]));
        console.log('manufacturer:' + result[7]);
        console.log('masterjeweler:' + result[8]);
        console.log('retailer:' + result[9]);
        console.log('customer:' + result[10]);
    },

    updateFieldsBufferOne: (result) => {
        $("#sku").val(Number(result[0]));
        $("#upc").val(Number(result[1]));
        $("#ownerID").val(result[2]);
        $("#miner").val(result[3]);
        $("#minerName").val(result[4]);
        $("#mineInformation").val(result[5]);
        $("#mineLatitude").val(result[6]);
        $("#mineLongitude").val(result[7]);
    },

    updateFieldsBufferTwo: (result) => {
        $("#sku").val(Number(result[0]));
        $("#upc").val(Number(result[1]));
        $("#itemNotes").val(result[3]);
        $("#itemPrice").val(web3.fromWei(result[4], "ether"));
        $("#productPrice").val(web3.fromWei(result[5], "ether"));
        $("#manufacturer").val(result[7]);
        $("#masterjeweler").val(result[8]);
        $("#retailer").val(result[9]);
        $("#customer").val(result[10]);
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
