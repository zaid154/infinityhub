import cloudinary from '../config/cloudinary.js';

// Helper to upload a buffer stream to Cloudinary
const uploadStreamToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || process.env.CLOUDINARY_FOLDER || 'technova-hardware',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Upload multiple product images to Cloudinary
// @route   POST /api/upload/images
// @access  Admin only
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded.'
      });
    }

    const uploadPromises = req.files.map((file) =>
      uploadStreamToCloudinary(file.buffer, process.env.CLOUDINARY_FOLDER)
    );

    const uploadedResults = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${uploadedResults.length} images uploaded successfully to Cloudinary.`,
      images: uploadedResults
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
