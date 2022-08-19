import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    BotpressBotUsername = 'botpress_bot_username',
    BotpressServerUrl = 'botpress_server_url',
    BotpressServiceUnavailableMessage = 'botpress_service_unavailable_message',
    BotpressHandoverMessage = 'botpress_handover_message',
    BotpressCloseChatMessage = 'botpress_close_chat_message',
    BotpressEnableCallbacks = 'botpress_enable_callbacks',
    BotpressDefaultHandoverDepartment = 'botpress_target_handover_department',
    BotpressHideQuickReplies = 'botpress_hide_quick_replies',
    BotpressBotId = 'botpress_bot_id',
    BotpressHandoverFailedMessage = 'botpress_handover_failed'
}

export enum DefaultMessage {
    DEFAULT_BotpressServiceUnavailableMessage = 'Sorry, I\'m having trouble answering your question.',
    DEFAULT_BotpressHandoverMessage = 'Transferring to an online agent',
    DEFAULT_BotpressCloseChatMessage = 'Closing the chat, Goodbye',
    DEFAULT_BotpressHandoverFailedMessage = 'Something went wrong while handovering',
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.BotpressBotUsername,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        hidden: false,
        i18nLabel: 'botpress_bot_username',
        required: true,
    },
    {
        id: AppSetting.BotpressBotId,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_bot_id',
        required: true,
    },
    {
        id: AppSetting.BotpressServerUrl,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_server_url',
        required: true,
    },
    {
        id: AppSetting.BotpressServiceUnavailableMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_service_unavailable_message',
        required: false,
    },
    {
        id: AppSetting.BotpressCloseChatMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_close_chat_message',
        required: false,
    },
    {
        id: AppSetting.BotpressHandoverMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_handover_message',
        required: false,
    },
    {
        id: AppSetting.BotpressDefaultHandoverDepartment,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_default_handover_department',
        required: true,
    },
    {
        id: AppSetting.BotpressHideQuickReplies,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: false,
        value: false,
        i18nLabel: 'botpress_hide_quick_replies',
        required: true,
    },
];
