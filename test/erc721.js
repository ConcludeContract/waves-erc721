const wvs = 1e8

describe('ERC721', () => {
    before(async() => {
        await setupAccounts({
            token: 0.01 * wvs,
            sender: 0.1 * wvs,
            recipient: 0.1 * wvs
        })
        const compiledDapp = compile(file('erc721.ride'))
        const tokenAddress = address(accounts.token)

        const dAppTx = setScript({script: compiledDapp}, accounts.token)
        await broadcast(dAppTx)
        await waitForTx(dAppTx.id)

        const tx = invokeScript({
            dApp: address(accounts.token),
            call: {
                function: "mint",
                args: [{
                    type: "string",
                    value: address(accounts.sender)
                }, {
                    type: "integer",
                    value: 1
                }]
            }
        }, accounts.sender);

        await broadcast(tx)
        await waitForTx(tx.id)
    })

    it('should correct mint execution', async () => {
        const tx = invokeScript({
            dApp: address(accounts.token),
            call: {
                function: "mint",
                args: [{
                    type: "string",
                    value: address(accounts.sender)
                }, {
                    type: "integer",
                    value: 2
                }]
            }
        }, accounts.sender);

        await broadcast(tx)
        await waitForTx(tx.id)
    })

    it('should correct burn execution', async () => {
        const tx = invokeScript({
            dApp: address(accounts.token),
            call: {
                function: "burn",
                args: [{
                    type: "integer",
                    value: 2
                }]
            }
        }, accounts.sender);

        await broadcast(tx)
        await waitForTx(tx.id)
    })

    it('should correct transfer execution', async () => {
        const tx = invokeScript({
            dApp: address(accounts.token),
            call: {
                function: "transfer",
                args: [{
                    type: "string",
                    value: address(accounts.recipient)
                }, {
                    type: "integer",
                    value: 1
                }]
            }
        }, accounts.sender);

        await broadcast(tx)
        await waitForTx(tx.id)
    })

    it('should correct transferFrom execution', async () => {
        const approve = invokeScript({
            dApp: address(accounts.token),
            call: {
                function: "approve",
                args: [{
                    type: "string",
                    value: address(accounts.sender)
                }, {
                    type: "integer",
                    value: 1
                }]
            }
        }, accounts.recipient);

        await broadcast(approve)
        await waitForTx(approve.id)

        const transferFrom = invokeScript({
            dApp: address(accounts.token),
            call: {
                function: "transferFrom",
                args: [{
                    type: "string",
                    value: address(accounts.recipient)
                }, {
                    type: "string",
                    value: address(accounts.sender)
                }, {
                    type: "integer",
                    value: 1
                }]
            }
        }, accounts.sender);

        await broadcast(transferFrom)
        await waitForTx(transferFrom.id)
    })

    it('should reject setScript', async () => {
        const tx = setScript({script: null}, accounts.token)
        await expect(broadcast(tx)).rejectedWith()
    })
})