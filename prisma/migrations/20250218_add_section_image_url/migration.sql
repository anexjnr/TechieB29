-- Add optional imageUrl column for sections
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'Section'
      AND column_name = 'imageUrl'
  ) THEN
    ALTER TABLE "Section" ADD COLUMN "imageUrl" TEXT;
  END IF;
END;
$$;
