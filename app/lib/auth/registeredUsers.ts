import { supabaseAdmin } from "@/app/lib/supabase/server";

export type AppRole = "student" | "teacher" | "admin";

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  active: boolean;
  detail?: string;
  dni?: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  active: boolean;
  detail?: string;
  dni_encrypted?: string;
}

const USER_COLUMNS = "id, name, email, role, active, detail, dni_encrypted";

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const mapRow = (row: UserRow): RegisteredUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  active: row.active,
  detail: row.detail ?? undefined,
});

const decryptUserDni = async (id: number): Promise<string | undefined> => {
  const encryptionKey = process.env.DNI_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("DNI_ENCRYPTION_KEY no configurada en variables de entorno");
  }

  const { data, error } = await supabaseAdmin.rpc("get_user_dni_secure", {
    p_user_id: id,
    p_encryption_key: encryptionKey,
  });

  if (error) {
    console.error("Error desencriptando DNI:", error);
    return undefined;
  }

  return (data as string) ?? undefined;
};

export const getRegisteredUsers = async (): Promise<RegisteredUser[]> => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(USER_COLUMNS)
    .order("id");
    

  if (error) {
    throw new Error(`No se pudieron cargar los usuarios en registro: ${error.message}`);
  }

  const users = (data ?? []) as UserRow[];
  return await Promise.all(
    users.map(async (row) => {
      const user = mapRow(row);
      user.dni = await decryptUserDni(user.id);
      return user;
    }),
  );
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

  if (!data) {
    return undefined;
  }

  const user = mapRow(data);
  user.dni = await decryptUserDni(user.id);
  return user;
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

  if (!data) {
    return undefined;
  }

  const user = mapRow(data);
  user.dni = await decryptUserDni(user.id);
  return user;
};

export const updateRegisteredUser = async (
  id: number,
  patch: Pick<RegisteredUser, "name" | "email" | "active" | "detail" | "dni">,
): Promise<RegisteredUser> => {
  const updateData: Record<string, unknown> = {
    name: patch.name,
    email: normalizeEmail(patch.email),
    active: patch.active,
  };

  if (patch.detail !== undefined) {
    updateData.detail = patch.detail;
  }

  const executeUpdate = async (dataToUpdate: Record<string, unknown>) => {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(dataToUpdate)
      .eq("id", id)
      .select(USER_COLUMNS)
      .single();

    if (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: unknown }).message ?? JSON.stringify(error))
          : String(error);
      throw new Error(message);
    }

    return data;
  };

  try {
    // Actualizar nombre, email, active y detail
    const data = await executeUpdate(updateData);
    
    if (patch.dni !== undefined) {
      const encryptionKey = process.env.DNI_ENCRYPTION_KEY;
      if (!encryptionKey) {
        throw new Error("DNI_ENCRYPTION_KEY no configurada en variables de entorno");
      }

      const { error: dniError } = await supabaseAdmin.rpc("update_user_dni_secure", {
        p_user_id: id,
        p_dni: patch.dni,
        p_encryption_key: encryptionKey,
      });

      if (dniError) {
        throw new Error(`Error actualizando DNI: ${dniError.message}`);
      }
    }

    const user = mapRow(data);
    user.dni = await decryptUserDni(id);
    return user;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: unknown }).message)
        : String(error);

    if (
      patch.detail !== undefined &&
      errorMessage.toLowerCase().includes("detail does not exist")
    ) {
      delete updateData.detail;
      const data = await executeUpdate(updateData);
      return mapRow(data);
    }

    throw new Error(`No se pudo actualizar el usuario: ${errorMessage}`);
  }
};

// Función helper para desencriptar el DNI
export const getDecryptedUserDni = async (id: number): Promise<string | null> => {
  const encryptionKey = process.env.DNI_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("DNI_ENCRYPTION_KEY no configurada en variables de entorno");
  }

  const { data, error } = await supabaseAdmin.rpc("get_user_dni_secure", {
    p_user_id: id,
    p_encryption_key: encryptionKey,
  });

  if (error) {
    console.error("Error desencriptando DNI:", error);
    return null;
  }

  return data ?? null;
};

export const deleteRegisteredUser = async (id: number): Promise<void> => {
  const { error } = await supabaseAdmin.from("users").delete().eq("id", id);

  if (error) {
    throw new Error(`No se pudo eliminar el usuario: ${error.message}`);
  }
};
