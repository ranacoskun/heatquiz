-- Export URLs referenced by a specific CourseMap (MapId) into a single result set.
-- Works even if some tables are missing by checking existence first.
--
-- Usage (psql):
--   psql ... -v map_id=31 -f scripts/export_used_urls_map.sql > used_map31_urls.txt

\set ON_ERROR_STOP on

-- Required variable
\if :{?map_id}
\else
\echo "ERROR: missing -v map_id=<number> (example: -v map_id=31)"
\quit 1
\endif

-- Note: DO NOT use "ON COMMIT DROP" here because psql autocommits each statement by default.
-- With ON COMMIT DROP, the temp table would be created and immediately dropped after that statement.
CREATE TEMP TABLE tmp_used_urls(url text);

-- Detect optional tables (psql-side) so we can skip sections cleanly.
SELECT to_regclass('public."QuestionSeriesElement"') IS NOT NULL AS has_qse \gset
SELECT to_regclass('public."QuestionBase"') IS NOT NULL AS has_qb \gset
SELECT to_regclass('public."KeyboardQuestion"') IS NOT NULL AS has_kq \gset
SELECT to_regclass('public."MultipleChoiceQuestion"') IS NOT NULL AS has_mcq \gset

-- 1) Map background (LargeMapURL)
INSERT INTO tmp_used_urls(url)
SELECT "LargeMapURL"
FROM "CourseMap"
WHERE "Id" = :map_id
  AND "LargeMapURL" IS NOT NULL
  AND "LargeMapURL" <> '';

-- 2) Element button images (Play/PDF/Video/Link) used by this map
WITH map_imgs AS (
  SELECT DISTINCT "CourseMapElementImagesId" AS img_id
  FROM "CourseMapElement"
  WHERE "MapId" = :map_id
    AND "CourseMapElementImagesId" IS NOT NULL
)
INSERT INTO tmp_used_urls(url)
SELECT x.url
FROM (
  SELECT "Play"  AS url FROM "CourseMapElementImages" WHERE "Id" IN (SELECT img_id FROM map_imgs)
  UNION ALL
  SELECT "PDF"   AS url FROM "CourseMapElementImages" WHERE "Id" IN (SELECT img_id FROM map_imgs)
  UNION ALL
  SELECT "Video" AS url FROM "CourseMapElementImages" WHERE "Id" IN (SELECT img_id FROM map_imgs)
  UNION ALL
  SELECT "Link"  AS url FROM "CourseMapElementImages" WHERE "Id" IN (SELECT img_id FROM map_imgs)
) x
WHERE x.url IS NOT NULL AND x.url <> '';

-- 3) Media directly on CourseMapElement (some maps use these)
INSERT INTO tmp_used_urls(url)
SELECT x.url
FROM (
  SELECT "PDFURL"  AS url FROM "CourseMapElement" WHERE "MapId" = :map_id
  UNION ALL
  SELECT "VideoURL" AS url FROM "CourseMapElement" WHERE "MapId" = :map_id
  UNION ALL
  SELECT "AudioURL" AS url FROM "CourseMapElement" WHERE "MapId" = :map_id
  UNION ALL
  SELECT "BackgroundImage" AS url FROM "CourseMapElement" WHERE "MapId" = :map_id
) x
WHERE x.url IS NOT NULL AND x.url <> '';

-- 4) BackgroundImage table URLs referenced by Map elements (FK)
INSERT INTO tmp_used_urls(url)
SELECT bi."URL"
FROM "CourseMapElement" e
JOIN "BackgroundImage" bi ON bi."Id" = e."Background_ImageId"
WHERE e."MapId" = :map_id
  AND e."Background_ImageId" IS NOT NULL
  AND bi."URL" IS NOT NULL
  AND bi."URL" <> '';

-- 5) Media from question series linked to this map (Map 31 uses QuestionSeriesId)
-- Only run if the underlying tables exist in this database.
\if :has_qse
\if :has_qb
INSERT INTO tmp_used_urls(url)
SELECT q."Base_ImageURL"
FROM "CourseMapElement" me
JOIN "QuestionSeriesElement" se ON se."SeriesId" = me."QuestionSeriesId"
JOIN "QuestionBase" q ON q."Id" = se."QuestionId"
WHERE me."MapId" = :map_id
  AND q."Base_ImageURL" IS NOT NULL AND q."Base_ImageURL" <> '';

INSERT INTO tmp_used_urls(url)
SELECT q."ThumbnailURL"
FROM "CourseMapElement" me
JOIN "QuestionSeriesElement" se ON se."SeriesId" = me."QuestionSeriesId"
JOIN "QuestionBase" q ON q."Id" = se."QuestionId"
WHERE me."MapId" = :map_id
  AND q."ThumbnailURL" IS NOT NULL AND q."ThumbnailURL" <> '';

INSERT INTO tmp_used_urls(url)
SELECT q."PDFURL"
FROM "CourseMapElement" me
JOIN "QuestionSeriesElement" se ON se."SeriesId" = me."QuestionSeriesId"
JOIN "QuestionBase" q ON q."Id" = se."QuestionId"
WHERE me."MapId" = :map_id
  AND q."PDFURL" IS NOT NULL AND q."PDFURL" <> '';

INSERT INTO tmp_used_urls(url)
SELECT q."VIDEOURL"
FROM "CourseMapElement" me
JOIN "QuestionSeriesElement" se ON se."SeriesId" = me."QuestionSeriesId"
JOIN "QuestionBase" q ON q."Id" = se."QuestionId"
WHERE me."MapId" = :map_id
  AND q."VIDEOURL" IS NOT NULL AND q."VIDEOURL" <> '';
\endif

\if :has_kq
INSERT INTO tmp_used_urls(url)
SELECT kq."ImageURL"
FROM "CourseMapElement" me
JOIN "QuestionSeriesElement" se ON se."SeriesId" = me."QuestionSeriesId"
JOIN "KeyboardQuestion" kq ON kq."Id" = se."KeyboardQuestionId"
WHERE me."MapId" = :map_id
  AND kq."ImageURL" IS NOT NULL AND kq."ImageURL" <> '';
\endif

\if :has_mcq
INSERT INTO tmp_used_urls(url)
SELECT mcq."ImageURL"
FROM "CourseMapElement" me
JOIN "QuestionSeriesElement" se ON se."SeriesId" = me."QuestionSeriesId"
JOIN "MultipleChoiceQuestion" mcq ON mcq."Id" = se."MultipleChoiceQuestionId"
WHERE me."MapId" = :map_id
  AND mcq."ImageURL" IS NOT NULL AND mcq."ImageURL" <> '';
\endif
\endif

-- Final output: one URL per line
SELECT DISTINCT url
FROM tmp_used_urls
WHERE url IS NOT NULL AND url <> ''
ORDER BY url;

