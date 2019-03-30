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
    },

    handleButtonClick: async (event) => {
        event.preventDefault();

        App.getMetaskAccountID();
        
        App.readForm();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.mineItem(event);
                break;
            case 2:
                return await App.sellItem(event);
                break;
            case 3:
                return await App.buyItem(event)
                break;
            case 4:
                return await App.sendItem(event);
                break;
            case 5:
                return await App.receiveItem(event);
                break;
            case 6:
                return await App.sendItemToCut(event);
                break;
            case 7:
                return await App.receiveItemToCut(event);
                break;
            case 8:
                return await App.cutItem(event);
                break;
            case 9:
                return await App.returnCutItem(event);
                break;
            case 10:
                return await App.receiveCutItem(event);
                break;
            case 11:
                return await App.markForPurchasing(event);
                break;
            case 12:
                return await App.sendItemForPurchasing(event);
                break;
            case 13:
                return await App.receiveItemForPurchasing(event);
                break;
            case 14:
                return await App.putUpForPurchasing(event);
                break;
            case 15:
                return await App.purchaseItem(event);
                break;
            case 16:
                return await App.fetchItem(event);
                break;  
            case 17:
                return await App.fetchItemBufferOne(event);
                break;
            case 18:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },
    
    mineItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed(); 
            alert(`hi! ${App.upc}/${App.minerName}/${App.mineInformation}/${App.mineLatitude}/${App.mineLongitude}/${App.itemNotes}`);
            const result = await instance.mineItem(
                App.upc, 
                App.minerName, 
                App.mineInformation, 
                App.mineLatitude, 
                App.mineLongitude, 
                App.itemNotes  
            );
            $("#ftc-item").text(result);
            console.log('mineItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    sellItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            let itemPrice = web3.toWei(App.itemPrice, "ether");
            let result = await instance.sellItem(App.upc, itemPrice);
            $("#ftc-item").text(result);
            console.log('sellItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    buyItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            let value = Number(prompt("Please enter value to send in ether"));
            if (value > 0) {
                const walletValue = web3.toWei(value, "ether");
                const result = await instance.buyItem(App.upc, {value: walletValue});
                $("#ftc-item").text(result);
                console.log('buyItem', result);
            }
        } catch(err) {
            console.log(err.message);
        };
    },

    sendItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.sendItem(App.upc);
            $("#ftc-item").text(result);
            console.log('sendItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    receiveItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveItem(App.upc);
            $("#ftc-item").text(result);
            console.log('receiveItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    sendItemToCut: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.sendItemToCut(App.upc, App.masterjeweler);
            $("#ftc-item").text(result);
            console.log('sendItemToCut', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    receiveItemToCut: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveItemToCut(App.upc);
            $("#ftc-item").text(result);
            console.log('receiveItemToCut', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    cutItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.cutItem(App.upc);
            $("#ftc-item").text(result);
            console.log('cutItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    returnCutItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.returnCutItem(App.upc);
            $("#ftc-item").text(result);
            console.log('returnCutItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    receiveCutItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveCutItem(App.upc);
            $("#ftc-item").text(result);
            console.log('receiveCutItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    markForPurchasing: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            let productPrice = web3.toWei(App.productPrice, "ether");
            const result = await instance.markForPurchasing(App.upc, productPrice);
            $("#ftc-item").text(result);
            console.log('markForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },    

    sendItemForPurchasing: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.sendItemForPurchasing(App.upc, App.retailer);
            $("#ftc-item").text(result);
            console.log('sendItemForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    receiveItemForPurchasing: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.receiveItemForPurchasing(App.upc);
            $("#ftc-item").text(result);
            console.log('receiveItemForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    putUpForPurchasing: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.putUpForPurchasing(App.upc);
            $("#ftc-item").text(result);
            console.log('putUpForPurchasing', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    purchaseItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            let value = Number(prompt("Please enter value to send in ether"));
            if (value > 0) {
                const walletValue = web3.toWei(value, "ether");
                const result = await instance.purchaseItem(App.upc, {value: walletValue});
                $("#ftc-item").text(result);
                console.log('purchaseItem', result);
            }
        } catch(err) {
            console.log(err.message);
        };
    },

    fetchItem: async (event) => {
        try {
            const instance = await App.contracts.SupplyChain.deployed();
            const result = await instance.fetchItem(App.upc);
            $("#ftc-item").text(result);
            console.log('fetchItem', result);
        } catch(err) {
            console.log(err.message);
        };
    },

    fetchItemBufferOne: function () {
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
          console.log(result[4].toString());
        }).catch(function(err) {
          console.log(err.message);
        });
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
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
