const { moveBlocks } = require("../utils/move-blocks")
const BLOCKS = 2
const SLEEP_AMOUNT = 1000

;(async () => {
    await moveBlocks(BLOCKS, SLEEP_AMOUNT)
})()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
