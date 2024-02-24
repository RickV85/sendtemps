import { UserLocation } from "../Classes/UserLocation";

// VERCEL POSTGRES DB CALLS

// For immediate DB update, bypass caching with this header:
// { cache: "no-store" }
// Otherwise use Next revalidation time in seconds:
// { next: { revalidate: 3600 } }
// which validates data at maximum once an hour

// default_locations

export async function getAllDefaultLocations() {
  try {
    const response = await fetch("/api/default_locations", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`Error in getAllDefaultLocations: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

// user_locations

export async function getAllUserLocations(userId: string) {
  try {
    const response = await fetch(`/api/user_locations?user_id=${userId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Error in getAllUserLocations: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUserLocationById(userId: string, id: string) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sendtemps.vercel.app";
  try {
    const response = await fetch(
      `${baseUrl}/api/user_locations?user_id=${userId}&id=${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Error in getUserLocationById: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

interface NewUserLoc {
  name: string;
  latitude: string;
  longitude: string;
  user_id: string;
  poi_type: string;
}

export async function postNewUserLocation(userLoc: NewUserLoc) {
  try {
    const response = await fetch("/api/user_locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLoc),
      credentials: "include",
    });

    if (response.status === 201) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(`Error response postNewUserLocation: ${errorData}`);
    }
  } catch (error) {
    throw error;
  }
}

export async function patchUserLocation(
  userLoc: UserLocation,
  changeCol: string,
  data: string
) {
  const reqBody = {
    id: userLoc.id,
    userId: userLoc.user_id,
    changeCol: changeCol,
    data: data,
  };
  try {
    const response = await fetch("/api/user_locations", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(`Error response patchUserLocation: ${errorData}`);
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteUserLocation(locId: number, userId: string) {
  const reqBody = {
    id: locId,
    user_id: userId,
  };
  try {
    const response = await fetch("/api/user_locations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(`Error response deleteUserLocation: ${errorData}`);
    }
  } catch (error) {
    throw error;
  }
}

// users

export const getUserInfoById = async (userId: string) => {
  try {
    const userInfoRes = await fetch(`/api/users?user_id=${userId}`);

    const userInfo = await userInfoRes.json();
    if (userInfoRes.ok) {
      return userInfo;
    } else {
      throw new Error(`Error response getUserInfoById: ${userInfo}`);
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserInfo = async (userInfoToUpdate: {
  id: string;
  email: string;
  name: string;
}) => {
  try {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfoToUpdate),
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(`Error response updateUserInfo: ${errorData}`);
    }
  } catch (error) {
    throw error;
  }
};
