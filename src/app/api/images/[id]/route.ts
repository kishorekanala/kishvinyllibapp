import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// DELETE individual image
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check here
    const { id } = params;

    // Find the image
    const image = await prisma.vinylImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // TODO: Delete image from Cloudinary/Vercel Blob using image.imagePublicId

    // Delete image record from database
    await prisma.vinylImage.delete({
      where: { id },
    });

    // Get remaining images count
    const remainingImages = await prisma.vinylImage.count({
      where: { vinylRecordId: image.vinylRecordId },
    });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      remainingImages,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
