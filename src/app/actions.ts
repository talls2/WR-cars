"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- VEHICLE ACTIONS ---

export async function addVehicleByVin(vin: string) {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
    );
    const data = await response.json();
    const results = data.Results;
    const getVal = (id: number) =>
      results.find((r: any) => r.VariableId === id)?.Value;

    const existing = await prisma.vehicle.findUnique({ where: { vin } });
    if (existing) return { success: false, message: "Vehicle already in stock!" };

    await prisma.vehicle.create({
      data: {
        vin: vin,
        stockNumber: `STK-${Math.floor(Math.random() * 10000)}`,
        year: parseInt(getVal(29)) || 2024,
        make: getVal(26) || "Unknown",
        model: getVal(28) || "Unknown",
        trim: getVal(34),
        bodyType: getVal(5),
        mileage: 0,
        cost: 0,
        listPrice: 0,
        color: "Pending",
        status: "IN_STOCK",
      },
    });

    revalidatePath("/");
    return { success: true, message: "Vehicle decoded and added!" };
  } catch (e) {
    return { success: false, message: "Failed to decode VIN." };
  }
}

export async function addImageToVehicle(vehicleId: string, imageUrl: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return;

  const currentImages = vehicle.images || [];
  
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      images: [...currentImages, imageUrl]
    }
  });
  
  revalidatePath("/");
  return { success: true };
}

export async function updateVehicle(id: string, formData: any) {
  await prisma.vehicle.update({
    where: { id },
    data: {
      listPrice: Number(formData.listPrice),
      cost: Number(formData.cost),
      mileage: Number(formData.mileage),
      color: formData.color,
      status: formData.status,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function getInventory() {
  const rawData = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  return rawData.map((car) => ({
    ...car,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
    cost: Number(car.cost),
    listPrice: Number(car.listPrice),
    kbbValue: car.kbbValue ? Number(car.kbbValue) : null,
    mmrValue: car.mmrValue ? Number(car.mmrValue) : null,
  }));
}

// --- CRM / CUSTOMER ACTIONS ---

export async function addCustomer(data: { firstName: string; lastName: string; phone: string; email: string }) {
  await prisma.customer.create({
    data: data,
  });
  revalidatePath("/");
  return { success: true };
}

export async function getCustomers() {
  return await prisma.customer.findMany({ orderBy: { lastName: "asc" } });
}