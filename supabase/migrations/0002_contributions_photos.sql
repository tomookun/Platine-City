-- Captures d'écran jointes aux contributions.
-- Bucket PRIVÉ, sans aucune policy : seul le serveur (clé service_role)
-- écrit et lit. Les photos ne deviennent publiques qu'après relecture,
-- copiées à la main dans public/photos/.
alter table public.contributions add column if not exists photo_path text check (char_length(photo_path) <= 200);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('contributions-photos', 'contributions-photos', false, 4194304, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
