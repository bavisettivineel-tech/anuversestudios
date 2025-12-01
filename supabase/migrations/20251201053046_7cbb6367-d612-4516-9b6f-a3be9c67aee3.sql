-- Make attendance-photos bucket public so photos can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'attendance-photos';

-- Add RLS policy to allow authenticated users to read their own attendance photos
CREATE POLICY "Users can view attendance photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'attendance-photos');