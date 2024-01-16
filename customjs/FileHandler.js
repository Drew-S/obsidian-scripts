class FileHandler {

    async open(path) {
        const basePath = app.fileManager.vault.adapter.basePath
        const f = await app.fileManager.vault.adapter.fsPromises.open([basePath, path].join("/"), "r")

        return f
    }

    async readFile(path) {
        const f = await this.open(path)

        const data = await f.read()
        const content = data.buffer.toString("utf-8")

        await f.close()

        return content
    }

    async *readLines(path) {
        const basePath = app.fileManager.vault.adapter.basePath
        const fileStream = app.fileManager.vault.adapter.fs.createReadStream([basePath, path].join("/"))

        const content = await this.readFile(path)
        for await (const line of content.split("\n")) {
            yield line
        }
    }
}