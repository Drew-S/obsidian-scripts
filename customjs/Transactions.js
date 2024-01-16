/*

transaction {
    date: string // "YYYY-MM-DD"
    from: string
    to: string
    amount: number
}

*/

class Transactions {
    async getTransactions() {
        function processBlock(block, aliases) {
            console.log(block)
            const lines = block.split('\n').map(line => line.trim())
            const date = lines[0].split(' ')[0]
            const memo = lines[0].split(' ')[1]

            console.log(lines)

            const transactions = []
            for (let i = 1; i < lines.length; i++) {
                if (lines.length == 0)
                    continue

                const parts = lines[i].split(/\s+/)
                const type = parts[0].split(':', 1)[0]
                const account = aliases[type] || type
                const amount = parseFloat(parts[1].replace('$', ''))

                transactions.push({
                    date: date,
                    from: "Income:Opening Balance",
                    to: `${account}:${parts[0].split(':', 1)[1]}`,
                    amount: amount
                })
            }

            return transactions
        }
        const { FileHandler } = customJS

        let aliases = {}

        let transactions = []

        let block = ""

        for await (const line of FileHandler.readLines("Personal/Transactions.ledger")) {
            if (/^;/.test(line))
                continue

            if (line.startsWith("alias") && /alias \w=[a-zA-Z0-9:]+/.test(line)) {
                const [k, v] = line.split(" ")[1].split("=")
                if (!aliases[k])
                    aliases[k] = v

                continue
            }

            if ((/^\d{4}\/\d{2}\/\d{2}.*/.test(line) || line == "\eof") && block.length > 0) {
                transactions = [...transactions, ...processBlock(block, aliases)]
                block = line
                continue
            }
            block += "\n" + line

        }
        transactions = [...transactions, ...processBlock(block, aliases)]
        return transactions
    }
}