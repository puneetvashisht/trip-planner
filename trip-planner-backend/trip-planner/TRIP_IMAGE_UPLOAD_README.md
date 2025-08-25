# Trip Image Upload Functionality

This document describes the new image upload functionality added to the Trip Planner backend.

## Overview

The trip creation system now supports image uploads, allowing users to attach images to their trips. Images are stored locally in the file system and referenced by their filename in the database.

## New Features

### 1. Image Upload Endpoint
- **POST** `/api/trips/create-with-image`
- Accepts multipart form data with trip details and optional image
- Parameters:
  - `title` (required): Trip title
  - `description` (required): Trip description
  - `startDate` (required): Trip start date (YYYY-MM-DD format)
  - `endDate` (required): Trip end date (YYYY-MM-DD format)
  - `image` (optional): Image file (supports common image formats)

### 2. Image Serving Endpoint
- **GET** `/api/trips/images/{filename}` - Serves uploaded images by filename
- Returns the image with appropriate content type
- **Public Access**: This endpoint is publicly accessible without authentication
- **Use Case**: Perfect for displaying trip images in public views, sharing, or embedding in other applications

### 3. Enhanced Trip Entity
- Added `imageUrl` field to store the image filename
- Images are stored in the `./uploads/trips/` directory

## Technical Implementation

### File Storage Service (`FileStorageService`)
- Handles file uploads and storage
- Generates unique filenames using UUID
- Validates image file types
- Manages file deletion

### Security Configuration
- **Public Access**: `/api/trips/images/**` endpoints are publicly accessible
- **No Authentication Required**: Images can be viewed without JWT tokens
- **CORS Enabled**: Proper CORS configuration for cross-origin access
- **File Upload Security**: Only authenticated users can upload images

### Configuration
- File upload limits: 10MB max file size
- Upload directory: `./uploads/trips/` (configurable via `app.file.upload-dir`)
- Supported formats: All image types (JPEG, PNG, GIF, etc.)

### Security Features
- File type validation (only images allowed)
- Unique filename generation to prevent conflicts
- File size limits to prevent abuse

## Usage Examples

### Frontend Integration
```javascript
const formData = new FormData();
formData.append('title', 'My Trip');
formData.append('description', 'Amazing vacation');
formData.append('startDate', '2024-06-01');
formData.append('endDate', '2024-06-07');
formData.append('image', imageFile);

fetch('/api/trips/create-with-image', {
    method: 'POST',
    body: formData
});
```

### Displaying Images
```html
<img src="/api/trips/images/{{trip.imageUrl}}" alt="Trip Image">
```

## File Structure

```
uploads/
└── trips/
    ├── uuid1.jpg
    ├── uuid2.png
    └── uuid3.gif
```

## Database Changes

The `trips` table now includes an `image_url` column that stores the filename of the uploaded image.

## Error Handling

- Invalid file types return appropriate error messages
- File size limits are enforced
- Missing files are handled gracefully
- Database errors are properly propagated

## Testing

Use the provided `trip-image-upload-test.html` file to test the image upload functionality. This HTML file includes:
- Form for trip creation with image upload
- Image preview functionality
- Error handling and success messages
- Proper form data submission

## Future Enhancements

- Image resizing and optimization
- Multiple image support per trip
- Cloud storage integration (AWS S3, Google Cloud Storage)
- Image compression
- Thumbnail generation
- Image metadata extraction

## Notes

- Images are stored locally by default
- Consider implementing cleanup for unused images
- Monitor disk space usage in production
- Implement proper backup strategies for uploaded files
