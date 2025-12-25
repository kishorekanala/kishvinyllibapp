import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET images for a vinyl record
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Verify vinyl record exists
    const vinyl = await prisma.vinylRecord.findUnique({
      where: { id },
    });

    if (!vinyl) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    const images = await prisma.vinylImage.findMany({
      where: { vinylRecordId: id },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST add images to vinyl record
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check here
    const { id } = params;
    const body = await req.json();

    // Verify vinyl record exists
    const vinyl = await prisma.vinylRecord.findUnique({
      where: { id },
    });

    if (!vinyl) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!body.imageUrl || !body.imagePublicId) {
      return NextResponse.json(
        { success: false, error: 'imageUrl and imagePublicId are required' },
        { status: 400 }
      );
    }

    // Get the highest display order for this vinyl
    const lastImage = await prisma.vinylImage.findFirst({
      where: { vinylRecordId: id },
      orderBy: { displayOrder: 'desc' },
    });

    const newDisplayOrder = (lastImage?.displayOrder || 0) + 1;

    const image = await prisma.vinylImage.create({
      data: {
        vinylRecordId: id,
        imageUrl: body.imageUrl,
        imagePublicId: body.imagePublicId,
        altText: body.altText || '',
        displayOrder: newDisplayOrder,
      },
    });

    return NextResponse.json(
      { success: true, data: image },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

// PATCH reorder images
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check here
    const { id } = params;
    const body = await req.json();

    // Verify vinyl record exists
    const vinyl = await prisma.vinylRecord.findUnique({
      where: { id },
    });

    if (!vinyl) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    // Update all images with new display order
    if (!Array.isArray(body.images)) {
      return NextResponse.json(
        { success: false, error: 'images array is required' },
        { status: 400 }
      );
    }

    const updatePromises = body.images.map((img: { id: string; displayOrder: number }, index: number) =>
      prisma.vinylImage.update({
        where: { id: img.id },
        data: { displayOrder: index + 1 },
      })
    );

    const updatedImages = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      data: updatedImages,
      message: 'Image order updated successfully',
    });
  } catch (error) {
    console.error('Error reordering images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder images' },
      { status: 500 }
    );
  }
}
