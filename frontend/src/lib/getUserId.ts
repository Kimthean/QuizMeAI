import { getAuthSession } from "./nextauth";

const getUserid = async () => {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  return session.user.id;
};

export default getUserid;
