--
-- PostgreSQL database dump
--

\restrict 3TZkuoRQSkRPnGAEFReEVS9tk4qGAutyuEYS4KBnX0vncZ2Eeume3y0lRVaA4z1

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ankets; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.ankets (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    slug character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    info jsonb,
    content jsonb,
    family jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.ankets OWNER TO kod;

--
-- Name: ankets_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.ankets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ankets_id_seq OWNER TO kod;

--
-- Name: ankets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.ankets_id_seq OWNED BY public.ankets.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache OWNER TO kod;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO kod;

--
-- Name: condolences; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.condolences (
    id bigint NOT NULL,
    anket_id bigint NOT NULL,
    user_id bigint,
    author_name character varying(255) NOT NULL,
    message text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.condolences OWNER TO kod;

--
-- Name: condolences_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.condolences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.condolences_id_seq OWNER TO kod;

--
-- Name: condolences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.condolences_id_seq OWNED BY public.condolences.id;


--
-- Name: drevs; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.drevs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    data jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.drevs OWNER TO kod;

--
-- Name: drevs_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.drevs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drevs_id_seq OWNER TO kod;

--
-- Name: drevs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.drevs_id_seq OWNED BY public.drevs.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO kod;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO kod;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO kod;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO kod;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO kod;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO kod;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO kod;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: novosti; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.novosti (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content jsonb,
    published_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.novosti OWNER TO kod;

--
-- Name: novosti_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.novosti_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.novosti_id_seq OWNER TO kod;

--
-- Name: novosti_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.novosti_id_seq OWNED BY public.novosti.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO kod;

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO kod;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO kod;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO kod;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    purchasable_type character varying(255) NOT NULL,
    purchasable_id bigint NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(255) DEFAULT 'RUB'::character varying NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    yookassa_id character varying(255),
    metadata jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.transactions OWNER TO kod;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO kod;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: kod
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    max_gallery_images integer DEFAULT 6 NOT NULL,
    max_videos integer DEFAULT 6 NOT NULL,
    name_changed_at timestamp(0) without time zone
);


ALTER TABLE public.users OWNER TO kod;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: kod
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO kod;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kod
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ankets id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.ankets ALTER COLUMN id SET DEFAULT nextval('public.ankets_id_seq'::regclass);


--
-- Name: condolences id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.condolences ALTER COLUMN id SET DEFAULT nextval('public.condolences_id_seq'::regclass);


--
-- Name: drevs id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.drevs ALTER COLUMN id SET DEFAULT nextval('public.drevs_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: novosti id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.novosti ALTER COLUMN id SET DEFAULT nextval('public.novosti_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ankets; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.ankets (id, user_id, slug, status, info, content, family, created_at, updated_at, deleted_at) FROM stdin;
1	7	deserunt-quam-quibusdam	published	{"photo": null, "last_name": "Сергеева", "birth_date": "1977-12-21", "death_date": "2020-05-13", "first_name": "Владислав", "middle_name": "Витольд"}	{"biography": "Voluptas dicta quibusdam atque dignissimos similique hic sed. Corporis laudantium corrupti et repellendus eligendi tempora. Enim voluptate sed quaerat perferendis commodi.\\n\\nDolores sit sed mollitia architecto assumenda et tempore. Quisquam maiores excepturi et molestiae dolore. Rerum sed hic incidunt dignissimos quod dolores modi. Qui ratione occaecati vero voluptatem.\\n\\nSequi et cum eum aperiam consectetur amet et asperiores. Perferendis est officiis voluptatibus id sit. Sed culpa quis ut iure quia. Eius facilis nobis sit sit.", "achievements": "Aut consectetur officia voluptates earum ad."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
2	8	dolores-quia-eum	published	{"photo": null, "last_name": "Туров", "birth_date": "1980-01-10", "death_date": "1975-05-15", "first_name": "Аполлон", "middle_name": "Евгений"}	{"biography": "A placeat rerum laboriosam exercitationem at. Qui dignissimos nisi nesciunt recusandae delectus voluptate est. Hic nulla odio quia magnam nihil. Minima ut quis tempora quibusdam neque aspernatur.\\n\\nExpedita velit dolores dolore reiciendis saepe magnam. Quia sapiente reprehenderit facilis quaerat. Molestiae harum reiciendis est ea saepe nam molestiae.\\n\\nConsequuntur est aliquam fugiat quibusdam quam. Ipsum est reprehenderit dolorem voluptatem ducimus eos exercitationem dolores. Veniam voluptatibus corrupti sapiente officia porro quaerat ea eum. Voluptate dolor et quasi ut quis quidem adipisci autem.", "achievements": "Sit quae dicta et repudiandae."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
3	9	itaque-reprehenderit-odio	published	{"photo": null, "last_name": "Андреева", "birth_date": "1986-09-10", "death_date": "2007-12-19", "first_name": "Данила", "middle_name": "Василий"}	{"biography": "Laudantium voluptates asperiores officia. Quis aut dolores perspiciatis est eligendi maiores. Labore dolor cumque vel delectus cupiditate doloremque. Ex quia magnam minima non totam.\\n\\nEt nihil eveniet explicabo neque omnis. Non eius asperiores autem debitis ut voluptates aliquid. Ea quo repudiandae vero facilis impedit unde sit aut. Consequatur dolorem eos perferendis quia eaque officiis.\\n\\nVeniam ut doloremque iure eveniet quibusdam dolorem dignissimos. Neque id deleniti ullam distinctio veniam quaerat eligendi nobis. At impedit sed magni dolorum consectetur quas.", "achievements": "Repellendus omnis eaque iusto ut et."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
4	10	dolor-quia-explicabo	published	{"photo": null, "last_name": "Павлова", "birth_date": "1995-12-02", "death_date": "1989-06-10", "first_name": "Виктория", "middle_name": "Василий"}	{"biography": "Error eos fugit qui voluptatem eos nostrum voluptates in. Magnam ea beatae nihil cum quidem corporis. Numquam quos sed quae ut voluptatem ut et nostrum. Voluptatem fuga consectetur eius ipsa voluptatem.\\n\\nAt doloremque facere omnis voluptatem ut sunt quo. Voluptatem consequatur nobis deserunt aperiam amet numquam ad. Aut maxime non laborum nisi.\\n\\nEligendi sint soluta impedit. Neque repellendus aspernatur et sed exercitationem qui mollitia. Nisi est laboriosam rerum ut est eum. Nobis quis sunt ratione harum repellendus temporibus quis.", "achievements": "Fuga et dolor et dolore aut reiciendis autem."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
5	11	id-ut-labore	published	{"photo": null, "last_name": "Моисеева", "birth_date": "1978-10-23", "death_date": "2022-09-06", "first_name": "Ярослава", "middle_name": "Фёдор"}	{"biography": "Nihil qui voluptatem omnis et vero ipsam provident. Id et ullam ut consequuntur odit fugiat. Eius vitae quasi minus rem dolores adipisci earum dolor. Et repellendus nemo nam dolor.\\n\\nVoluptate magni et error tenetur nemo. Atque aut veniam aperiam fugiat a totam. Autem odit voluptatum exercitationem expedita omnis ullam non.\\n\\nDolores facere esse ipsam. Repudiandae et quisquam aliquid omnis quas commodi sapiente esse. Inventore odio recusandae repellendus sed nisi rerum eos.", "achievements": "Vel et officia sint est sequi ut nihil."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
6	12	blanditiis-nulla-sunt	published	{"photo": null, "last_name": "Морозова", "birth_date": "1978-02-03", "death_date": "1972-10-11", "first_name": "Адриан", "middle_name": "Анфиса"}	{"biography": "Id commodi deleniti animi. Qui eos repellendus aliquam exercitationem aliquam reiciendis quidem. Voluptatum doloribus harum voluptas accusamus occaecati explicabo assumenda veniam.\\n\\nEos ea adipisci libero distinctio. Vel et dicta laudantium tempore. Ut qui explicabo fugit alias vel quis voluptatem. Rem et inventore hic vitae.\\n\\nTotam quo dolor rem. Consequatur doloribus non quo dignissimos ut amet. Et doloremque voluptates et.", "achievements": "Expedita sed libero earum eos modi nihil hic."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
7	13	sunt-qui-expedita	published	{"photo": null, "last_name": "Лазарев", "birth_date": "1987-07-04", "death_date": "2018-03-28", "first_name": "Рената", "middle_name": "Валерий"}	{"biography": "Quasi voluptatem velit ratione labore doloremque quam. Alias et voluptatum aut veniam enim quaerat alias quam. Architecto ut quibusdam et impedit et. Et est quae voluptas et ut modi impedit eaque.\\n\\nQuibusdam reiciendis similique possimus sapiente. Ab consequatur eligendi eos vel minus eveniet veritatis. Quaerat harum et voluptatem aliquam.\\n\\nEt nesciunt blanditiis sunt tempore. At autem modi dolorem sed ea natus natus. Veritatis ut rem occaecati ipsa deleniti. Velit magnam quis nemo ex laborum repudiandae.", "achievements": "Impedit esse provident amet similique quas et."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
8	14	vel-nemo-ut	published	{"photo": null, "last_name": "Калашникова", "birth_date": "1979-09-15", "death_date": "1984-10-15", "first_name": "Никита", "middle_name": "Екатерина"}	{"biography": "Nam libero nemo numquam quia minima rerum quidem. Quo nesciunt et vero doloribus. Sit ad qui reiciendis aut. Architecto maiores odit sequi beatae.\\n\\nId et perspiciatis eaque nisi cum. Est excepturi eius optio atque. Sed hic error incidunt odit quasi laboriosam similique sit. Libero aut fuga aliquam quisquam.\\n\\nDicta consectetur dolor autem ea. Eum inventore quis omnis ut. Placeat dignissimos enim molestiae voluptates sapiente saepe nulla.", "achievements": "Similique minus explicabo ratione sed deserunt."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
9	15	fugit-dolores-id	published	{"photo": null, "last_name": "Соловьёв", "birth_date": "1976-12-11", "death_date": "1992-02-12", "first_name": "Ираклий", "middle_name": "Всеволод"}	{"biography": "Ullam aliquam qui ab sit aut mollitia dolores. Sit omnis cum id officiis quidem. Tempore reiciendis et beatae rem aut fugiat laboriosam. Omnis recusandae nulla et et cupiditate omnis doloremque praesentium.\\n\\nAut placeat nostrum laboriosam laudantium. Soluta voluptatem sint aut. Recusandae sit in vel.\\n\\nSoluta doloribus nulla soluta facilis sint quia. Deserunt ut maxime omnis ut necessitatibus.", "achievements": "Enim fugiat sequi explicabo facilis temporibus."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
10	16	dignissimos-eligendi-architecto	published	{"photo": null, "last_name": "Носова", "birth_date": "1980-03-17", "death_date": "2018-11-23", "first_name": "Ирина", "middle_name": "Захар"}	{"biography": "Necessitatibus sed velit voluptas repellendus. Nulla error commodi et doloribus nihil atque qui eveniet. Vero et incidunt laudantium atque labore at itaque. Est praesentium rerum velit unde doloribus nam.\\n\\nEligendi earum id quo. Consequatur quisquam dolor sit dolores accusamus. Quod nihil dignissimos quia ut non odio. Ut repudiandae doloribus culpa omnis facilis vel.\\n\\nPossimus est itaque aut accusantium quia vel fugiat quod. Dolorem blanditiis rerum aut esse praesentium unde et ad. Aut quis sed quas perferendis ducimus eligendi.", "achievements": "Autem ratione expedita quis earum."}	\N	2026-05-02 12:56:57	2026-05-02 12:56:57	\N
11	17	nesciunt-numquam-tempore	draft	{"photo": null, "last_name": "Лихачёва", "birth_date": "1994-08-16", "death_date": "1993-10-10", "first_name": "Феликс", "middle_name": "Алина"}	{"biography": "Rem perspiciatis incidunt sapiente qui in architecto totam. Rerum unde aliquam corporis qui id.\\n\\nQuo aliquid architecto officia. Ut dolor dolore nostrum amet at quae. Sunt atque vero sint blanditiis aliquid tempore.\\n\\nNulla aperiam et labore itaque repellat possimus. Qui facere porro et unde. Et amet quam nobis nihil soluta laboriosam. Eum iusto rerum quia consequatur.", "achievements": "Pariatur quae quo quam."}	\N	2026-05-02 12:56:58	2026-05-02 12:56:58	\N
12	18	autem-ut-praesentium	draft	{"photo": null, "last_name": "Турова", "birth_date": "1988-03-02", "death_date": "2002-06-17", "first_name": "Дан", "middle_name": "Болеслав"}	{"biography": "Et nobis aliquam culpa quo velit dolores perferendis dolor. At quasi officia repellat voluptas commodi. Odit officia sequi quia quae. Ad incidunt ex cum omnis.\\n\\nRatione cum sit ad soluta tenetur est. Ut illum itaque voluptatem laborum. Repellat ut veritatis alias occaecati omnis facilis perferendis. Quo reiciendis quod sint temporibus eaque.\\n\\nOmnis voluptatem quia libero rem repudiandae. Accusantium sapiente aut eum eos et voluptatum quos. Minus est provident quasi aut at odit. Expedita aut officia corporis provident totam molestias molestiae.", "achievements": "Minima sint debitis enim quibusdam enim placeat nesciunt."}	\N	2026-05-02 12:56:58	2026-05-02 12:56:58	\N
13	19	maxime-est-tempore	draft	{"photo": null, "last_name": "Назаров", "birth_date": "1985-01-21", "death_date": "1996-05-02", "first_name": "Тимофей", "middle_name": "Елизавета"}	{"biography": "Quibusdam delectus incidunt ea doloribus et consequatur. Consequatur exercitationem illum similique in totam quibusdam. Nemo tempora praesentium tempore aut. Modi odio accusantium vero itaque accusantium.\\n\\nVeritatis earum ipsam sit perferendis. Vero ut ea nesciunt enim nemo. Dolor delectus hic consequuntur vel ex velit et.\\n\\nQuisquam dolorum architecto enim qui harum sed. Sit perspiciatis fugiat accusantium est expedita at eveniet.", "achievements": "In provident nulla tempora et quam."}	\N	2026-05-02 12:56:58	2026-05-02 12:56:58	\N
14	20	quibusdam-quasi-necessitatibus	published	{"photo": null, "last_name": "Наумова", "birth_date": "1981-05-21", "death_date": "2014-01-09", "first_name": "Ирина", "middle_name": "Диана"}	{"biography": "Laboriosam exercitationem consequatur sint deserunt ut dolores. Sapiente veniam aperiam in assumenda officiis ut perspiciatis. Modi sed consequuntur deserunt libero sed ut distinctio optio.\\n\\nQuaerat minima voluptatem illum quia est quae voluptatem. Omnis corrupti quia harum autem inventore. Aut iste id nihil esse praesentium voluptatem iure.\\n\\nNemo sunt molestiae et eos corporis velit inventore laboriosam. Fugit sit odit magnam. Omnis voluptatum dolor fugit voluptatem architecto voluptatem unde. Quae quia atque corrupti facilis libero quia.", "achievements": "Laudantium voluptatem eum aliquid architecto sed."}	{"father": "Гурьев Илья Андреевич", "mother": "Изольда Фёдоровна Афанасьева", "children": ["Лилия Андреевна Селезнёва"]}	2026-05-02 12:56:58	2026-05-02 12:56:58	\N
15	21	odit-qui-sit	published	{"photo": null, "last_name": "Кононов", "birth_date": "1970-07-04", "death_date": "1988-07-17", "first_name": "Елена", "middle_name": "Алиса"}	{"biography": "Illo alias quibusdam sequi saepe similique sed sapiente. Officiis ratione pariatur cumque quibusdam labore. Eius rem nesciunt blanditiis qui officiis. Consequatur ut in repudiandae enim quasi aut maxime. Autem ut quas qui commodi sit eum.\\n\\nMolestiae id totam distinctio maiores qui. Voluptatibus voluptas deleniti occaecati qui rerum occaecati voluptas ratione. Eum minus dolor enim consectetur voluptatum aut expedita dicta. Distinctio molestiae perspiciatis accusamus ea qui.\\n\\nQuia doloremque maiores dolorum iste cumque nihil. Dolor recusandae numquam nam natus laudantium vero et. Reiciendis aut quos porro similique veritatis. In sapiente aut laudantium odit soluta doloremque earum.", "achievements": "Est molestias dignissimos aliquam quae repudiandae pariatur."}	{"father": "Русаков Аким Романович", "mother": "Титова Раиса Сергеевна", "children": ["Кулаков Григорий Евгеньевич"]}	2026-05-02 12:56:58	2026-05-02 12:56:58	\N
16	38	voluptate-iste-cum	private	{"photo": null, "last_name": "Шубина", "birth_date": "1992-01-13", "death_date": "1975-09-29", "first_name": "Виктория", "middle_name": "Розалина"}	{"biography": "Eos omnis non hic velit ratione facere. Ullam officia repudiandae perspiciatis labore blanditiis et. Placeat sint voluptates quisquam quisquam.\\n\\nUt nesciunt magnam rerum hic. Aut nisi est et adipisci ut porro. Reprehenderit ab ut quidem dolores. Eum nemo sed omnis occaecati ducimus ut expedita. Et officiis itaque nobis non rerum.\\n\\nTotam aut nisi voluptatem aspernatur deleniti atque sequi. Rerum commodi ut magnam nam eos delectus. Corporis odio sed enim in.", "achievements": "Dolores sit cumque qui dolorem."}	\N	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
17	40	blanditiis-eum-ut	published	{"photo": null, "last_name": "Назарова", "birth_date": "1983-04-29", "death_date": "2007-03-07", "first_name": "Доминика", "middle_name": "Виль"}	{"biography": "Enim laudantium consequatur cum omnis sed. Et dolorem nam consequatur rem nihil. Voluptatibus qui quis inventore impedit.\\n\\nDignissimos alias excepturi sunt in est necessitatibus maxime velit. Assumenda quo praesentium doloribus dolore id.\\n\\nAutem sunt quia consequatur voluptatem enim delectus ad. Modi sit et eius. Quia suscipit nobis et et tempora consectetur.", "achievements": "Iusto dolorum cumque perferendis quo fuga hic architecto."}	\N	2026-05-02 12:57:04	2026-05-02 12:57:04	\N
18	42	nihil-quo-aut	draft	{"photo": null, "last_name": "Носкова", "birth_date": "1995-06-04", "death_date": "1984-09-09", "first_name": "Валерия", "middle_name": "Тамара"}	{"biography": "Provident totam exercitationem incidunt minima. Minus laboriosam fugit magnam enim molestiae similique. Cumque aut autem atque assumenda qui est.\\n\\nArchitecto fugiat qui nam voluptatem ea inventore. Dolores veniam praesentium reiciendis quo illum necessitatibus eius. Sapiente nobis ut consequatur natus molestiae dolorem et. Et est et rerum enim.\\n\\nQuia similique et quia officia est quae voluptatem. Voluptatem quia provident quo et ut earum labore. Necessitatibus aut quo ex saepe laborum quidem.", "achievements": "Praesentium repudiandae ratione asperiores eum iste suscipit."}	\N	2026-05-02 12:57:04	2026-05-02 12:57:04	\N
19	44	voluptatem-in-quia	private	{"photo": null, "last_name": "Никифоров", "birth_date": "1986-02-09", "death_date": "2020-05-29", "first_name": "Ева", "middle_name": "Тит"}	{"biography": "Magnam animi et enim. Mollitia totam tempore non repudiandae eius natus necessitatibus facere. Dolorem vel sint maxime exercitationem.\\n\\nQui numquam et aspernatur quia natus consequuntur autem. Iure esse aut quia est. Adipisci quod eveniet commodi quia et tempore et.\\n\\nIllum delectus tempora officiis voluptatum pariatur ad. Eius at accusamus ut fugit id aut similique. Voluptatum quae recusandae iste amet ullam aliquam maiores.", "achievements": "Et incidunt possimus magnam voluptas molestias rerum."}	\N	2026-05-02 12:57:04	2026-05-02 12:57:04	\N
20	46	repellat-velit-quia	private	{"photo": null, "last_name": "Рябов", "birth_date": "1989-03-25", "death_date": "1982-08-11", "first_name": "Диана", "middle_name": "Роберт"}	{"biography": "Molestiae placeat quasi laborum minima saepe alias. Amet incidunt repellat excepturi saepe. Nobis ut voluptates libero ipsa iste molestias nam. Magni est quia rerum et.\\n\\nSunt rerum quia dignissimos sit. Voluptas ipsa voluptatibus laboriosam aliquid est. Amet sit vel quo dolores natus.\\n\\nError est officia reiciendis amet tempora. Illum optio quam hic sequi in. Modi eveniet rem sit mollitia aperiam voluptatibus eveniet sint.", "achievements": "Doloremque corporis aperiam molestiae eos."}	\N	2026-05-02 12:57:04	2026-05-02 12:57:04	\N
21	48	illum-corrupti-voluptas	private	{"photo": null, "last_name": "Полякова", "birth_date": "1983-01-02", "death_date": "1977-07-11", "first_name": "Евгений", "middle_name": "Тарас"}	{"biography": "Rerum veritatis est iste et blanditiis sapiente repudiandae. Magnam eos illum neque in ut ea dolorum. Dolore est consectetur non exercitationem voluptatem inventore.\\n\\nA odio repudiandae autem quibusdam atque eaque. Vitae at vel deleniti consequatur illo enim.\\n\\nAliquam sequi deleniti qui dolor ab eum dolores. Omnis et hic iusto natus dolorem delectus ut deserunt. Modi laboriosam error dolorem quidem et. Quos eaque similique ipsam iure magni tenetur.", "achievements": "Quae fugiat suscipit minus ipsam itaque sint eum."}	\N	2026-05-02 12:57:05	2026-05-02 12:57:05	\N
22	50	odit-inventore-quia	published	{"photo": null, "last_name": "Фёдорова", "birth_date": "1982-02-16", "death_date": "1981-07-22", "first_name": "Майя", "middle_name": "Сава"}	{"biography": "Ex amet voluptatem molestiae adipisci quas culpa asperiores. Velit facilis expedita qui sint magni quibusdam porro est. Enim neque corrupti saepe voluptate vel laborum impedit.\\n\\nDolorem est repellat dolor. Nisi est est alias ut. Eaque eum sint quaerat qui libero debitis. Voluptatum ab dolorem quasi pariatur maxime mollitia.\\n\\nDolores quas dolores ea inventore adipisci. Cumque possimus quis molestiae qui fuga non. Autem assumenda vel et quasi aperiam aut. Voluptas itaque cumque unde temporibus praesentium beatae dolore.", "achievements": "Amet fugit cupiditate aut et et consectetur vitae."}	\N	2026-05-02 12:57:05	2026-05-02 12:57:05	\N
23	51	tempore-unde-perferendis	private	{"photo": null, "last_name": "Лыткин", "birth_date": "1972-04-02", "death_date": "2005-11-21", "first_name": "Святослав", "middle_name": "Валериан"}	{"biography": "Magnam sint facilis natus perferendis. Quam aut repellat id. Quae explicabo aut sit. Reiciendis est sequi nostrum.\\n\\nEst dolorum eligendi consectetur. Repudiandae exercitationem odit dolorem repudiandae repellendus. Nobis nostrum quos optio ut reiciendis unde alias.\\n\\nEst unde at non veniam eos. Corporis nobis saepe officia occaecati dolorem commodi omnis. Reprehenderit quasi minus eius doloribus aperiam est.", "achievements": "Delectus cum similique consectetur necessitatibus magni natus fuga."}	\N	2026-05-02 12:57:06	2026-05-02 12:57:06	\N
24	53	mollitia-voluptas-quo	private	{"photo": null, "last_name": "Горшков", "birth_date": "1980-04-23", "death_date": "1986-12-18", "first_name": "Назар", "middle_name": "Мальвина"}	{"biography": "Nesciunt iure est minus temporibus voluptatibus suscipit. Impedit laudantium enim ipsam aut magni voluptatem. Provident sint quia libero et dolor esse voluptas.\\n\\nOmnis consequatur id aperiam nihil at et amet dolorum. Unde inventore et et quia itaque reiciendis. Nemo voluptatum tempore laboriosam sed nihil consequatur dignissimos.\\n\\nNumquam aspernatur et temporibus quis nulla molestias dolores. Necessitatibus quasi delectus commodi sed facilis amet. Porro hic iste consectetur inventore harum est. Et placeat rerum incidunt cupiditate consectetur.", "achievements": "Magni totam deserunt animi animi et."}	\N	2026-05-02 12:57:06	2026-05-02 12:57:06	\N
25	55	consectetur-incidunt-nisi	published	{"photo": null, "last_name": "Мартынов", "birth_date": "1980-01-25", "death_date": "1975-08-26", "first_name": "Платон", "middle_name": "Платон"}	{"biography": "Modi incidunt cumque deleniti animi ea temporibus. Asperiores id doloremque consequatur et velit corporis aut velit. Ratione neque est voluptas quos rerum perspiciatis voluptatem.\\n\\nQuasi dolor itaque qui quam provident. Eaque excepturi facere autem maxime accusamus. Ut sit veritatis atque.\\n\\nMaxime nulla omnis expedita quidem fugit qui consequuntur. Dignissimos facilis ut dolores voluptatibus ex. Earum aut qui qui aut.", "achievements": "Unde sed aut ut officiis fuga."}	\N	2026-05-02 12:57:07	2026-05-02 12:57:07	\N
26	57	eos-consequatur-natus	published	{"photo": null, "last_name": "Данилов", "birth_date": "1974-09-11", "death_date": "1991-06-13", "first_name": "Донат", "middle_name": "Виталий"}	{"biography": "Velit est optio optio pariatur. Beatae aperiam iusto praesentium. Adipisci est similique quod qui molestiae. Sunt id voluptatem cupiditate sit dolores optio.\\n\\nEx deleniti veniam doloribus eligendi distinctio est quasi. Maxime accusantium dolore asperiores voluptates veritatis cumque aperiam. Eos rerum ut sequi pariatur maxime. Rem ut sequi et officiis ut non voluptates voluptas.\\n\\nVoluptatem et illo ut. Architecto placeat beatae non ipsum perspiciatis. Dolorem fugit corporis est tenetur dolor rerum et. Voluptates molestiae voluptatem amet et voluptas nulla eligendi.", "achievements": "Qui perferendis quaerat deserunt voluptas et repudiandae sit."}	\N	2026-05-02 12:57:07	2026-05-02 12:57:07	\N
27	59	et-sit-autem	private	{"photo": null, "last_name": "Панфилов", "birth_date": "1992-10-28", "death_date": "1991-12-26", "first_name": "Иммануил", "middle_name": "Маргарита"}	{"biography": "Aut aut et unde voluptas corporis. Quae delectus fuga id. Et aut aut nobis dolor sapiente. Soluta facere est occaecati eligendi.\\n\\nDolores tempora veniam commodi deleniti vel. Quis nihil aperiam molestias. Dolorum recusandae quos dolorum possimus quidem sunt voluptate aperiam. Error corrupti iusto aut.\\n\\nDeleniti quia optio autem aliquam et. Velit labore assumenda incidunt cum atque praesentium et. Architecto deleniti ratione ipsum ducimus.", "achievements": "Consequatur veritatis accusamus magni totam qui excepturi veniam aspernatur."}	\N	2026-05-02 12:57:08	2026-05-02 12:57:08	\N
28	61	ipsum-assumenda-minima	published	{"photo": null, "last_name": "Шашкова", "birth_date": "1996-02-16", "death_date": "2022-04-07", "first_name": "Федосья", "middle_name": "Арсений"}	{"biography": "Consequuntur ea molestias distinctio qui quas. Et hic suscipit soluta qui repellat. Accusantium dolor consectetur soluta quo magni temporibus.\\n\\nUt qui non voluptatem praesentium. Qui fugit ut molestiae dicta facilis ullam. Itaque perspiciatis ea pariatur hic eligendi. Illo et molestiae quo dolor quisquam asperiores.\\n\\nVelit modi quis et unde. Ea illo deleniti modi porro numquam ut. Eos non et officia ratione qui voluptatem. Expedita quia magni laborum illo quia tempore sit. Omnis doloribus consectetur qui.", "achievements": "Ex nemo cum qui et perferendis quo."}	\N	2026-05-02 12:57:08	2026-05-02 12:57:08	\N
29	63	at-neque-ratione	private	{"photo": null, "last_name": "Ильин", "birth_date": "1974-08-27", "death_date": "1978-04-22", "first_name": "Маргарита", "middle_name": "Эмилия"}	{"biography": "Consequatur voluptatem et magni et tempora commodi in. Ipsum ipsum iusto dolores. Quas doloribus nisi ut.\\n\\nVoluptatem quis beatae et aut natus. Tempora inventore et qui. Excepturi officia est aut ea vel sit deserunt.\\n\\nMolestiae dicta nihil ullam voluptatem vero. Impedit corporis ut necessitatibus incidunt autem delectus reprehenderit. Est et nisi magni est. Et nemo qui hic quo explicabo omnis vero.", "achievements": "Ratione occaecati expedita tenetur quisquam consequatur sed rerum."}	\N	2026-05-02 12:57:08	2026-05-02 12:57:08	\N
30	65	odio-quae-corrupti	draft	{"photo": null, "last_name": "Александров", "birth_date": "1987-01-19", "death_date": "1979-12-14", "first_name": "Тимофей", "middle_name": "Ярослава"}	{"biography": "Aut ut recusandae dignissimos explicabo velit in et. Dolorem voluptas earum dolor voluptatem minus nihil et cupiditate. Illo aliquam fuga fugit quis.\\n\\nDoloremque nemo fugit soluta eos quia repellendus sed. Aut beatae necessitatibus et minima et. Quia nobis explicabo dolor et cum iste est. Quidem assumenda ea porro laborum sed.\\n\\nPorro eum qui cum autem blanditiis quidem totam. Minus vitae cupiditate mollitia iste. Deleniti sint qui tenetur. Odit aut aut molestias modi delectus maiores.", "achievements": "Labore praesentium aliquid rerum nobis."}	\N	2026-05-02 12:57:09	2026-05-02 12:57:09	\N
31	67	quia-rem-et	private	{"photo": null, "last_name": "Кудрявцев", "birth_date": "1973-05-28", "death_date": "2023-09-04", "first_name": "Иосиф", "middle_name": "Никодим"}	{"biography": "Et architecto non nesciunt et hic. Provident inventore eum non hic. Dicta debitis minus accusamus et eos. Provident qui quibusdam cum ab harum quidem inventore. Dolores numquam occaecati magni neque rerum non maiores.\\n\\nVoluptas aliquid culpa harum adipisci rerum aut. Cum reprehenderit quas quis. Numquam blanditiis autem architecto reprehenderit.\\n\\nVero hic illo possimus dolorum incidunt laborum ipsum. Ad sapiente eum ad omnis unde. Atque et perferendis neque eum. Voluptas voluptate cupiditate et fugiat voluptatem.", "achievements": "Quis facilis maxime modi ut perferendis."}	\N	2026-05-02 12:57:09	2026-05-02 12:57:09	\N
32	68	nulla-saepe-et	published	{"photo": null, "last_name": "Вишняков", "birth_date": "1970-01-08", "death_date": "2022-09-24", "first_name": "Валерий", "middle_name": "Иннокентий"}	{"biography": "Quaerat et non voluptates hic dignissimos cum numquam. Et cupiditate iure omnis aut earum beatae. Molestiae aut sint est architecto.\\n\\nQui quo laboriosam assumenda rerum nihil doloremque. Dolorem velit in explicabo eveniet repellat voluptatem rerum. Reiciendis autem consectetur similique beatae impedit.\\n\\nQuidem a quo et. Sed aut quo suscipit. Ea perspiciatis ut quia laborum.", "achievements": "Quasi est tempora sed quae et."}	\N	2026-05-02 12:57:10	2026-05-02 12:57:10	\N
33	69	labore-ut-natus	private	{"photo": null, "last_name": "Нестеров", "birth_date": "1980-03-13", "death_date": "2021-08-14", "first_name": "Ника", "middle_name": "Екатерина"}	{"biography": "Quae quia nobis sunt assumenda voluptatum nihil sed. Vel expedita ducimus alias id libero deleniti sed. Sit quo et ipsum rerum iste sed qui.\\n\\nConsequatur sit quos ea illum consequatur. Ex eaque nemo eum quisquam atque. Consequuntur quis facilis molestias quasi qui. Et accusantium et repellendus dolor et provident.\\n\\nVoluptatem ut quis sit ea eos minima excepturi. Repellat tenetur quis et eos nulla aliquam qui. Esse officiis eos saepe pariatur. Assumenda ratione ut soluta voluptatum repudiandae deleniti necessitatibus.", "achievements": "Molestiae quae impedit ut alias ipsam commodi qui fugiat."}	\N	2026-05-02 12:57:10	2026-05-02 12:57:10	\N
34	1	petrov-ivan	draft	{"last_name": "Петров", "first_name": "Иван"}	{"biography": "Биография"}	\N	2026-05-02 13:10:29	2026-05-02 13:10:29	\N
35	1	stranica-publicnaia	published	{"last_name": "Страница", "first_name": "Публичная"}	{"biography": "Тест"}	\N	2026-05-02 13:10:43	2026-05-02 13:10:43	\N
36	72	ivanov-ivan-ivanyc	draft	{"last_name": "Иванов", "birth_date": "2026-05-09", "birthplace": "Россия, Курск", "death_date": "2026-05-15", "deathplace": "Россия, Саратов", "first_name": "Иван", "middle_name": "Иваныч"}	{"biography": null}	\N	2026-05-02 14:05:23	2026-05-02 14:05:23	\N
37	1	sidorov-petr	published	{"last_name": "Сидоров", "birth_date": "1950-05-15", "birthplace": "Москва", "death_date": "2020-12-01", "deathplace": "Санкт-Петербург", "first_name": "Пётр"}	{"video": null, "gallery": [], "biography": "Выдающийся деятель науки."}	{"parents": [{"name": "Николай Сидоров"}, {"name": "Анна Сидорова"}], "spouses": [{"name": "Мария Сидорова", "marriage_end": "2020-12-01", "marriage_start": "1975-01-01"}], "children": [{"name": "Иван Сидоров"}]}	2026-05-02 14:13:26	2026-05-02 14:13:26	\N
41	1	b-a	draft	{"last_name": "B", "first_name": "A"}	{"video": null, "gallery": [{"url": "http://localhost:9000/kod-uploads/uploads/sYhxbt7KRJgtTMsUcU9c3g3YhLoUBjennz2XHgvI.png", "text": null}, {"url": "http://localhost:9000/kod-uploads/uploads/dlb3yZQDsjPJrTfrGhnBnBdCXUFAhipIgEhaA7qf.png", "text": null}], "biography": "bio"}	\N	2026-05-10 12:05:34	2026-05-10 12:05:34	\N
39	1	testov-test	draft	{"last_name": "Тестов", "first_name": "Тест"}	{"video": null, "gallery": [{"url": "http://localhost:9000/kod-uploads/uploads/test1.png", "text": "caption1"}, {"url": "http://localhost:9000/kod-uploads/uploads/test2.png", "text": "caption2"}, {"url": "http://localhost:9000/kod-uploads/uploads/test3.png", "text": "caption3"}], "biography": "test"}	\N	2026-05-10 11:52:55	2026-05-10 11:55:07	\N
40	1	proverka-test	draft	{"last_name": "Проверка", "first_name": "Тест"}	{"video": null, "gallery": [{"url": "http://localhost:9000/kod-uploads/uploads/ksk5mOnLkiZo8rzGaZUNdKiagnynZWI5JUhdheQW.png", "text": null}], "biography": "bio"}	\N	2026-05-10 11:57:28	2026-05-10 11:57:28	\N
42	1	test-memorial	published	{"quote": "Светлая память о добром сердце, которое навсегда останется в наших воспоминаниях и сердцах.", "last_name": "Заранова", "birth_date": "1990-01-06", "birthplace": "Ижевск", "death_date": "2026-05-04", "deathplace": "Саратов", "first_name": "Мария", "middle_name": "Петровна"}	{}	{}	2026-05-22 11:51:29	2026-05-22 11:51:29	\N
38	72	zaranova-mariia-petrovna	published	{"photo": "http://localhost:9000/kod-uploads/uploads/1779457444_416d3c29_photo.webp", "last_name": "Заранова", "birth_date": "1990-01-06", "birthplace": "Ижевск", "death_date": "2026-05-04", "deathplace": "Саратов", "first_name": "Мария", "middle_name": "Петровна"}	{"videos": [{"url": "http://localhost:9000/kod-uploads/uploads/s5wL7FLBwFXTX9J89kzWE9Zl37bsnJYhTQE3nqTa.mp4", "type": "upload", "mime_type": "video/mp4", "description": null, "original_name": "1.mp4"}, {"link": "https://www.youtube.com/watch?v=U1-WX3d5Vog", "type": "link", "preview": "https://img.youtube.com/vi/U1-WX3d5Vog/maxresdefault.jpg", "description": null}], "gallery": [{"url": "http://localhost:9000/kod-uploads/uploads/Ic9kQuySXOgIXnNOA5jbz0XJcWQm3LuLFxpFaSTs.png", "text": null}, {"url": "http://localhost:9000/kod-uploads/uploads/797mObn9Dl2c5kyIln9kKYjCraEH6P7LZU6HxUH3.png", "text": null}, {"url": "http://localhost:9000/kod-uploads/uploads/pP5bJa5LmUEMU0msuXR4DkBF1ycUvPAVv9JlS2BY.png", "text": null}, {"url": "http://localhost:9000/kod-uploads/uploads/f3zsxN3u1MO1VLZZicA0Jn2At5jpah8oqBcKMJZx.png", "text": null}, {"url": "http://localhost:9000/kod-uploads/uploads/FYUDevwWBMfyzTKvCtLEw9qgti66WLJGXA2Cz6d8.png", "text": null}, {"url": "http://localhost:9000/kod-uploads/uploads/1779457436_8b2e00d7_snimok-ekrana-2026-01-23-132911.webp", "text": null}], "biography": "<p style=\\"text-align: justify;\\"><strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam laudantium sequi quod debitis.</strong> Aperiam ratione officiis nobis veritatis labore quis error iste rerum corporis modi. Enim distinctio natus commodi magni eveniet eius ex accusamus quos magnam, beatae nesciunt, id voluptatibus delectus inventore fugit quidem assumenda repudiandae odit nobis facilis esse! Dignissimos ab magni dolor natus excepturi totam tempore fugiat accusantium qui est minus et ea corrupti, illo reprehenderit nam nemo similique at dolores, quidem exercitationem architecto assumenda dicta! Dolor minima tenetur sint minus similique animi officiis voluptatem aut sed hic vitae, magnam explicabo molestias dolore eum soluta ut tempore doloremque.ываsdweff2Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p style=\\"text-align: justify;\\"></p><p style=\\"text-align: justify;\\"></p><p style=\\"text-align: justify;\\"><strong>Totam laudantium sequi quod debitis</strong>. Aperiam ratione officiis nobis veritatis labore quis error iste rerum corporis modi. Enim distinctio natus commodi magni eveniet eius ex accusamus quos magnam, beatae nesciunt, id voluptatibus delectus inventore fugit quidem assumenda repudiandae odit nobis facilis esse! Dignissimos ab magni dolor natus excepturi totam tempore fugiat accusantium qui est minus et ea corrupti, illo reprehenderit nam nemo similique at dolores, quidem exercitationem architecto assumenda dicta! Dolor minima tenetur sint minus similique animi officiis voluptatem aut sed hic vitae, magnam explicabo molestias dolore eum soluta ut tempore doloremque.ываsdweff2Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p style=\\"text-align: justify;\\"></p><p style=\\"text-align: justify;\\">Totam laudantium sequi quod debitis. Aperiam ratione officiis nobis veritatis labore quis error iste rerum corporis modi. Enim distinctio natus commodi magni eveniet eius ex accusamus quos magnam, beatae nesciunt, id voluptatibus delectus inventore fugit quidem assumenda repudiandae odit nobis facilis esse! Dignissimos ab magni dolor natus excepturi totam tempore fugiat accusantium qui est minus et ea corrupti, illo reprehenderit nam nemo similique at dolores, quidem exercitationem architecto assumenda dicta! Dolor minima tenetur sint minus similique animi officiis voluptatem aut sed hic vitae, magnam explicabo molestias dolore eum soluta ut tempore doloremque.ываsdweff2</p>"}	{"parents": [], "spouses": [], "children": []}	2026-05-06 10:52:58	2026-05-28 20:53:24	\N
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: condolences; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.condolences (id, anket_id, user_id, author_name, message, created_at, updated_at) FROM stdin;
1	23	52	Емельянова Инна Евгеньевна	Debitis laudantium itaque eos non et est. Ex tempore aliquam iusto non. Modi et optio error molestias qui expedita.	2026-05-02 12:57:09	2026-05-02 12:57:09
2	24	54	Яна Борисовна Соколова	Est labore dolores cum nobis corporis pariatur. Et atque et est cum dolorem dolor quos. Iusto amet sed eos soluta similique sequi temporibus.	2026-05-02 12:57:09	2026-05-02 12:57:09
3	25	56	Трофимова Кристина Алексеевна	Voluptatem et explicabo quasi quis ab. Iste qui voluptas distinctio provident labore in quasi. Aut quae voluptatem sed est et adipisci. Ut sequi minus facilis molestiae sunt.	2026-05-02 12:57:09	2026-05-02 12:57:09
4	26	58	Андреева Розалина Владимировна	Enim rerum facere maiores dolorem itaque suscipit. Voluptatem sequi explicabo et aliquam culpa aut.	2026-05-02 12:57:09	2026-05-02 12:57:09
5	27	60	Богдан Александрович Буров	Qui eius in placeat ab aliquid dignissimos. Eaque est qui voluptate ipsam dolorem qui. Dolore quibusdam cum reiciendis et aliquid molestiae. Est ullam voluptatem illum numquam quaerat aut rerum enim.	2026-05-02 12:57:09	2026-05-02 12:57:09
6	28	62	Андреева Вероника Фёдоровна	Aut consequuntur sint assumenda fugiat consequatur. Iste et officiis quidem. Veritatis dolores ea modi itaque accusamus. Earum placeat aspernatur esse eum quia.	2026-05-02 12:57:09	2026-05-02 12:57:09
7	29	64	Казаков Эдуард Дмитриевич	Et voluptatem labore corrupti ea. Ut hic a qui dignissimos in fugiat et. Quisquam et consequatur ad facilis vitae vero.	2026-05-02 12:57:09	2026-05-02 12:57:09
8	30	66	Захарова Евгения Алексеевна	Atque provident aliquid et delectus ut. Quibusdam consequatur vitae voluptatibus et delectus qui harum.	2026-05-02 12:57:09	2026-05-02 12:57:09
9	31	\N	Богдан Алексеевич Гущин	Corporis possimus temporibus sit distinctio molestiae sit. Libero saepe consequatur ea. Laborum qui assumenda ea nulla.	2026-05-02 12:57:10	2026-05-02 12:57:10
10	32	\N	Игнатова Ксения Ивановна	Id dolore et quasi quo ut nihil. Temporibus consequatur commodi odit dolorum enim. Possimus vel labore ducimus.	2026-05-02 12:57:10	2026-05-02 12:57:10
11	33	\N	Сергеев Антон Дмитриевич	Ut ut non commodi voluptatibus. Provident odit doloribus omnis nostrum possimus. Voluptatum vero ratione suscipit qui incidunt rerum officia accusantium.	2026-05-02 12:57:10	2026-05-02 12:57:10
12	38	\N	епгапро	про	2026-05-18 12:20:56	2026-05-18 12:20:56
13	38	\N	Колян	фыфыв	2026-05-18 12:38:20	2026-05-18 12:38:20
14	42	\N	Анна	Светлая память...	2026-05-22 11:51:40	2026-05-22 11:51:40
15	42	\N	Иван	Царствие небесное	2026-05-22 11:51:40	2026-05-22 11:51:40
16	42	\N	Елена	Помним и любим	2026-05-22 11:51:40	2026-05-22 11:51:40
17	38	\N	Аноним	sfdsf	2026-05-28 14:44:41	2026-05-28 14:44:41
18	38	\N	Аноним	ебал ее на вписке	2026-05-28 20:02:19	2026-05-28 20:02:19
19	38	72	Николай	топ телка	2026-05-28 20:10:00	2026-05-28 20:10:00
\.


--
-- Data for Name: drevs; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.drevs (id, user_id, title, description, data, created_at, updated_at, deleted_at) FROM stdin;
1	22	Laborum molestiae sint id.	Assumenda omnis repellendus qui qui. Numquam hic ut adipisci. Nam quia quibusdam qui deleniti sapiente aliquid.	{"members": [], "generations": 1}	2026-05-02 12:57:01	2026-05-02 12:57:01	\N
2	23	Sed doloribus ab.	Deleniti quasi et porro repellendus aliquid rerum. Quisquam recusandae dolor et magnam rem in repellat. Soluta qui fugit recusandae consequuntur architecto. Voluptas enim alias quas culpa.	{"members": [], "generations": 5}	2026-05-02 12:57:01	2026-05-02 12:57:01	\N
3	24	In tempore illum exercitationem.	Facilis delectus dolorum qui ea impedit. Voluptatum impedit illum qui qui sint quo saepe. Omnis et nemo velit omnis minima sunt placeat sequi. Sit placeat ipsam laudantium voluptas voluptates dolor.	{"members": [], "generations": 3}	2026-05-02 12:57:01	2026-05-02 12:57:01	\N
4	25	Dicta voluptates expedita.	Tenetur eaque et quibusdam laudantium officia. Exercitationem enim accusamus provident maxime. Vitae quidem unde ipsa aut odit quia.	{"members": [], "generations": 4}	2026-05-02 12:57:01	2026-05-02 12:57:01	\N
5	26	Ut quia explicabo.	Omnis qui voluptas est voluptatum voluptas perferendis aspernatur repellat. Id asperiores rem enim ratione iure rerum qui tempore. Totam minus earum reprehenderit suscipit. Ut qui non cum quisquam ut consequatur deserunt.	{"members": [], "generations": 1}	2026-05-02 12:57:01	2026-05-02 12:57:01	\N
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_05_02_112508_create_personal_access_tokens_table	1
5	2026_05_02_120000_create_ankets_table	1
6	2026_05_02_120001_create_drevs_table	1
7	2026_05_02_120002_create_novosti_table	1
8	2026_05_02_120003_create_transactions_table	1
9	2026_05_02_120004_create_condolences_table	1
10	2026_05_02_120005_create_fulltext_indexes	1
11	2026_05_10_114403_add_max_gallery_images_to_users_table	2
12	2026_05_14_110146_add_max_videos_to_users_table	3
13	2026_05_28_144637_add_name_changed_at_to_users_table	4
14	2026_05_28_200518_add_unique_condolence_per_user	5
\.


--
-- Data for Name: novosti; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.novosti (id, user_id, title, slug, content, published_at, created_at, updated_at, deleted_at) FROM stdin;
1	27	Voluptas assumenda laudantium nihil error.	omnis-voluptatem-doloribus	{"body": "Autem praesentium sint est fuga quod debitis fugiat et. Qui ut in vero tempora sed ab ducimus. Itaque possimus est facilis sed qui.\\n\\nAut nemo tenetur explicabo dolore voluptas. Aut dolor ipsam non temporibus quidem. Voluptas est pariatur tenetur ipsa.\\n\\nUllam a ut doloremque consequuntur. Porro tenetur molestiae debitis numquam saepe earum rerum error. Incidunt dolorem quod et ducimus dolores molestias.", "excerpt": "Et vitae et sint ducimus quisquam."}	2026-04-26 23:32:07	2026-05-02 12:57:02	2026-05-02 12:57:02	\N
2	28	Corrupti dolores deleniti.	laborum-voluptatem-nulla	{"body": "Assumenda error ut error qui. Vel ad expedita ea voluptas. Dolorem ipsum ratione id asperiores quam ipsum quas. Est suscipit veniam laudantium ab odio consectetur praesentium quasi.\\n\\nExcepturi facere sint et ut similique. Occaecati nihil voluptatem veritatis repudiandae molestiae sunt. Dolores aut veritatis eos consequatur.\\n\\nSaepe minima sunt repellendus qui beatae reiciendis. Eius voluptas quisquam ut quam animi molestiae. Rem ut quia adipisci eos earum. Eos dolores voluptatem consectetur atque.", "excerpt": "Ut veritatis voluptatem totam accusamus omnis."}	2026-02-03 02:56:39	2026-05-02 12:57:02	2026-05-02 12:57:02	\N
3	29	Earum temporibus culpa ut possimus.	quibusdam-dolorum-velit	{"body": "Aperiam nulla et doloremque maxime quae. Blanditiis laborum dignissimos ullam autem ut distinctio. Ut labore debitis ut.\\n\\nAmet harum odio expedita ex veritatis. Velit ab facilis qui iste harum. Laboriosam repudiandae culpa voluptas dolorem iure odit ut. Beatae laudantium quam aut quam ut quis.\\n\\nVoluptatum sed quas libero sit delectus in voluptatem atque. Nostrum sed eius ipsum reprehenderit omnis ab totam. Fugiat et aspernatur et. Pariatur architecto laudantium esse sit.", "excerpt": "Delectus corrupti nobis et culpa."}	2026-03-18 11:14:34	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
4	30	Error explicabo sed quae earum.	eum-quae-repellendus	{"body": "Quisquam blanditiis eaque odit minima. Perspiciatis quam perspiciatis cumque fugiat perferendis labore ut dignissimos. Quis eos cum qui aut quas debitis. Est ea magni cupiditate nihil.\\n\\nPerferendis est ullam quibusdam numquam omnis. Adipisci consequatur voluptatem eum esse maiores id autem. Voluptatem voluptate eligendi facilis consequatur dicta. Facere quia accusantium odio quia cupiditate hic fugiat nostrum.\\n\\nNeque harum et sunt qui. Error ut aut cum cum ab. Velit nisi omnis rerum adipisci officiis. Omnis fuga ex eos debitis aut numquam perferendis.", "excerpt": "Minima velit deserunt maxime nostrum rerum animi."}	2025-10-03 20:58:07	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
5	31	Nulla dignissimos reiciendis ut rerum dolorem.	quia-blanditiis-voluptatem	{"body": "Deleniti laudantium mollitia porro. Corporis dolore ducimus perferendis rerum quia itaque. Voluptatem qui sunt dignissimos dolores non iusto.\\n\\nQuo quam quo nihil vero in. Dolorem est eos quibusdam error harum. Doloribus reiciendis nostrum totam aperiam in exercitationem repellat.\\n\\nSimilique itaque quia corrupti sint molestiae deserunt nihil. Excepturi veritatis et qui necessitatibus voluptatum ut eveniet. Quidem expedita est omnis illum perspiciatis velit.", "excerpt": "Repellat tempore tenetur accusamus fugiat ullam ipsam."}	2025-06-20 03:05:24	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
6	32	Sit eos accusantium id.	quam-odit-adipisci	{"body": "Deleniti distinctio qui et in. Consequatur deserunt quod ea animi provident. Quam doloremque repellendus accusantium sint non earum. Mollitia sapiente id officiis omnis dicta.\\n\\nQuia perferendis corporis nisi assumenda aut aut vero. Officia voluptas molestiae voluptatem. Autem nisi sint quia voluptatem. Voluptatum non ipsum odit labore et. Nostrum iusto dolore veritatis rem repellat necessitatibus et.\\n\\nExercitationem laborum quod numquam vero et sunt. Dolor voluptatibus animi in et odio odio. Aut adipisci maiores omnis aut corrupti non quia.", "excerpt": "Et placeat eos et excepturi."}	2026-03-02 21:42:30	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
7	33	Dolorum natus facere unde fugiat.	inventore-sed-cumque	{"body": "Quae dolores aut quis id quo. Et est vitae consequatur illum mollitia voluptas deleniti. Hic pariatur eum temporibus est iusto.\\n\\nLabore architecto ipsum quia impedit similique sit. Commodi repellat in ipsam cupiditate et fugiat. Ut ullam eos cum est quo. Voluptates ex asperiores earum adipisci odit et.\\n\\nAutem consequatur dolore id consequuntur et eveniet ut. Harum quaerat iusto consequatur nobis ut totam voluptatem. Eos inventore voluptatem recusandae ut dolorem fugiat sit. Eaque ut eaque provident repellat reiciendis hic.", "excerpt": "Rem ratione dolore ipsum quisquam."}	2025-06-28 05:36:10	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
8	34	Quo optio nesciunt rem corrupti.	fuga-perferendis-voluptatibus	{"body": "Et non ipsam facilis sed. Voluptates dicta quia expedita eaque culpa quidem ducimus. Molestias error commodi repellat id. Vel optio omnis vel laborum eum accusamus.\\n\\nRepudiandae et perspiciatis adipisci et voluptatibus nobis. Quasi velit qui omnis aliquam quo culpa maxime. Adipisci dolor enim odio.\\n\\nArchitecto natus dolor at ullam voluptate hic. Dolore cumque impedit numquam reiciendis excepturi eius et. Architecto minima in cum.", "excerpt": "Rerum nesciunt eaque rem magnam."}	2025-06-29 01:00:44	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
9	35	Temporibus accusamus corporis aut.	illum-libero-reprehenderit	{"body": "Mollitia officiis possimus dolorum at. Reiciendis nihil assumenda voluptatum quibusdam commodi voluptates. Magnam sunt vero odio voluptatem qui aliquid harum sit. Totam nemo sapiente delectus.\\n\\nEt deserunt voluptatem laborum possimus fugiat deleniti eum. Et in ipsa aperiam et. Cum consequatur et sint nulla odio repellat. Magnam repudiandae recusandae officia quod.\\n\\nLaborum amet totam quaerat culpa recusandae reiciendis est. Earum qui est alias dolorem sapiente at. Dolorem facilis impedit voluptatibus minima. Ratione non voluptates aut fugiat doloribus id adipisci.", "excerpt": "Beatae voluptate aperiam totam facere."}	\N	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
10	36	Animi a natus.	et-vero-vero	{"body": "Nihil iste voluptatem natus accusantium vel ex nisi. Voluptatem aut dolorem quos. Odit quia voluptas at fugiat quo asperiores.\\n\\nTenetur ex rerum et quo alias. Ut corrupti consequuntur aut. Quam consequatur saepe illo sit.\\n\\nMolestiae autem recusandae molestiae voluptatem. Et magni odio minima quo. Quam quis ullam earum id unde vero. Aut et a et in.", "excerpt": "Ut sunt sunt quibusdam porro."}	\N	2026-05-02 12:57:03	2026-05-02 12:57:03	\N
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
1	App\\Models\\User	71	api	bf56113a5ed0f677db0a12c16129a7b24d9deeb91192c0141080a099f2a44e27	["*"]	\N	\N	2026-05-02 13:08:17	2026-05-02 13:08:17
59	App\\Models\\User	1	api	a47b1eb986da09bf4416769964b6cf77a50e95ae264ef8ac7a2068e54ab1514e	["*"]	2026-05-22 13:43:24	\N	2026-05-22 13:43:24	2026-05-22 13:43:24
65	App\\Models\\User	72	api	2c82d44ecdbc9b7860f34609342fa96b692857b9676efad7fe0077bd6ca9ae3c	["*"]	2026-06-09 12:20:08	\N	2026-06-09 10:40:57	2026-06-09 12:20:08
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.transactions (id, user_id, purchasable_type, purchasable_id, amount, currency, status, yookassa_id, metadata, created_at, updated_at) FROM stdin;
1	37	App\\Models\\Anket	16	2964.39	RUB	succeeded	503b30db-05c0-3348-afa9-109560ff3ec5	\N	2026-05-02 12:57:04	2026-05-02 12:57:04
2	39	App\\Models\\Anket	17	8388.01	RUB	succeeded	6c8a8edf-8781-31a8-b35e-d9313781aa3c	\N	2026-05-02 12:57:04	2026-05-02 12:57:04
3	41	App\\Models\\Anket	18	2311.57	RUB	succeeded	b2558e09-abb7-303e-ba84-3d9c6896820e	\N	2026-05-02 12:57:05	2026-05-02 12:57:05
4	43	App\\Models\\Anket	19	9505.64	RUB	succeeded	1b633815-2dfa-3137-aaf4-10748a6c1e6d	\N	2026-05-02 12:57:05	2026-05-02 12:57:05
5	45	App\\Models\\Anket	20	1628.89	RUB	succeeded	bf4b4bd9-8fa1-3c18-ab31-2fafa2efb144	\N	2026-05-02 12:57:05	2026-05-02 12:57:05
6	47	App\\Models\\Anket	21	5274.10	RUB	pending	4a2fdbfa-8486-338f-b88c-e885e68487aa	\N	2026-05-02 12:57:05	2026-05-02 12:57:05
7	49	App\\Models\\Anket	22	6002.27	RUB	pending	bf05613b-77a3-3179-bd71-3f74a7b9e8ef	\N	2026-05-02 12:57:05	2026-05-02 12:57:05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: kod
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at, max_gallery_images, max_videos, name_changed_at) FROM stdin;
1	Test User	test@example.com	2026-05-02 12:56:55	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	pVF9k4Snoc	2026-05-02 12:56:55	2026-05-02 12:56:55	6	6	\N
2	Аксёнова Рената Дмитриевна	kmukin@example.com	2026-05-02 12:56:55	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	M9NMLCHSg5	2026-05-02 12:56:55	2026-05-02 12:56:55	6	6	\N
3	Людмила Алексеевна Кузьмина	dary13@example.org	2026-05-02 12:56:55	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	YSHffwwmxw	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
4	Ева Евгеньевна Петухова	nikiforova.daniil@example.org	2026-05-02 12:56:55	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	WkiT1AKMOb	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
5	Витольд Иванович Галкин	qmaslova@example.org	2026-05-02 12:56:55	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	M2RCyO1tCV	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
6	Вишнякова Федосья Александровна	elizaveta88@example.org	2026-05-02 12:56:55	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	hI7oEj0BUq	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
7	Геннадий Андреевич Панов	nika.kononova@example.org	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	v9OjNn0kkO	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
8	Беляева Альбина Максимовна	liliy38@example.com	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	peESkFrLDj	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
9	Михеева Майя Алексеевна	dfadeev@example.com	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	E2NsCqjzR5	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
10	Агафонов Всеволод Львович	robert19@example.com	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	skP6ufAL92	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
11	Фаина Андреевна Рожкова	dominika86@example.org	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	mZRnIl0p2o	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
12	Мясников Родион Фёдорович	ukotova@example.net	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	0SDEC09UFd	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
13	Стефан Евгеньевич Третьяков	alina18@example.com	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	yScG4w741P	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
14	Инга Ивановна Костина	nikolai.solovev@example.org	2026-05-02 12:56:56	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	L9hizYlSAL	2026-05-02 12:56:56	2026-05-02 12:56:56	6	6	\N
15	Кузнецов Матвей Максимович	gusin.ivan@example.org	2026-05-02 12:56:57	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	DroCthWnXw	2026-05-02 12:56:57	2026-05-02 12:56:57	6	6	\N
16	Костин Леонид Дмитриевич	timur89@example.org	2026-05-02 12:56:57	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	aDpY7vtZgX	2026-05-02 12:56:57	2026-05-02 12:56:57	6	6	\N
17	Прохорова Виктория Сергеевна	gzuravleva@example.net	2026-05-02 12:56:58	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	5TFgbvtbb0	2026-05-02 12:56:58	2026-05-02 12:56:58	6	6	\N
18	Аксёнова Анжелика Романовна	osipova.sergei@example.net	2026-05-02 12:56:58	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	SPQ3uG0bxP	2026-05-02 12:56:58	2026-05-02 12:56:58	6	6	\N
19	Алина Романовна Алексеева	inessa13@example.com	2026-05-02 12:56:58	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	I4I1GFmpM2	2026-05-02 12:56:58	2026-05-02 12:56:58	6	6	\N
20	Гуляев Марат Алексеевич	anna80@example.org	2026-05-02 12:56:58	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	5yPoehLxdI	2026-05-02 12:56:58	2026-05-02 12:56:58	6	6	\N
21	Надежда Романовна Исаева	kononov.artem@example.com	2026-05-02 12:56:58	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	6N39jCyXVt	2026-05-02 12:56:58	2026-05-02 12:56:58	6	6	\N
22	Прохор Иванович Абрамов	innokentii46@example.org	2026-05-02 12:56:58	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	McrYDfEUXB	2026-05-02 12:56:58	2026-05-02 12:56:58	6	6	\N
23	Даниил Борисович Белов	melnikova.gavriil@example.org	2026-05-02 12:56:59	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	I6k6GZCaz2	2026-05-02 12:56:59	2026-05-02 12:56:59	6	6	\N
24	Ситников Анатолий Владимирович	qvorobeva@example.com	2026-05-02 12:57:01	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	76RYaxlZBb	2026-05-02 12:57:01	2026-05-02 12:57:01	6	6	\N
25	Одинцов Виталий Романович	gordei18@example.com	2026-05-02 12:57:01	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	zs9a5MgQ41	2026-05-02 12:57:01	2026-05-02 12:57:01	6	6	\N
26	Антонина Алексеевна Лобанова	gromov.viktoriy@example.net	2026-05-02 12:57:01	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	RDtomNBaez	2026-05-02 12:57:01	2026-05-02 12:57:01	6	6	\N
27	Бирюков Ираклий Романович	faina89@example.net	2026-05-02 12:57:01	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	IDMgGo7KaS	2026-05-02 12:57:01	2026-05-02 12:57:01	6	6	\N
28	Всеволод Евгеньевич Шилов	rmelnikov@example.org	2026-05-02 12:57:01	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	xqiFk4mBMT	2026-05-02 12:57:01	2026-05-02 12:57:01	6	6	\N
29	Василиса Максимовна Турова	iosif28@example.com	2026-05-02 12:57:02	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	jm7Hwp5Xu0	2026-05-02 12:57:02	2026-05-02 12:57:02	6	6	\N
30	Артём Александрович Захаров	vyceslav.matveev@example.org	2026-05-02 12:57:02	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	ZE9Nnmrgmn	2026-05-02 12:57:02	2026-05-02 12:57:02	6	6	\N
31	София Сергеевна Маслова	mark36@example.org	2026-05-02 12:57:02	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	hsU66ujK9y	2026-05-02 12:57:02	2026-05-02 12:57:02	6	6	\N
32	Ника Борисовна Максимова	medvedev.evgeniy@example.com	2026-05-02 12:57:02	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	odnt2uJZrW	2026-05-02 12:57:02	2026-05-02 12:57:02	6	6	\N
33	Лаврентьева Оксана Львовна	zinaida11@example.com	2026-05-02 12:57:02	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	2CD12dmjKy	2026-05-02 12:57:02	2026-05-02 12:57:02	6	6	\N
34	Михайлов Глеб Дмитриевич	viktor68@example.org	2026-05-02 12:57:02	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	abpHbaFXeC	2026-05-02 12:57:02	2026-05-02 12:57:02	6	6	\N
35	Ульяна Фёдоровна Логинова	klavdiy77@example.org	2026-05-02 12:57:03	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	SmVrUdtAGB	2026-05-02 12:57:03	2026-05-02 12:57:03	6	6	\N
36	Силин Никодим Борисович	wbragin@example.org	2026-05-02 12:57:03	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	BmOm8I4kfO	2026-05-02 12:57:03	2026-05-02 12:57:03	6	6	\N
37	Вениамин Андреевич Сазонов	wguseva@example.org	2026-05-02 12:57:03	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	u5u6GP0HYu	2026-05-02 12:57:03	2026-05-02 12:57:03	6	6	\N
38	Гурьева Ника Владимировна	immanuil58@example.com	2026-05-02 12:57:03	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	GcXTmT85bY	2026-05-02 12:57:03	2026-05-02 12:57:03	6	6	\N
39	Богдан Максимович Крылов	oleg.nekrasova@example.org	2026-05-02 12:57:03	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	iUqPHwnmxj	2026-05-02 12:57:03	2026-05-02 12:57:03	6	6	\N
40	Семёнова Клавдия Андреевна	sergei.isakov@example.com	2026-05-02 12:57:03	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	s1u3ZxEXtl	2026-05-02 12:57:03	2026-05-02 12:57:03	6	6	\N
41	Вишняков Герасим Романович	efim.konstantinov@example.com	2026-05-02 12:57:04	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	uT7kPdcuri	2026-05-02 12:57:04	2026-05-02 12:57:04	6	6	\N
42	Вячеслав Львович Овчинников	rozalina.medvedeva@example.com	2026-05-02 12:57:04	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	npStoyXPHY	2026-05-02 12:57:04	2026-05-02 12:57:04	6	6	\N
43	Тарасов Олег Алексеевич	konstantinov.mariy@example.net	2026-05-02 12:57:04	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	4AU8KjeaY2	2026-05-02 12:57:04	2026-05-02 12:57:04	6	6	\N
44	Анфиса Борисовна Дьячкова	srybova@example.com	2026-05-02 12:57:04	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	Qhcwedq1SW	2026-05-02 12:57:04	2026-05-02 12:57:04	6	6	\N
45	Злата Максимовна Маркова	avgust.bobrova@example.net	2026-05-02 12:57:04	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	5HEgP6EeFq	2026-05-02 12:57:04	2026-05-02 12:57:04	6	6	\N
46	Логинова Полина Владимировна	hkornilova@example.com	2026-05-02 12:57:04	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	Wa0NmkboFQ	2026-05-02 12:57:04	2026-05-02 12:57:04	6	6	\N
47	Татьяна Андреевна Авдеева	bmelnikova@example.net	2026-05-02 12:57:05	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	4ndpW8NIzp	2026-05-02 12:57:05	2026-05-02 12:57:05	6	6	\N
48	Сава Владимирович Ларионов	lazarev.marat@example.com	2026-05-02 12:57:05	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	DX6c6KlC3k	2026-05-02 12:57:05	2026-05-02 12:57:05	6	6	\N
49	Панов Валерий Борисович	nkostina@example.com	2026-05-02 12:57:05	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	lSPtDi38SH	2026-05-02 12:57:05	2026-05-02 12:57:05	6	6	\N
50	Ефремов Глеб Евгеньевич	garri27@example.org	2026-05-02 12:57:05	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	PZA5hj0iEQ	2026-05-02 12:57:05	2026-05-02 12:57:05	6	6	\N
51	Илья Владимирович Алексеев	avgust.karitonova@example.org	2026-05-02 12:57:06	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	zO69HPMQNQ	2026-05-02 12:57:06	2026-05-02 12:57:06	6	6	\N
52	Дмитрий Львович Степанов	raisa40@example.com	2026-05-02 12:57:06	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	JPDxwAmi23	2026-05-02 12:57:06	2026-05-02 12:57:06	6	6	\N
53	Софья Ивановна Русакова	serbakova.kseniy@example.com	2026-05-02 12:57:06	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	nBmqpEzbH3	2026-05-02 12:57:06	2026-05-02 12:57:06	6	6	\N
54	Капитолина Ивановна Сысоева	zanna.belozerov@example.com	2026-05-02 12:57:07	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	Z9UXLFPtLG	2026-05-02 12:57:07	2026-05-02 12:57:07	6	6	\N
55	Богдан Андреевич Орлов	vorontova.eduard@example.net	2026-05-02 12:57:07	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	smAqN17bYP	2026-05-02 12:57:07	2026-05-02 12:57:07	6	6	\N
56	Никифорова Анжелика Сергеевна	taisiy.tikonova@example.org	2026-05-02 12:57:07	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	n5txIL7H9r	2026-05-02 12:57:07	2026-05-02 12:57:07	6	6	\N
57	Кириллова Ксения Борисовна	feliks61@example.net	2026-05-02 12:57:07	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	Eam9JkvcYE	2026-05-02 12:57:07	2026-05-02 12:57:07	6	6	\N
58	Лобанова Рената Дмитриевна	alena.gromova@example.net	2026-05-02 12:57:07	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	XVfYgUMHpj	2026-05-02 12:57:07	2026-05-02 12:57:07	6	6	\N
59	Блинов Дмитрий Иванович	artemev.sofy@example.org	2026-05-02 12:57:08	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	f9ggXMXwld	2026-05-02 12:57:08	2026-05-02 12:57:08	6	6	\N
60	Лобанов Руслан Владимирович	maiy.bolsakova@example.org	2026-05-02 12:57:08	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	KoMMT7UJnW	2026-05-02 12:57:08	2026-05-02 12:57:08	6	6	\N
61	Горшкова Эльвира Борисовна	tteterin@example.com	2026-05-02 12:57:08	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	BYCYDaNdun	2026-05-02 12:57:08	2026-05-02 12:57:08	6	6	\N
62	Михеева Софья Борисовна	ignatii20@example.com	2026-05-02 12:57:08	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	0T1YaBCI4o	2026-05-02 12:57:08	2026-05-02 12:57:08	6	6	\N
63	Евгения Борисовна Бобылёва	viktor73@example.net	2026-05-02 12:57:08	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	aUpozgSE6S	2026-05-02 12:57:08	2026-05-02 12:57:08	6	6	\N
64	Гордей Львович Сорокин	renata41@example.net	2026-05-02 12:57:09	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	rnvN5Jae89	2026-05-02 12:57:09	2026-05-02 12:57:09	6	6	\N
65	Рената Евгеньевна Аксёнова	misin.rozalina@example.org	2026-05-02 12:57:09	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	Qu8xDpXXac	2026-05-02 12:57:09	2026-05-02 12:57:09	6	6	\N
66	Коновалова Рената Борисовна	makar87@example.net	2026-05-02 12:57:09	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	ksLHS0jHcI	2026-05-02 12:57:09	2026-05-02 12:57:09	6	6	\N
67	Савва Сергеевич Карпов	zykov.miroslav@example.net	2026-05-02 12:57:09	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	BAAaBzg62n	2026-05-02 12:57:09	2026-05-02 12:57:09	6	6	\N
68	Зиновьев Влад Дмитриевич	faina36@example.org	2026-05-02 12:57:09	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	83oqk6dN2i	2026-05-02 12:57:09	2026-05-02 12:57:09	6	6	\N
69	Лилия Сергеевна Власова	alena.noskov@example.com	2026-05-02 12:57:10	$2y$12$X6akot192UZDd9b2KDiV..C0Cd9heNpM6eRP2FrVf6Ecmo6qgCeMu	xyPY7BMws7	2026-05-02 12:57:10	2026-05-02 12:57:10	6	6	\N
70	Test	apitest@example.com	\N	$2y$12$b1gNQkH71N4A0VZVtQAkXeRZ8V7bwwMkXccZU2tvAKgaReanFL0B2	\N	2026-05-02 13:07:34	2026-05-02 13:07:34	6	6	\N
71	API Test	newapitest@example.com	\N	$2y$12$2h5xdgW16jy5TCKrctJ5FuJlQNZOCsdx.pFlfmAHb9szoPTEWnkLC	\N	2026-05-02 13:08:17	2026-05-02 13:08:17	6	6	\N
72	Николай	frederol123@gmail.com	\N	$2y$12$MWkyN3nBXrE/k1pWhWBRxetZaPJxzP1PFWzE1fFv/rkpJnQZtVgsy	\N	2026-05-02 14:02:08	2026-06-01 10:08:04	6	6	\N
\.


--
-- Name: ankets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.ankets_id_seq', 42, true);


--
-- Name: condolences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.condolences_id_seq', 19, true);


--
-- Name: drevs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.drevs_id_seq', 5, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.migrations_id_seq', 14, true);


--
-- Name: novosti_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.novosti_id_seq', 10, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 65, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.transactions_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kod
--

SELECT pg_catalog.setval('public.users_id_seq', 72, true);


--
-- Name: ankets ankets_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.ankets
    ADD CONSTRAINT ankets_pkey PRIMARY KEY (id);


--
-- Name: ankets ankets_slug_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.ankets
    ADD CONSTRAINT ankets_slug_unique UNIQUE (slug);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: condolences condolences_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.condolences
    ADD CONSTRAINT condolences_pkey PRIMARY KEY (id);


--
-- Name: condolences condolences_user_anket_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.condolences
    ADD CONSTRAINT condolences_user_anket_unique UNIQUE (user_id, anket_id);


--
-- Name: drevs drevs_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.drevs
    ADD CONSTRAINT drevs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: novosti novosti_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.novosti
    ADD CONSTRAINT novosti_pkey PRIMARY KEY (id);


--
-- Name: novosti novosti_slug_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.novosti
    ADD CONSTRAINT novosti_slug_unique UNIQUE (slug);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_yookassa_id_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_yookassa_id_unique UNIQUE (yookassa_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ankets_status_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX ankets_status_index ON public.ankets USING btree (status);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: idx_ankets_info_name; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX idx_ankets_info_name ON public.ankets USING gin (((info ->> 'first_name'::text)) public.gin_trgm_ops, ((info ->> 'last_name'::text)) public.gin_trgm_ops, ((info ->> 'middle_name'::text)) public.gin_trgm_ops);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: novosti_published_at_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX novosti_published_at_index ON public.novosti USING btree (published_at);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: transactions_purchasable_type_purchasable_id_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX transactions_purchasable_type_purchasable_id_index ON public.transactions USING btree (purchasable_type, purchasable_id);


--
-- Name: transactions_status_index; Type: INDEX; Schema: public; Owner: kod
--

CREATE INDEX transactions_status_index ON public.transactions USING btree (status);


--
-- Name: ankets ankets_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.ankets
    ADD CONSTRAINT ankets_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: condolences condolences_anket_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.condolences
    ADD CONSTRAINT condolences_anket_id_foreign FOREIGN KEY (anket_id) REFERENCES public.ankets(id) ON DELETE CASCADE;


--
-- Name: condolences condolences_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.condolences
    ADD CONSTRAINT condolences_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: drevs drevs_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.drevs
    ADD CONSTRAINT drevs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: novosti novosti_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.novosti
    ADD CONSTRAINT novosti_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kod
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 3TZkuoRQSkRPnGAEFReEVS9tk4qGAutyuEYS4KBnX0vncZ2Eeume3y0lRVaA4z1

