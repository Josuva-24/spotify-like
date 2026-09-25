import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Studio | SoundWave Audio Streaming",
  description: "Manage and curate your music catalog connected to Supabase and Cloudinary",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
