const contractDefinition = artifacts.require('MinerRole');
const expect = require('chai').expect;

contract('MinerRole', accounts => {
    let contractInstante;
    let owner = accounts[0];
    let user2 = accounts[1];
    let user3 = accounts[2];

    describe('Test Suite: addMiner & isMiner', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
        });

        it('should set the contract deployer to be the first miner', async() => {
            expect(await contractInstante.isMiner(owner)).to.be.true;
            expect(await contractInstante.isMiner(user2)).to.be.false;
        });

        it('should not allow unauthorized users to add miners', async() => {
            expectToThrow(contractInstante.addMiner(accounts[7], {from: user2}), 'Error', 'Only a miner can add another miner');
            expect(await contractInstante.isMiner(accounts[7])).to.be.false;
        });
        
        it('should only allow a miner to add another miners', async() => {
            await contractInstante.addMiner(user2, {from: owner});
            expect(await contractInstante.isMiner(user2)).to.be.true;

            expect(await contractInstante.isMiner(user3)).to.be.false;
            await contractInstante.addMiner(user3, {from: user2});
            expect(await contractInstante.isMiner(user3)).to.be.true;
        });
    });

    describe('Test Suite: renounceMiner', () => {
        before(async() => {
            contractInstante = await contractDefinition.new({from: owner});
            console.log('new contract!');
        });

        it('should renounce the miner and verify this', async() => {
            await contractInstante.addMiner(user3, {from: owner});
            expect(await contractInstante.isMiner(user3)).to.be.true;

            await contractInstante.renounceMiner({from: user3});
            expect(await contractInstante.isMiner(user3)).to.be.false;
        });

        it('should lock the miners and contract if all miners have left', async() => {
            expect(await contractInstante.isMiner(owner)).to.be.true;
            await contractInstante.renounceMiner({from: owner});
            expect(await contractInstante.isMiner(owner)).to.be.false;
            expectToThrow(contractInstante.addMiner(user2, {from: owner}), 'Error', 'Only a miner can add another miner');                
        });
    });

});

var expectToThrow = async(promise, errorType, errorMessage) => {
    try {
        await promise;
    }
    catch(error){
        expect(error).to.be.an(errorType);
        expect(error.message).to.have.string(errorMessage);
        return;
    }
    assert.fail(`Expected to throw an ${errorType} with message ${errorMessage}`);
}