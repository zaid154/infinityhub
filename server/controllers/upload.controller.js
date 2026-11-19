import cloudinary from '../config/cloudinary.js';

// Helper to upload a buffer stream to Cloudinary (Images and Videos)
const uploadStreamToCloudinary = (fileBuffer, folder, mimetype) => {
  const isVideo = mimetype && (mimetype.startsWith('video') || mimetype.includes('mp4') || mimetype.includes('quicktime') || mimetype.includes('webm'));
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || process.env.CLOUDINARY_FOLDER || 'technova-hardware',
        resource_type: isVideo ? 'video' : 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: isVideo || result.resource_type === 'video' ? 'video' : 'image',
          format: result.format
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Upload multiple product images & videos to Cloudinary
// @route   POST /api/upload/images (also supports videos)
// @access  Admin only
export const uploadImages = async (req, res, next) => {
  try {
    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : [...(req.files.images || []), ...(req.files.media || [])]
      : [];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No media files uploaded.'
      });
    }

    const uploadPromises = files.map((file) =>
      uploadStreamToCloudinary(file.buffer, process.env.CLOUDINARY_FOLDER, file.mimetype)
    );

    const uploadedResults = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${uploadedResults.length} media file(s) uploaded successfully to Cloudinary.`,
      images: uploadedResults,
      media: uploadedResults
    });
  } catch (error) {
    console.error('[Cloudinary Upload Error]', error);
    next(error);
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/images
// @access  Admin only
export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
