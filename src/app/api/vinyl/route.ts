import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateVinylRecordPayload, UpdateVinylRecordPayload } from '@/types';

// GET all vinyl records
export async function GET() {
  try {
    const records = await prisma.vinylRecord.findMany({
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching vinyl records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vinyl records' },
      { status: 500 }
    );
  }
}

// POST create new vinyl record
export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication check here
    const body: CreateVinylRecordPayload = await req.json();

    // Validate required fields
    if (!body.title || !body.artist) {
      return NextResponse.json(
        { success: false, error: 'Title and artist are required' },
        { status: 400 }
      );
    }

    const record = await prisma.vinylRecord.create({
      data: {
        title: body.title,
        artist: body.artist,
        year: body.year,
        genre: body.genre,
        description: body.description,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(
      { success: true, data: record },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating vinyl record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create vinyl record' },
      { status: 500 }
    );
  }
}
