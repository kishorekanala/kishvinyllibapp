import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateVinylRecordPayload, UpdateVinylRecordPayload } from '@/types';

// GET all vinyl records with search and filter support
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search')?.toLowerCase() || '';
    const genre = searchParams.get('genre')?.toLowerCase() || '';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;

    // Build where conditions dynamically
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { artist: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (genre) {
      where.genre = { contains: genre };
    }

    if (year) {
      where.year = year;
    }

    const records = await prisma.vinylRecord.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
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

    // Get unique genres for filter options
    const genres = await prisma.vinylRecord.findMany({
      distinct: ['genre'],
      select: { genre: true },
      where: { genre: { not: null } },
    });

    // Get unique years for filter options
    const years = await prisma.vinylRecord.findMany({
      distinct: ['year'],
      select: { year: true },
      where: { year: { not: null } },
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: records,
      filters: {
        genres: genres.map(g => g.genre).filter(Boolean),
        years: years.map(y => y.year).filter(Boolean),
      },
      count: records.length,
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
