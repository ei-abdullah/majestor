export type NotificationType =
    | 'RIDE_BOOKED'
    | 'RIDE_ACCEPTED'
    | 'RIDE_REJECTED'
    | 'RIDE_COMPLETED'
    | 'RIDE_CANCELLED'
    | 'STUDY_GROUP_INVITE'
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
    createdAt: string;
}