"use client";
import { useRouter } from "next/navigation";

export function useNavigation() {
  const history = useRouter();
  return { history };
}
