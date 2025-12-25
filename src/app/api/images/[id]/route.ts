import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  const { id } = await params;

  try {
    const image = await prisma.vinylImage.findUnique({ where: { id } });

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    await prisma.vinylImage.delete({ where: { id } });

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
