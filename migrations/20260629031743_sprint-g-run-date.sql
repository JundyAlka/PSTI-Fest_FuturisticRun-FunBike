UPDATE public.events
SET event_date = NULL,
    updated_at = NOW()
WHERE slug = 'futuristic-run';

UPDATE public.event_settings
SET value = '',
    updated_at = NOW()
WHERE event_type = 'futuristic-run'
  AND key = 'event_date';
