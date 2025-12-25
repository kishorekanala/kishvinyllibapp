import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { UpdateVinylRecordPayload } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET single vinyl record
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const record = await prisma.vinylRecord.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Error fetching vinyl record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vinyl record' },
      { status: 500 }
    );
  }
}

// PUT update vinyl record
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check here
    const { id } = params;
    const body: UpdateVinylRecordPayload = await req.json();

    // Check if record exists
    const existingRecord = await prisma.vinylRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    const updatedRecord = await prisma.vinylRecord.update({
      where: { id },
      data: {
        title: body.title || existingRecord.title,
        artist: body.artist || existingRecord.artist,
        year: body.year !== undefined ? body.year : existingRecord.year,
        genre: body.genre !== undefined ? body.genre : existingRecord.genre,
        description: body.description !== undefined ? body.description : existingRecord.description,
        updatedAt: new Date(),
      },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedRecord,
    });
  } catch (error) {
    console.error('Error updating vinyl record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update vinyl record' },
      { status: 500 }
    );
  }
}

// DELETE vinyl record
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check here
    const { id } = params;

    // Check if record exists
    const record = await prisma.vinylRecord.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    // TODO: Delete images from Cloudinary/Vercel Blob before deleting records
    // For each image in record.images, call cloud storage delete API

    // Delete vinyl record (images will be cascade deleted)
    await prisma.vinylRecord.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Vinyl record deleted successfully',
      deletedImagesCount: record.images.length,
    });
  } catch (error) {
    console.error('Error deleting vinyl record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete vinyl record' },
      { status: 500 }
    );
  }
}
