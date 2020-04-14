import jot from 'jot';
import * as yup from 'yup';
import { JsonData } from './json';

/**
 * Object defining input and output types of all messages accepted by the
 * collaboration server.
 */
export type ServerMessages = {
  AUTHENTICATE: (data: {
    clientIdentity: JsonData,
  }) => {
    id: string;
  },

  JOIN_SESSION: (data: {
    resourceType: string;
    resourceId: string;
  }) => {
    id: string;
    version: number;
    value: jot.Document;
    meta: jot.Meta;
    participants: {
      id: string;
      identity: JsonData;
      color: number;
    }[];
  },

  START_SESSION: (data: {
    resourceType: string;
    resourceId: string;
    resourceValue: jot.Document;
  }) => {
    id: string;
    version: number;
    meta: jot.Meta;
    participants: {
      id: string;
      identity: JsonData;
      color: number;
    }[];
  },

  LEAVE_SESSION: (data: {
    sessionId: string;
  }) => {

  },

  UPDATE_RESOURCE: (data: {
    sessionId: string;
    update: {
      base: number;
      operation: jot.OpJson;
    };
  }) => {
    version: number;
  },
};

/**
 * Union of all server message types.
 */
export type ServerMessageType = keyof ServerMessages;

/**
 * Data type the server returns given a message type.
 */
export type ServerMessageData<T extends ServerMessageType> = Parameters<ServerMessages[T]>[0];

/**
 * Data type the server returns given a message type.
 */
export type ServerResponse<T extends ServerMessageType> = ReturnType<ServerMessages[T]>;

/**
 * Message shape the server expects given a message type.
 */
export type ServerMessage<T extends ServerMessageType> =
  { type: T, data: Parameters<ServerMessages[T]>[0] };


/**
 * Object defining input and output types of all messages accepted by the
 * collaboration client.
 */
export type ClientMessages = {
  ADD_PARTICIPANT: (data: {
    sessionId: string;
    participantId: string;
    participantIdentity: JsonData;
    participantColor: number;
  }) => {

  },

  REMOVE_PARTICIPANT: (data: {
    sessionId: string;
    participantId: string;
  }) => {

  },

  UPDATE_RESOURCE: (data: {
    sessionId: string;
    participantId: string;
    update: {
      version: number;
      operation: jot.OpJson;
    };
  }) => {

  }
};

/**
 * Union of all client message types.
 */
export type ClientMessageType = keyof ClientMessages;

/**
 * Data type the client expects given a message type.
 */
export type ClientMessageData<T extends ClientMessageType> = Parameters<ClientMessages[T]>[0];

/**
 * Data type the client returns given a message type.
 */
export type ClientResponse<T extends ClientMessageType> = ReturnType<ClientMessages[T]>;

/**
 * Message shape the client expects given a message type.
 */
export type ClientMessage<T extends ClientMessageType> = { type: T, data: ClientMessageData<T> };

/**
 * Message is a higher level data container. It holds instructions
 * for collaboration platform: type of interaction and interaction-
 * specific data.
 */
export type Message = {
  type: string;
  data: JsonData;
};

/**
 * Encoded packets are passed as string messages through web sockets.
 * "uid" contains random-looking, ideally unique strings identifying
 * messages, so that corresponding responses can be linked.
 * "message" contains proper collaboration data.
 */
export type RequestPacket = {
  uid: string;
  message: JsonData;
};

/**
 * Response packet. "responseTo" references "uid" of RequestPacket.
 */
export type ResponsePacket = {
  responseTo: string;
  data: JsonData;
};

/**
 * Validates the shape of a request packet.
 */
export const requestPacketValidator = yup.object().required().shape({
  uid: yup.string().required(),
  message: yup.mixed<JsonData>().defined(),
});

/**
 * Validates the shape of a response packet.
 */
export const responsePacketValidator = yup.object().required().shape({
  responseTo: yup.string().required(),
  data: yup.mixed<JsonData>().defined(),
});

/**
 * Validates the shape of a message.
 */
export const messageValidator = yup.object().required().shape({
  type: yup.string().required(),
  data: yup.mixed<JsonData>().defined(),
});

/**
 * Validates response data to check if an error occurred.
 */
export const errorDataValidator = yup.object().required().shape({
  error: yup.object().required().shape({
    name: yup.string().defined(),
    message: yup.string().defined(),
  }),
});
