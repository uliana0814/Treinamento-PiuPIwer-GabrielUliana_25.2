import prisma from "@/backend/services/db";

export async function followUser(followerId: string, followingId: string) {
  // Cannot follow yourself
  if (followerId === followingId) {
    throw new Error("Você não pode seguir a si mesmo");
  }

  // Check if following user exists
  const userToFollow = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!userToFollow) {
    throw new Error("Usuário não encontrado");
  }

  // Check if already following
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    throw new Error("Você já segue este usuário");
  }

  return await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          location: true,
        },
      },
    },
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  // Check if follow exists
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (!existingFollow) {
    throw new Error("Você não segue este usuário");
  }

  return await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

export async function getFollowers(userId: string, page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;

  const [follows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
            _count: {
              select: {
                followers: true,
                following: true,
                posts: true,
              },
            },
          },
        },
      },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);

  return {
    followers: follows.map(f => f.follower),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFollowing(userId: string, page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;

  const [follows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
            _count: {
              select: {
                followers: true,
                following: true,
                posts: true,
              },
            },
          },
        },
      },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return {
    following: follows.map(f => f.following),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return !!follow;
}
