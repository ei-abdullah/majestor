export type NotificationType =
    | 'RIDE_BOOKED'
    | 'RIDE_ACCEPTED'
    | 'RIDE_REJECTED'
    | 'RIDE_COMPLETED'
    | 'RIDE_CANCELLED'
    | 'STUDY_GROUP_INVITE'
    | 'CARPOOL_STRIKE'
    | 'CARPOOL_SUSPENDED'
    | 'PASSENGER_ARRIVED'
    | 'CARPOOL_MESSAGE'
    | 'SYSTEM';

export interface Notification {
    id: number;
    title: string;
    message: string;
    relatedId: number;
    relatedType: string;
    senderId: number;
    senderName: string;
    senderAvatar: string | null;
    notificationType: NotificationType;
    read: boolean;
    response: 'ACCEPTED' | 'REJECTED' | null;
    createdAt: string;
}
