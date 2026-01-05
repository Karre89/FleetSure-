import { PrismaClient, UserRole, JobStatus, JobUrgency, JobType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding FleetSure database...')

  const passwordHash = await bcrypt.hash('demo1234', 12)

  // Check if demo data already exists
  const existingFleet = await prisma.user.findUnique({ where: { email: 'demo@fleet.com' } })
  if (existingFleet) {
    console.log('Demo data already exists. Skipping seed.')
    return
  }

  // Create Demo Fleet with User and Vehicles
  console.log('Creating demo fleet...')
  const fleet = await prisma.fleet.create({
    data: {
      name: 'Northwest Freight Lines',
      address: '1200 Industrial Way, Seattle, WA 98108',
      billingEmail: 'billing@nwfreight.com',
      phone: '(206) 555-1200',
      users: {
        create: {
          email: 'demo@fleet.com',
          passwordHash,
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '(206) 555-1201',
          role: UserRole.FLEET_OWNER,
        },
      },
    },
  })

  // Create vehicles for the fleet
  await prisma.vehicle.createMany({
    data: [
      {
        fleetId: fleet.id,
        unitNumber: 'NWF-101',
        vin: '1FUJGLDR7CLBP8834',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2022,
        licensePlate: 'WA-TRK-101',
        vehicleType: 'truck',
        engineType: 'diesel',
      },
      {
        fleetId: fleet.id,
        unitNumber: 'NWF-102',
        vin: '1FUJGLDR8CLBP9912',
        make: 'Kenworth',
        model: 'T680',
        year: 2021,
        licensePlate: 'WA-TRK-102',
        vehicleType: 'truck',
        engineType: 'diesel',
      },
      {
        fleetId: fleet.id,
        unitNumber: 'NWF-103',
        vin: '1FUJGLDR9DLCQ1123',
        make: 'Peterbilt',
        model: '579',
        year: 2023,
        licensePlate: 'WA-TRK-103',
        vehicleType: 'truck',
        engineType: 'diesel',
      },
    ],
  })

  // Create Demo Mechanic
  console.log('Creating demo mechanic...')
  const mechanic = await prisma.mechanic.create({
    data: {
      email: 'demo@mechanic.com',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      phone: '(206) 555-3001',
      isAvailable: true,
      isOnline: true,
      currentLatitude: 47.5912,
      currentLongitude: -122.3352,
      businessName: 'Rodriguez Diesel Repair',
      averageRating: 4.8,
      totalJobs: 127,
      totalReviews: 98,
      isApproved: true,
      approvedAt: new Date(),
    },
  })

  // Create Demo Runner
  console.log('Creating demo runner...')
  await prisma.runner.create({
    data: {
      email: 'demo@runner.com',
      passwordHash,
      firstName: 'Danny',
      lastName: 'Park',
      phone: '(206) 555-6001',
      isAvailable: true,
      isOnline: true,
      currentLatitude: 47.6101,
      currentLongitude: -122.2015,
      vehicleType: 'van',
      vehiclePlate: 'WA-RUN-001',
      totalDeliveries: 342,
      isApproved: true,
      approvedAt: new Date(),
    },
  })

  // Get the first vehicle for creating a job
  const vehicle = await prisma.vehicle.findFirst({ where: { fleetId: fleet.id } })

  // Create a demo job
  if (vehicle) {
    console.log('Creating demo job...')
    await prisma.job.create({
      data: {
        jobNumber: 'FS-2026-00001',
        fleetId: fleet.id,
        vehicleId: vehicle.id,
        mechanicId: mechanic.id,
        locationLatitude: 47.5412,
        locationLongitude: -122.3126,
        locationAddress: 'I-5 Northbound near Airport Way, Seattle, WA',
        locationCity: 'Seattle',
        locationState: 'WA',
        issueType: 'engine',
        issueDescription: 'Engine overheating, coolant leak detected. Truck stranded on I-5.',
        urgency: JobUrgency.PRIORITY,
        jobType: JobType.ROADSIDE,
        status: JobStatus.EN_ROUTE,
        requestedAt: new Date(Date.now() - 20 * 60000),
        assignedAt: new Date(Date.now() - 15 * 60000),
        acceptedAt: new Date(Date.now() - 12 * 60000),
      },
    })
  }

  console.log(`
===================================
FleetSure Seed Completed!
===================================

Demo Accounts Created:
----------------------
Fleet Owner: demo@fleet.com / demo1234
Mechanic: demo@mechanic.com / demo1234
Runner: demo@runner.com / demo1234

Data Created:
-------------
- 1 Fleet with 3 vehicles
- 1 Mechanic
- 1 Runner
- 1 Active job
  `)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
