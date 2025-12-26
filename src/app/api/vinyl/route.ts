import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateVinylRecordPayload, UpdateVinylRecordPayload } from '@/types';

// GET all vinyl records with search and filter support
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;

    // Fetch all records first, then filter in memory for better SQLite compatibility
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

    // Filter records based on search and genre/year
    let filteredRecords = records;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredRecords = filteredRecords.filter(record =>
        record.title.toLowerCase().includes(searchLower) ||
        record.artist.toLowerCase().includes(searchLower) ||
        record.genre?.toLowerCase().includes(searchLower) ||
        (record.description?.toLowerCase().includes(searchLower) || false)
      );
    }

    if (genre) {
      const genreLower = genre.toLowerCase();
      filteredRecords = filteredRecords.filter(record =>
        record.genre?.toLowerCase().includes(genreLower)
      );
    }

    if (year) {
      filteredRecords = filteredRecords.filter(record => record.year === year);
    }

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
      data: filteredRecords,
      filters: {
        genres: genres.map(g => g.genre).filter(Boolean),
        years: years.map(y => y.year).filter(Boolean),
      },
      count: filteredRecords.length,
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
