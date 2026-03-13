package com.majestor.api.modules.chat;

public enum Status {
    JOIN,   // when the user joins the chat for the first time
    MESSAGE,    // when the user sends a message
    LEAVE   // when the user leaves the chat (logout)
}
