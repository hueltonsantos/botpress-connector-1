import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import {
    IDepartment,
    ILivechatRoom,
    ILivechatTransferData,
    IVisitor,
} from "@rocket.chat/apps-engine/definition/livechat";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { AppSetting, DefaultMessage } from "../config/Settings";
import { Logs } from "../enum/Logs";
import { createMessage } from "./Message";
import { getAppSettingValue } from "./Setting";

export const updateRoomCustomFields = async (
    rid: string,
    data: any,
    read: IRead,
    modify: IModify
): Promise<any> => {
    if (!rid) {
        return;
    }
    const room = await read.getRoomReader().getById(rid);
    if (!room) {
        throw new Error(`${Logs.INVALID_ROOM_ID} ${rid}`);
    }

    const botUserName = await getAppSettingValue(
        read,
        AppSetting.BotpressBotUsername
    );
    if (!botUserName) {
        throw new Error(Logs.EMPTY_BOT_USERNAME_SETTING);
    }

    const user = await read.getUserReader().getByUsername(botUserName);
    if (!user) {
        throw new Error(Logs.INVALID_BOT_USERNAME_SETTING);
    }

    let { customFields = {} } = room;
    customFields = Object.assign(customFields, data);
    const roomBuilder = await modify.getUpdater().room(rid, user);
    roomBuilder.setCustomFields(customFields);

    try {
        return modify.getUpdater().finish(roomBuilder);
    } catch (error) {
        throw new Error(error);
    }
};

export const closeChat = async (modify: IModify, read: IRead, rid: string) => {
    const room: IRoom = (await read.getRoomReader().getById(rid)) as IRoom;
    if (!room) {
        throw new Error(Logs.INVALID_ROOM_ID);
    }

    const closeChatMessage = await getAppSettingValue(
        read,
        AppSetting.BotpressCloseChatMessage
    );

    const result = await modify
        .getUpdater()
        .getLivechatUpdater()
        .closeRoom(
            room,
            closeChatMessage
                ? closeChatMessage
                : DefaultMessage.DEFAULT_BotpressCloseChatMessage
        );
    if (!result) {
        throw new Error(Logs.CLOSE_CHAT_REQUEST_FAILED_ERROR);
    }
};

export const performHandover = async (
    app: IApp,
    modify: IModify,
    read: IRead,
    rid: string,
    visitorToken: string,
    targetDepartmentName?: string | null
) => {
    const room: ILivechatRoom = (await read
        .getRoomReader()
        .getById(rid)) as ILivechatRoom;
    if (!room) {
        throw new Error(Logs.INVALID_ROOM_ID);
    }

    const visitor: IVisitor = (await read
        .getLivechatReader()
        .getLivechatVisitorByToken(visitorToken)) as IVisitor;
    if (!visitor) {
        throw new Error(Logs.INVALID_VISITOR_TOKEN);
    }

    const livechatTransferData: ILivechatTransferData = {
        currentRoom: room,
    };

    const targetDepartment =
        targetDepartmentName ||
        (await getAppSettingValue(
            read,
            AppSetting.BotpressDefaultHandoverDepartment
        ));
    if (!targetDepartment) {
        throw new Error(
            Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST
        );
    }

    const departmentDB: IDepartment = (await read
        .getLivechatReader()
        .getLivechatDepartmentByIdOrName(targetDepartment)) as IDepartment;
    if (!departmentDB) {
        throw new Error(Logs.INVALID_DEPARTMENT_NAME);
    }

    livechatTransferData.targetDepartment = departmentDB.id;

    const serviceOnline = await read
        .getLivechatReader()
        .isOnlineAsync(livechatTransferData.targetDepartment);
    if (!serviceOnline) {
        const offlineMessage: string = await getAppSettingValue(
            read,
            AppSetting.BotpressHandoverFailedMessage
        );
        if (offlineMessage && offlineMessage.trim()) {
            await createMessage(app, rid, read, modify, {
                text: offlineMessage,
            });
        }
        return false;
    }

    const handoverMessage: string = await getAppSettingValue(
        read,
        AppSetting.BotpressHandoverMessage
    );

    await createMessage(app, rid, read, modify, { text: handoverMessage });

    const result = await modify
        .getUpdater()
        .getLivechatUpdater()
        .transferVisitor(visitor, livechatTransferData)
        .catch((error) => {
            throw new Error(`${Logs.HANDOVER_REQUEST_FAILED_ERROR} ${error}`);
        });
    if (!result) {
        const offlineMessage: string = await getAppSettingValue(
            read,
            AppSetting.BotpressServiceUnavailableMessage
        );

        if (offlineMessage && offlineMessage.trim()) {
            await createMessage(app, rid, read, modify, {
                text: offlineMessage,
            });
        }
        return false;
    }

    return true;
};
