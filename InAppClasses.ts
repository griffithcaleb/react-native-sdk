'use strict';

enum IterableInAppTriggerType {
    immediate = 0,
    event = 1,
    never = 2,
}

class IterableInAppTrigger {
    type: IterableInAppTriggerType
    dict: any

    constructor(type: IterableInAppTriggerType, dict: any) {
        this.type = type
        this.dict = dict
    }

    static fromDict(dict: any): IterableInAppTrigger {
        const type = dict["type"] as IterableInAppTriggerType
        if (type) {
            return new IterableInAppTrigger(type, dict)
        } else {
            return new IterableInAppTrigger(IterableInAppTriggerType.immediate, dict)
        }
    }
}

enum IterableInAppContentType {
    html = 0,
    alert = 1,
    banner = 2,
}

class IterableEdgeInsets {
    top: number
    left: number
    bottom: number
    right: number

    constructor(top: number, left: number, bottom: number, right: number) {
        this.top = top
        this.left = left
        this.bottom = bottom
        this.right = right
    }

    static fromDict(dict: any): IterableEdgeInsets {
        return new IterableEdgeInsets(dict["top"] as number, dict["left"] as number, dict["bottom"] as number, dict["right"] as number)
    }
}

interface IterableInAppContent {
    type: IterableInAppContentType
}

class IterableHtmlInAppContent implements IterableInAppContent {
    type: IterableInAppContentType = IterableInAppContentType.html
    edgeInsets: IterableEdgeInsets
    backgroundAlpha: number
    html: String

    constructor(edgeInsets: IterableEdgeInsets, backgroundAlpha: number, html: String) {
        this.edgeInsets = edgeInsets
        this.backgroundAlpha = backgroundAlpha
        this.html = html
    }

    static fromDict(dict: any): IterableHtmlInAppContent {
        return new IterableHtmlInAppContent(
            IterableEdgeInsets.fromDict(dict["edgeInsets"]), 
            dict["backgroundAlpha"] as number, 
            dict["html"] as String)
    }
}

class IterableInboxMetadata {
    title?: String
    subTitle?: String
    icon?: String

    constructor(title: String | undefined, subTitle: String | undefined, icon: String | undefined) {
        this.title = title
        this.subTitle = subTitle
        this.icon = icon
    }

    static fromDict(dict: any): IterableInboxMetadata {
        return new IterableInboxMetadata(dict["title"], dict["subtitle"], dict["icon"])
    }
}

class IterableInAppMessage {
    readonly messageId: String
    readonly campaignId: String
    readonly trigger: IterableInAppTrigger
    readonly createdAt?: Date
    readonly expiresAt?: Date
    readonly content: IterableInAppContent
    readonly saveToInbox: Boolean
    readonly inboxMetadata: IterableInboxMetadata
    readonly customPayload?: any
    readonly read: Boolean

    constructor(messageId: String, 
        campaignId: String, 
        trigger: IterableInAppTrigger, 
        createdAt: Date | undefined, 
        expiresAt: Date | undefined, 
        content: IterableInAppContent, 
        saveToInbox: Boolean, 
        inboxMetadata: IterableInboxMetadata,
        customPayload: any | undefined,
        read: Boolean) {
            this.campaignId = campaignId
            this.messageId = messageId
            this.trigger = trigger
            this.createdAt = createdAt
            this.expiresAt = expiresAt
            this.content = content
            this.saveToInbox = saveToInbox
            this.inboxMetadata = inboxMetadata
            this.customPayload = customPayload
            this.read = read
    }

    isSilentInbox(): Boolean {
        return this.saveToInbox && this.trigger.type == IterableInAppTriggerType.never
    }

    static fromDict(dict: any): IterableInAppMessage {
        const messageId = dict["messageId"] as String
        const campaignId = dict["campaignId"] as String
        const trigger = IterableInAppTrigger.fromDict(dict["trigger"])
        let createdAt = dict["createdAt"] 
        if (createdAt) {
            createdAt = new Date(createdAt as number)
        }
        let expiresAt = dict["expiresAt"] 
        if (expiresAt) {
            expiresAt = new Date(expiresAt as number)
        }
        let content = IterableHtmlInAppContent.fromDict(dict["content"])
        let saveToInbox = dict["saveToInbox"] as Boolean
        let inboxMetadata = IterableInboxMetadata.fromDict(dict["inboxMetadata"])
        let customPayload = dict["customPayload"]
        let read = dict["read"] as Boolean

        return new IterableInAppMessage(
            messageId,
            campaignId,
            trigger,
            createdAt,
            expiresAt,
            content,
            saveToInbox,
            inboxMetadata,
            customPayload,
            read
        )
    }        
}

export { IterableInAppMessage }