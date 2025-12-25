import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { UpdateVinylRecordPayload } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: any
) {
  const { id } = await params;

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

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching vinyl record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vinyl record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  const { id } = await params;

  try {
    const body: UpdateVinylRecordPayload = await req.json();
    const existing = await prisma.vinylRecord.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.vinylRecord.update({
      where: { id },
      data: {
        title: body.title || existing.title,
        artist: body.artist || existing.artist,
        year: body.year !== undefined ? body.year : existing.year,
        genre: body.genre !== undefined ? body.genre : existing.genre,
        description: body.description !== undefined ? body.description : existing.description,
        updatedAt: new Date(),
      },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating vinyl record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update vinyl record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  const { id } = await params;

  try {
    const record = await prisma.vinylRecord.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Vinyl record not found' },
        { status: 404 }
      );
    }

    await prisma.vinylRecord.delete({ where: { id } });

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
