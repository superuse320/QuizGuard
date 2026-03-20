create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name varchar(100) not null,
  role varchar(15) default 'student' check (role in ('student','teacher','admin')),
  created_at timestamp default now()
);
alter publication supabase_realtime add table profiles