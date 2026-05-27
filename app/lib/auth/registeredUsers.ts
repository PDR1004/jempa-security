import { supabaseAdmin } from "@/app/lib/supabase/server";

export type AppRole = "student" | "teacher" | "admin";

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  active: boolean;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  active: boolean;
}

const USER_COLUMNS = "id, name, email, role, active";

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const mapRow = (row: UserRow): RegisteredUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  active: row.active,
});

export const getRegisteredUsers = async (): Promise<RegisteredUser[]> => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(USER_COLUMNS)
    .order("id");
    

  if (error) {
    throw new Error(`No se pudieron cargar los usuarios en registro: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
};

export const findRegisteredUserByEmail = async (
  email: string | null | undefined,
): Promise<RegisteredUser | undefined> => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return undefined;
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select(USER_COLUMNS)
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo buscar el usuario por email: ${error.message}`);
  }

  return data ? mapRow(data) : undefined;
};

export const findRegisteredUserById = async (
  id: number,
): Promise<RegisteredUser | undefined> => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(USER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo buscar el usuario por ID: ${error.message}`);
  }

  return data ? mapRow(data) : undefined;
};

export const updateRegisteredUser = async (
  id: number,
  patch: Pick<RegisteredUser, "name" | "email" | "active">,
): Promise<RegisteredUser> => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      name: patch.name,
      email: normalizeEmail(patch.email),
      active: patch.active,
    })
    .eq("id", id)
    .select(USER_COLUMNS)
    .single();

  if (error) {
    throw new Error(`No se pudo actualizar el usuario: ${error.message}`);
  }

  return mapRow(data);
};

export const deleteRegisteredUser = async (id: number): Promise<void> => {
  const { error } = await supabaseAdmin.from("users").delete().eq("id", id);

  if (error) {
    throw new Error(`No se pudo eliminar el usuario: ${error.message}`);
  }
};
