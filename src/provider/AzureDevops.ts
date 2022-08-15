import { Embed, EmbedField, EmbedAuthor } from '../model/DiscordApi'
import { TypeParseProvder } from './BaseProvider'

export class AzureDevops extends TypeParseProvder {

    private embed: Embed

    constructor() {
        super()
        this.setEmbedColor(0x205081)
        this.embed = {}
    }

    public getName(): string {
        return 'Azure-DevOps'
    }

    public getType(): string | null {
        return this.body.eventType
    }

    public knownTypes(): string[] {
        return ['gitPush']
    }

    public async gitPush(): Promise<void> {
        const match = /(.*)\s*\(https:\/\/dev.azure.com\/.*\)$/.exec(this.body.message.text)

        if (match) {
            this.embed.title = match[1]
        } else {
            this.embed.title = this.body.message.text
        }

        this.embed.description = this.body.detailedMessage.markdown

        this.embed.author = this.extractAuthor()

        this.addEmbed(this.embed)
    }

    public extractAuthor(): EmbedAuthor {
        return {
            name: this.body.resource.pushedBy.displayName,
            icon_url: this.body.resource.pushedBy._links?.avatar?.href,
        }
    }
}