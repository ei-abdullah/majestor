ALTER TABLE users
    ADD COLUMN carpool_strike_count   INTEGER                     NOT NULL DEFAULT 0,
    ADD COLUMN carpool_suspended_until TIMESTAMP WITHOUT TIME ZONE;