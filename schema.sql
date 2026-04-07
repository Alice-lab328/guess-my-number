-- rooms table
create table if not exists rooms (
  id text primary key,
  status text not null default 'LOBBY', -- LOBBY, SET_SECRET, GAME, RESULTS
  host_id text not null,
  host_nickname text not null,
  host_avatar text not null,
  host_secret text,
  guest_id text,
  guest_nickname text,
  guest_avatar text,
  guest_secret text,
  winner_id text,
  round integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- guesses table
create table if not exists guesses (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(id) on delete cascade,
  player_id text not null,
  number text not null,
  matches integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up realtime
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table guesses;
