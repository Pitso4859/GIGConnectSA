-- GIGConnect SA - Initial Schema
-- V1__init_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
                       id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email         VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       full_name     VARCHAR(255) NOT NULL,
                       phone         VARCHAR(20),
                       role          VARCHAR(20)  NOT NULL DEFAULT 'WORKER' CHECK (role IN ('WORKER','CLIENT','ADMIN')),
                       avatar_url    VARCHAR(500),
                       bio           TEXT,
                       location      VARCHAR(255),
                       id_number     VARCHAR(20),
                       is_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
                       is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
                       created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                       updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── REFRESH TOKENS ───────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
                                id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token       VARCHAR(500) NOT NULL UNIQUE,
                                expires_at  TIMESTAMPTZ  NOT NULL,
                                revoked     BOOLEAN      NOT NULL DEFAULT FALSE,
                                created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── SKILLS ───────────────────────────────────────────────────────────────────
CREATE TABLE skills (
                        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        name       VARCHAR(100) NOT NULL UNIQUE,
                        category   VARCHAR(100) NOT NULL,
                        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE user_skills (
                             user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             skill_id   UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                             years_exp  INT  NOT NULL DEFAULT 0,
                             PRIMARY KEY (user_id, skill_id)
);

-- ─── JOBS ─────────────────────────────────────────────────────────────────────
CREATE TABLE jobs (
                      id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                      client_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                      worker_id    UUID         REFERENCES users(id) ON DELETE SET NULL,
                      title        VARCHAR(255) NOT NULL,
                      description  TEXT         NOT NULL,
                      category     VARCHAR(100) NOT NULL,
                      location     VARCHAR(255) NOT NULL,
                      latitude     DOUBLE PRECISION,
                      longitude    DOUBLE PRECISION,
                      budget       DECIMAL(10,2) NOT NULL CHECK (budget > 0),
                      status       VARCHAR(30)  NOT NULL DEFAULT 'OPEN'
                          CHECK (status IN ('OPEN','IN_PROGRESS','AWAITING_APPROVAL','COMPLETED','CANCELLED','DISPUTED')),
                      required_skills VARCHAR(500),
                      proof_image_url VARCHAR(500),
                      proof_location  VARCHAR(255),
                      posted_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                      accepted_at  TIMESTAMPTZ,
                      completed_at TIMESTAMPTZ,
                      updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── RATINGS ──────────────────────────────────────────────────────────────────
CREATE TABLE ratings (
                         id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         job_id     UUID         NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
                         rater_id   UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         ratee_id   UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         score      INT          NOT NULL CHECK (score BETWEEN 1 AND 5),
                         comment    TEXT,
                         created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                         UNIQUE (job_id, rater_id)
);

-- ─── WALLET ───────────────────────────────────────────────────────────────────
CREATE TABLE wallets (
                         id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         user_id    UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                         balance    DECIMAL(10,2) NOT NULL DEFAULT 100.00 CHECK (balance >= 0),
                         updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
                              id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              wallet_id       UUID         NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
                              job_id          UUID         REFERENCES jobs(id) ON DELETE SET NULL,
                              type            VARCHAR(20)  NOT NULL CHECK (type IN ('CREDIT','DEBIT','ESCROW','RELEASE','REFUND')),
                              amount          DECIMAL(10,2) NOT NULL CHECK (amount > 0),
                              description     VARCHAR(255) NOT NULL,
                              reference       VARCHAR(100) UNIQUE,
                              created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── AI CHAT HISTORY ──────────────────────────────────────────────────────────
CREATE TABLE ai_chats (
                          id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          role       VARCHAR(20)  NOT NULL CHECK (role IN ('USER','ASSISTANT')),
                          content    TEXT         NOT NULL,
                          created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_jobs_client    ON jobs(client_id);
CREATE INDEX idx_jobs_worker    ON jobs(worker_id);
CREATE INDEX idx_jobs_status    ON jobs(status);
CREATE INDEX idx_jobs_category  ON jobs(category);
CREATE INDEX idx_ratings_ratee  ON ratings(ratee_id);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_ai_chats_user  ON ai_chats(user_id);

-- ─── SEED SKILLS ──────────────────────────────────────────────────────────────
INSERT INTO skills (name, category) VALUES
                                        ('Plumbing',         'Trades'),
                                        ('Electrical',       'Trades'),
                                        ('Carpentry',        'Trades'),
                                        ('Painting',         'Trades'),
                                        ('Tiling',           'Trades'),
                                        ('Gardening',        'Home & Garden'),
                                        ('Landscaping',      'Home & Garden'),
                                        ('Cleaning',         'Home & Garden'),
                                        ('Domestic Work',    'Home & Garden'),
                                        ('Car Wash',         'Automotive'),
                                        ('Panel Beating',    'Automotive'),
                                        ('Welding',          'Manufacturing'),
                                        ('Tailoring',        'Fashion'),
                                        ('Hair Dressing',    'Beauty'),
                                        ('Catering',         'Food'),
                                        ('Moving',           'Logistics'),
                                        ('Security Guard',   'Security'),
                                        ('Tutoring',         'Education'),
                                        ('IT Support',       'Technology'),
                                        ('Photography',      'Creative');