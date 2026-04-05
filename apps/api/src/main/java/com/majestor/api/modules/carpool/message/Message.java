package com.majestor.api.modules.carpool.message;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private MessageStatus messageStatus;
}
