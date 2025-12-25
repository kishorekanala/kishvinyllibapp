import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin user created: ${admin.email}`);

  // Create sample vinyl records
  const vinyl1 = await prisma.vinylRecord.create({
    data: {
      title: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      year: 1973,
      genre: 'Progressive Rock',
      description: 'A legendary concept album with themes of death and time.',
      images: {
        create: [
          {
            imageUrl: 'https://via.placeholder.com/400x400?text=Dark+Side+1',
            imagePublicId: 'dark-side-1',
            altText: 'The Dark Side of the Moon album cover',
            displayOrder: 1,
          },
        ],
      },
    },
  });
  console.log(`✓ Vinyl record created: ${vinyl1.title}`);

  const vinyl2 = await prisma.vinylRecord.create({
    data: {
      title: 'Abbey Road',
      artist: 'The Beatles',
      year: 1969,
      genre: 'Rock',
      description: 'The final album recorded by the Beatles.',
      images: {
        create: [
          {
            imageUrl: 'https://via.placeholder.com/400x400?text=Abbey+Road+1',
            imagePublicId: 'abbey-road-1',
            altText: 'Abbey Road album cover',
            displayOrder: 1,
          },
        ],
      },
    },
  });
  console.log(`✓ Vinyl record created: ${vinyl2.title}`);

  const vinyl3 = await prisma.vinylRecord.create({
    data: {
      title: 'Rumours',
      artist: 'Fleetwood Mac',
      year: 1977,
      genre: 'Rock',
      description: 'One of the best-selling albums of all time.',
      images: {
        create: [
          {
            imageUrl: 'https://via.placeholder.com/400x400?text=Rumours+1',
            imagePublicId: 'rumours-1',
            altText: 'Rumours album cover',
            displayOrder: 1,
          },
        ],
      },
    },
  });
  console.log(`✓ Vinyl record created: ${vinyl3.title}`);

  console.log('✅ Database seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
