import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: any
) {
  const { id } = params;

  try {
    const record = await prisma.vinylRecord.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: record.images });
  } catch (error) {
    console.error('Error fetching vinyl images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vinyl images' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: any
) {
  const { id } = params;

  try {
    const body = await req.json();
    const { imageUrl, caption } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const record = await prisma.vinylRecord.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    const lastImage = await prisma.vinylImage.findFirst({
      where: { vinylRecordId: id },
      orderBy: { displayOrder: 'desc' },
    });

    const nextDisplayOrder = (lastImage?.displayOrder || 0) + 1;

    const newImage = await prisma.vinylImage.create({
      data: {
        vinylRecordId: id,
        imageUrl,
        imagePublicId: 'temp',
        caption: caption || null,
        displayOrder: nextDisplayOrder,
      },
    });

    return NextResponse.json({ success: true, data: newImage });
  } catch (error) {
    console.error('Error adding vinyl image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add vinyl image' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: any
) {
  const { id } = params;

  try {
    const body = await req.json();
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { success: false, error: 'Images array is required' },
        { status: 400 }
      );
    }

    const record = await prisma.vinylRecord.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    const updatePromises = images.map((img, index) =>
      prisma.vinylImage.update({
        where: { id: img.id },
        data: { displayOrder: index },
      })
    );

    const updatedImages = await Promise.all(updatePromises);
    return NextResponse.json({ success: true, data: updatedImages });
  } catch (error) {
    console.error('Error reordering vinyl images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder vinyl images' },
      { status: 500 }
    );
  }
}
