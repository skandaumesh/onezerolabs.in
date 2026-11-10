/**
 * Database schema, as ordered migrations. Each runs once. To change the schema,
 * append a new entry; never edit one that has already run on a real database.
 *
 * Kept as JS strings rather than .sql files so they are always bundled with the
 * server code, wherever it is deployed.
 */

export const migrations = [
  {
    version: 1,
    sql: `
      CREATE TABLE users (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name          text NOT NULL,
        email         text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at    timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE login_attempts (
        email        text NOT NULL,
        attempted_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX login_attempts_email_idx ON login_attempts (email, attempted_at);

      -- A lead and a client are one record at different stages, so a client's
      -- history starts from the first enquiry.
      CREATE TABLE companies (
        id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name           text NOT NULL,
        sector         text,
        website        text,
        address        text,
        services       text,
        stage          text NOT NULL DEFAULT 'new'
                       CHECK (stage IN ('new', 'contacted', 'meeting', 'proposal', 'negotiation', 'won', 'lost')),
        source         text,
        lost_reason    text,
        next_follow_up date,
        owner_id       uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at     timestamptz NOT NULL DEFAULT now(),
        updated_at     timestamptz NOT NULL DEFAULT now(),

        -- The rule that stops leads being forgotten: anything still open must
        -- have a next follow-up date. Enforced here so no code path can skip it.
        CONSTRAINT open_leads_need_follow_up
          CHECK (stage IN ('won', 'lost') OR next_follow_up IS NOT NULL)
      );
      CREATE INDEX companies_stage_idx ON companies (stage);
      CREATE INDEX companies_follow_up_idx ON companies (next_follow_up);

      CREATE TABLE contacts (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
        name       text NOT NULL,
        role       text,
        email      text,
        phone      text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX contacts_company_idx ON contacts (company_id);

      CREATE TABLE notes (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
        author_id  uuid REFERENCES users (id) ON DELETE SET NULL,
        kind       text NOT NULL DEFAULT 'conversation' CHECK (kind IN ('conversation', 'internal')),
        body       text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX notes_company_idx ON notes (company_id, created_at);

      -- RESTRICT: a client with projects cannot be deleted by accident.
      CREATE TABLE projects (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id  uuid NOT NULL REFERENCES companies (id) ON DELETE RESTRICT,
        name        text NOT NULL,
        description text,
        status      text NOT NULL DEFAULT 'planning'
                    CHECK (status IN ('planning', 'in_progress', 'client_review', 'on_hold', 'done')),
        owner_id    uuid REFERENCES users (id) ON DELETE SET NULL,
        due_date    date,
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX projects_company_idx ON projects (company_id);

      CREATE TABLE tasks (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id  uuid REFERENCES projects (id) ON DELETE CASCADE,
        title       text NOT NULL,
        notes       text,
        assignee_id uuid REFERENCES users (id) ON DELETE SET NULL,
        created_by  uuid REFERENCES users (id) ON DELETE SET NULL,
        priority    text NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
        due_date    date,
        done_at     timestamptz,
        approval    text NOT NULL DEFAULT 'not_required'
                    CHECK (approval IN ('not_required', 'awaiting', 'approved', 'changes_requested')),
        recurrence  text NOT NULL DEFAULT 'none' CHECK (recurrence IN ('none', 'weekly', 'monthly', 'yearly')),
        blocked_by  uuid REFERENCES tasks (id) ON DELETE SET NULL,
        created_at  timestamptz NOT NULL DEFAULT now(),

        -- A repeat is counted from the due date, so it needs one.
        CONSTRAINT recurring_tasks_need_due_date
          CHECK (recurrence = 'none' OR due_date IS NOT NULL),
        CONSTRAINT tasks_cannot_block_themselves
          CHECK (blocked_by IS NULL OR blocked_by <> id)
      );
      CREATE INDEX tasks_project_idx ON tasks (project_id);
      CREATE INDEX tasks_assignee_idx ON tasks (assignee_id);
      CREATE INDEX tasks_due_idx ON tasks (due_date) WHERE done_at IS NULL;

      CREATE TABLE subtasks (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id    uuid NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
        title      text NOT NULL,
        done       boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX subtasks_task_idx ON subtasks (task_id);

      CREATE TABLE task_comments (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id    uuid NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
        author_id  uuid REFERENCES users (id) ON DELETE SET NULL,
        body       text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX task_comments_task_idx ON task_comments (task_id, created_at);
    `,
  },
  {
    version: 2,
    sql: `
      -- What a client is worth on paper. RESTRICT: a client with income on record
      -- cannot be deleted by accident.
      CREATE TABLE income (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id  uuid NOT NULL REFERENCES companies (id) ON DELETE RESTRICT,
        kind        text NOT NULL CHECK (kind IN ('project', 'monthly', 'other')),
        description text NOT NULL,
        amount      numeric(12, 2) NOT NULL CHECK (amount > 0),
        -- NULL means nobody has recorded what came in, not that nothing did. The
        -- value of a job and the money received are different facts.
        received    numeric(12, 2) CHECK (received IS NULL OR received >= 0),
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now(),

        -- A monthly fee has no single total received; months get tracked separately.
        CONSTRAINT monthly_income_has_no_total_received
          CHECK (kind <> 'monthly' OR received IS NULL)
      );
      CREATE INDEX income_company_idx ON income (company_id);
    `,
  },
  {
    version: 3,
    sql: `
      -- Who changed what, when, and from what. Written in the same transaction as the
      -- change itself, so a record cannot change without leaving a trace.
      CREATE TABLE audit_log (
        id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        at        timestamptz NOT NULL DEFAULT now(),
        user_id   uuid REFERENCES users (id) ON DELETE SET NULL,
        user_name text,
        action    text NOT NULL,
        entity    text NOT NULL,
        entity_id uuid,
        summary   text,
        before    jsonb,
        after     jsonb
      );
      CREATE INDEX audit_entity_idx ON audit_log (entity, entity_id, at);

      -- One row: the details printed on invoices. Bank details live only here,
      -- never in the code, because the repository is public.
      CREATE TABLE company_settings (
        id             boolean PRIMARY KEY DEFAULT true CHECK (id),
        legal_name     text NOT NULL DEFAULT 'OneZeroLabs',
        address        text,
        state          text,
        email          text,
        phone          text,
        udyam          text,
        gstin          text,
        bank_name      text,
        account_name   text,
        account_number text,
        ifsc           text,
        upi_id         text,
        invoice_prefix text NOT NULL DEFAULT 'OZL',
        invoice_terms  text,
        updated_at     timestamptz NOT NULL DEFAULT now()
      );
      INSERT INTO company_settings (address, state, email, phone, udyam, invoice_terms) VALUES (
        'Bengaluru, Karnataka 560091, India',
        'Karnataka',
        'hello@onezerolabs.in',
        '+91 74837 29869',
        'UDYAM-KR-03-0615981',
        'Payment is due by the date shown above.'
      );

      CREATE TABLE invoices (
        id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        -- Given only when issued, so a deleted draft leaves no gap in the series.
        number          text UNIQUE,
        company_id      uuid NOT NULL REFERENCES companies (id) ON DELETE RESTRICT,
        income_id       uuid REFERENCES income (id) ON DELETE SET NULL,
        status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
        issue_date      date NOT NULL,
        due_date        date,
        bill_to_name    text NOT NULL,
        bill_to_address text,
        bill_to_state   text,
        bill_to_gstin   text,
        gst_rate        numeric(4, 2) NOT NULL DEFAULT 0 CHECK (gst_rate >= 0 AND gst_rate <= 50),
        notes           text,
        -- The seller's details as they stood when issued. Changing the settings
        -- later must never rewrite an invoice already sent.
        seller          jsonb,
        created_by      uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at      timestamptz NOT NULL DEFAULT now(),
        updated_at      timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT issued_invoices_have_numbers CHECK (status = 'draft' OR (number IS NOT NULL AND seller IS NOT NULL))
      );
      CREATE INDEX invoices_company_idx ON invoices (company_id);
      CREATE INDEX invoices_status_idx ON invoices (status);

      CREATE TABLE invoice_items (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_id  uuid NOT NULL REFERENCES invoices (id) ON DELETE CASCADE,
        position    int NOT NULL,
        description text NOT NULL,
        quantity    numeric(10, 2) NOT NULL CHECK (quantity > 0),
        rate        numeric(12, 2) NOT NULL CHECK (rate > 0)
      );
      CREATE INDEX invoice_items_invoice_idx ON invoice_items (invoice_id, position);

      CREATE TABLE invoice_payments (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_id uuid NOT NULL REFERENCES invoices (id) ON DELETE RESTRICT,
        amount     numeric(12, 2) NOT NULL CHECK (amount > 0),
        paid_on    date NOT NULL,
        method     text,
        reference  text,
        created_by uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX invoice_payments_invoice_idx ON invoice_payments (invoice_id, paid_on);
    `,
  },
  {
    version: 4,
    sql: `
      -- A time of day, for things like a meeting at 7. Kept apart from the date so
      -- most tasks can simply have neither, or a date alone.
      ALTER TABLE tasks ADD COLUMN due_time time;
      ALTER TABLE tasks ADD CONSTRAINT a_time_needs_a_date CHECK (due_time IS NULL OR due_date IS NOT NULL);
    `,
  },
  {
    version: 5,
    sql: `
      -- Folders nest, as in the Files app. One with anything inside can't be
      -- deleted, so nothing disappears by accident.
      CREATE TABLE folders (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        parent_id  uuid REFERENCES folders (id) ON DELETE RESTRICT,
        name       text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 80),
        created_by uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        CHECK (parent_id IS DISTINCT FROM id)
      );
      -- No two folders of the same name side by side. The top level has no parent,
      -- so it stands in as an all-zero id.
      CREATE UNIQUE INDEX folders_name_idx
        ON folders (COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(name));

      CREATE TABLE documents (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        folder_id   uuid REFERENCES folders (id) ON DELETE RESTRICT,
        company_id  uuid REFERENCES companies (id) ON DELETE SET NULL,
        name        text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 200),
        mime        text NOT NULL,
        size        integer NOT NULL CHECK (size > 0),
        sha256      text NOT NULL,
        uploaded_by uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at  timestamptz NOT NULL DEFAULT now()
      );
      CREATE UNIQUE INDEX documents_name_idx
        ON documents (COALESCE(folder_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(name));
      CREATE INDEX documents_company_idx ON documents (company_id) WHERE company_id IS NOT NULL;

      -- The file itself, kept apart so listing a folder never reads the bytes.
      CREATE TABLE document_files (
        document_id uuid PRIMARY KEY REFERENCES documents (id) ON DELETE CASCADE,
        data        bytea NOT NULL
      );
    `,
  },
  {
    version: 6,
    sql: `
      -- A task for both founders. It shows in each one's own list, and it can't
      -- also name one person.
      ALTER TABLE tasks ADD COLUMN for_both boolean NOT NULL DEFAULT false;
      ALTER TABLE tasks ADD CONSTRAINT both_means_no_one_person CHECK (NOT for_both OR assignee_id IS NULL);
    `,
  },
  {
    version: 7,
    sql: `
      -- What each partner earns from OneZeroLabs work, and the share of it paid into
      -- the company bank account, as the partners agreement requires. The share is
      -- worked out once, at the rate of the day, so a later change of rate never
      -- rewrites the past.
      CREATE TABLE earnings (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        amount      numeric(12, 2) NOT NULL CHECK (amount > 0),
        rate        numeric(5, 2) NOT NULL DEFAULT 25 CHECK (rate > 0 AND rate <= 100),
        share       numeric(12, 2) NOT NULL CHECK (share >= 0 AND share <= amount),
        received_on date NOT NULL,
        paid_on     date,
        company_id  uuid REFERENCES companies (id) ON DELETE SET NULL,
        note        text,
        created_by  uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at  timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT paid_after_received CHECK (paid_on IS NULL OR paid_on >= received_on)
      );
      CREATE INDEX earnings_received_idx ON earnings (received_on);

      -- Everything else that goes in or out of the company bank account. Money out
      -- needs both partners' agreement, so it can't be saved without it.
      CREATE TABLE bank_entries (
        id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        direction      text NOT NULL CHECK (direction IN ('in', 'out')),
        amount         numeric(12, 2) NOT NULL CHECK (amount > 0),
        entry_date     date NOT NULL,
        description    text NOT NULL CHECK (length(btrim(description)) > 0),
        category       text,
        agreed_by_both boolean NOT NULL DEFAULT false,
        created_by     uuid REFERENCES users (id) ON DELETE SET NULL,
        created_at     timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT spending_needs_both CHECK (direction = 'in' OR agreed_by_both)
      );
      CREATE INDEX bank_entries_date_idx ON bank_entries (entry_date);
    `,
  },
]
