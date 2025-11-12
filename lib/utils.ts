import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomElFromArr = (array: readonly unknown[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
