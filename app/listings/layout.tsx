import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function ListingsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
    <section>{children}</section>)
  }